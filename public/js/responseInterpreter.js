var parentWindow;

function parseResponse(responseObj){
	
	var messageFromServer = responseObj.isspelledcorrectly ?  responseObj.response : getSpelledResponse(responseObj.response);
	
	var liId= innerChatBoxUl.length;
	
	var uiTag = "<li id="+liId+" class='admin-ans'><div><i class='licon-adminico'></i><p>"+messageFromServer+"</p></br>";
	var recommemdationHtmlTag="";
	var moreInfoHtmlTag="";
	var similarTag="";
	
   if(isValidField(responseObj.moreinfo))
   {
	   moreInfoHtmlTag = getWrappedTag(responseObj.moreinfo,"<ul class='ans-list'>",simpleUrlWrapper);
	   
	   var moreInfoUrlList = responseObj.moreinfo.split(",");
	   
	   var firstUrlToNavigate = parseMoreInfoUrl(moreInfoUrlList[0]);
	   
	  // window.opener.document.location =  moreInfoUrlList[0];
	   topLocation(firstUrlToNavigate[0]);
   }
   
   if(isValidField(responseObj.recommendations))
	   recommemdationHtmlTag = getWrappedTag(responseObj.recommendations,"<ul class='url-list'><li><h4>Here�s more:</h4></li>",recommendationURLWrapper);
	
   if(isValidField(responseObj.emotion))
	   updateAvatarEmotion(responseObj.emotion);
	  
   if(isValidField(responseObj.similar))
	   similarTag = getWrappedTag(responseObj.similar,"<ul class='url-list'><li></li>",recommendationURLWrapper);
   
   return uiTag+moreInfoHtmlTag+recommemdationHtmlTag+similarTag+"</div></li>";
	
}

function isValidField(field){
	
	return (field!=null && field.length>0);
	
}

function highlightMatchedTerm(responseObj,content){
	
    var termHighlight = content.toLowerCase().replace(queryEntered,"<span style='font-weight:bold;color:#FCD209;'>" + queryEntered + "</span>");

    return termHighlight;
}

var topLocation = function(url) {
	
	if(window.opener==null)
		return;
	
	if(parentWindow==null)
		parentWindow = window.opener;
	
	parentWindow.location = url;
};

function getWrappedTag(content,headTag,hrefWrapper){
	
	var recommendationList = content.split(",");
	
	for (var i = 0; i < recommendationList.length; i++) 
		headTag = headTag+"<li>"+hrefWrapper(recommendationList[i])+"</li>";
	
	return headTag;
}

function recommendationURLWrapper(content){
	
	return "<a class='admin-ans recommedtag'>"+content+"</a>";
}

//moreinfo must be in the pattern of "abc.htm;link1" , abc.html is the href and link1 is the name of the href
function simpleUrlWrapper(content){
	
	var urlList = parseMoreInfoUrl(content);
	
	var url = urlList[0];
	var aliasName= content.indexOf(";")!=-1 ? urlList[1] : urlList[0];
	
	return "<a  href="+url+" target='_blank'>"+aliasName+"</a>";
}

function parseMoreInfoUrl(content){
	
   var urlList = content.split(";");
	
	return urlList;
}

function getSpelledResponse(content){
	
	
	return getWrappedTag(content,"<ul class='url-list'><li><h4>Agent</h4></li>",recommendationURLWrapper);
}

function updateAvatarEmotion(emotion){
	
	  //switch case based on emotion keyword
	  var emotionImg = 'Avatar_normal.png';
	  switch (emotion.toLowerCase())
	  {
	     case "happy":
	     {	 
	    	 emotionImg = 'Avatar_happy.png';
	    	 break;
	     }
	     case "sad":
	     {	 
	    	 emotionImg = 'Avatar_sad.png';
	    	break;
	     }
	    
	     case "thinking":
	     {	 
	    	 emotionImg = 'Avatar_thinking.png';
	    	break;
	     }
	     
	     case "speaking":
	     {	 
	    	emotionImg = 'Avatar_Speaking.png';
	    	break;
	     }
	  }
	  
	  chatAvatarImg.attr('src','img/'+emotionImg);
	  
}

function updateAvatarEmotion(emotion){
	
	  //switch case based on emotion keyword
	  var emotionImg = 'Avatar_normal.png';
	  switch (emotion)
	  {
	     case "happy":
	     {	 
	    	 emotionImg = 'Avatar_happy.png';
	    	 break;
	     }
	     case "sad":
	     {	 
	    	 emotionImg = 'Avatar_sad.png';
	    	break;
	     }
	    
	     case "thinking":
	     {	 
	    	 emotionImg = 'Avatar_thinking.png';
	    	break;
	     }
	     
	     case "speaking":
	     {	 
	    	emotionImg = 'Avatar_Speaking.png';
	    	break;
	     }
	  }
	  
	  chatAvatarImg.attr('src','img/'+emotionImg);
	  
}
