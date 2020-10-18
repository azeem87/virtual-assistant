import { NotFoundError } from 'error-middleware/errors';
import errorMiddleware from 'error-middleware';
import morganBody from 'morgan-body';
import path from 'path';
const textractHelper = require('aws-textract-helper')
const fs = require('fs');

const express = require('express');
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const formidable = require('formidable')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const context = process.env.CONTEXT || '/';

//add middleware's
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
morganBody(app, { logAllReqHeader: true });

app.use(express.static('public'));

app.post(`/ai/va`,(req,res,next) => {

    if(req.body?.query === 'init'){
        res.send( { isspelledcorrectly: true, response: 'Welcome to Emirates Virtual Agent' });
        return;
    }

    if(req.body?.query === 'A12345:check_rules'){
        res.send( { isspelledcorrectly: true, response: 'Your Booking has Following Travel Restrictions' });
        return;
    }

    if(req.body?.query.toLowerCase() === 'a12345'){
        res.send( { isspelledcorrectly: true,qresolved:true, 
		response: `1. Do you have a printed negative certificate for a COVID-19 PCR test taken within 96 hours before departure? <br>
		 2. The certificate must be for a polymerase chain reaction (PCR) test. <br>
		 3. You must have return approval from the General Directorate of Residency and Foreigners Affairs.`});
        return;
    }

    if(req.body?.prevresp === 'Do you have a printed negative certificate for a COVID-19 PCR test taken within 96 hours before departure?'  && req.body?.query.toLowerCase() === 'yes'){
        res.send( { isspelledcorrectly: true,qresolved:true,  response: 'Please upload the document' });
        return;
    }

    if(req.body?.prevresp === 'Do you have a printed negative certificate for a COVID-19 PCR test taken within 96 hours before departure?'  && req.body?.query.toLowerCase() === 'no'){
        res.send( { isspelledcorrectly: true,qresolved:true,  response: 'Sorry, You are not eligible to travel, Please apply for a pcr test' });
        return;
    }

   res.send( { isspelledcorrectly: true, response: "I couldn't understand please rephrase again" });
});

// ROUTE START //
app.get(`${context}`, (req, res) => res.send('Virtual Assistant APP!'));

// Support Only Single File Upload.
app.post('/upload', (req, res) => {
     const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
	   res.status(400).send('No files were uploaded.');
    }
      const fileContent = fs.readFileSync(files.file.path)
      const s3Params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${Date.now().toString()}-${files.file.name}`,
          Body: fileContent,
          ContentType: files.file.type,
          ACL: 'public-read'
      }
      const s3Content = await s3Upload(s3Params);
      const textractData = await documentExtract(s3Content.Key);

      const formData = textractHelper.createForm(textractData, { trimChars: [':', ' '] });

     // res.send( { title: 'Upload Results', formData });

      if(formData["Referral Clinic"] == undefined || formData["Released On"] == undefined ){
          return res.send({ isspelledcorrectly: true, response: "Your document is incorrect, Please upload pcr document  " });
      }

      if(formData["Request Date"] != undefined){
          const requestDate = new Date(formData["Request Date"].trim());
          const date2 = new Date();
          const diffTime = Math.abs(date2 - requestDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if(diffDays>4){
              return res.send({ isspelledcorrectly: true, response: "Your Document has expired " });
          }
      }

      if(formData["Referral Clinic"].trim() !== "HealthHub Qusais"){
          return res.send({ isspelledcorrectly: true, response: "This clinic is not authorized " });
      }

      return res.send({ isspelledcorrectly: true, response: "All good, documents are verified. Please proceed for checkin " });
  })
});

async function s3Upload (params) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    })
    return new Promise(resolve => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err)
                resolve(err)
            } else {
                resolve(data)
            }
        })
    })
}


async function documentExtract (key) {

 return new Promise(resolve => {
    var textract = new AWS.Textract({
      region: process.env.AWS_REGION,
      endpoint: `https://textract.${process.env.AWS_REGION}.amazonaws.com/`,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    })
    var params = {
      Document: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET,
          Name: key
        }
      },
      FeatureTypes: ['FORMS']
    }

    textract.analyzeDocument(params,(err, data) => {
      if (err) {
        return resolve(err)
      } else {
        resolve(data)
      }
    })
  })
}

app.use(errorMiddleware);
// If no matches found, return 404
app.use((req, res) => {
  throw new NotFoundError();
});
// ROUTES END  //

//start app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
