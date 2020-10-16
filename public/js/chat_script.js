//! annyang
//! version : 1.4.0
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://www.TalAter.com/annyang/
(function(a){"use strict";var b=this,c=b.SpeechRecognition||b.webkitSpeechRecognition||b.mozSpeechRecognition||b.msSpeechRecognition||b.oSpeechRecognition;if(!c)return b.annyang=null,a;var d,e,f=[],g={start:[],error:[],end:[],result:[],resultMatch:[],resultNoMatch:[],errorNetwork:[],errorPermissionBlocked:[],errorPermissionDenied:[]},h=0,i=!1,j="font-weight: bold; color: #00f;",k=/\s*\((.*?)\)\s*/g,l=/(\(\?:[^)]+\))\?/g,m=/(\(\?)?:\w+/g,n=/\*\w+/g,o=/[\-{}\[\]+?.,\\\^$|#]/g,p=function(a){return a=a.replace(o,"\\$&").replace(k,"(?:$1)?").replace(m,function(a,b){return b?a:"([^\\s]+)"}).replace(n,"(.*?)").replace(l,"\\s*$1?\\s*"),new RegExp("^"+a+"$","i")},q=function(a){a.forEach(function(a){a.callback.apply(a.context)})},r=function(){s()||b.annyang.init({},!1)},s=function(){return d!==a};b.annyang={init:function(k,l){l=l===a?!0:!!l,d&&d.abort&&d.abort(),d=new c,d.maxAlternatives=5,d.continuous="http:"===b.location.protocol,d.lang="en-US",d.onstart=function(){q(g.start)},d.onerror=function(a){switch(q(g.error),a.error){case"network":q(g.errorNetwork);break;case"not-allowed":case"service-not-allowed":e=!1,q((new Date).getTime()-h<200?g.errorPermissionBlocked:g.errorPermissionDenied)}},d.onend=function(){if(q(g.end),e){var a=(new Date).getTime()-h;1e3>a?setTimeout(b.annyang.start,1e3-a):b.annyang.start()}},d.onresult=function(a){q(g.result);for(var c,d=a.results[a.resultIndex],e=0;e<d.length;e++){c=d[e].transcript.trim(),i&&b.console.log("Speech recognized: %c"+c,j);for(var h=0,k=f.length;k>h;h++){var l=f[h].command.exec(c);if(l){var m=l.slice(1);return i&&(b.console.log("command matched: %c"+f[h].originalPhrase,j),m.length&&b.console.log("with parameters",m)),f[h].callback.apply(this,m),q(g.resultMatch),!0}}}return q(g.resultNoMatch),!1},l&&(f=[]),k.length&&this.addCommands(k)},start:function(b){r(),b=b||{},e=b.autoRestart!==a?!!b.autoRestart:!0,h=(new Date).getTime(),d.start()},abort:function(){e=!1,s&&d.abort()},debug:function(a){i=arguments.length>0?!!a:!0},setLanguage:function(a){r(),d.lang=a},addCommands:function(a){var c,d;r();for(var e in a)if(a.hasOwnProperty(e)){if(c=b[a[e]]||a[e],"function"!=typeof c)continue;d=p(e),f.push({command:d,callback:c,originalPhrase:e})}i&&b.console.log("Commands successfully loaded: %c"+f.length,j)},removeCommands:function(b){return b===a?void(f=[]):(b=Array.isArray(b)?b:[b],void(f=f.filter(function(a){for(var c=0;c<b.length;c++)if(b[c]===a.originalPhrase)return!1;return!0})))},addCallback:function(c,d,e){if(g[c]!==a){var f=b[d]||d;"function"==typeof f&&g[c].push({callback:f,context:e||this})}}}}).call(this);
//! annyang end

//json2 start

if (!this.JSON) {
this.JSON = {};
}

(function () {

function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

if (typeof Date.prototype.toJSON !== 'function') {

    Date.prototype.toJSON = function (key) {

        return isFinite(this.valueOf()) ?
               this.getUTCFullYear()   + '-' +
             f(this.getUTCMonth() + 1) + '-' +
             f(this.getUTCDate())      + 'T' +
             f(this.getUTCHours())     + ':' +
             f(this.getUTCMinutes())   + ':' +
             f(this.getUTCSeconds())   + 'Z' : null;
    };

    String.prototype.toJSON =
    Number.prototype.toJSON =
    Boolean.prototype.toJSON = function (key) {
        return this.valueOf();
    };
}

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;


function quote(string) {

//If the string contains no control characters, no quote characters, and no
//backslash characters, then we can safely slap some quotes around it.
//Otherwise we must also replace the offending characters with safe escape
//sequences.

    escapable.lastIndex = 0;
    return escapable.test(string) ?
        '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
        '"' + string + '"';
}


function str(key, holder) {

//Produce a string from holder[key].

    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

//If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }

//If we were called with a replacer function, then call the replacer to
//obtain a replacement value.

    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }

//What happens next depends on the value's type.

    switch (typeof value) {
    case 'string':
        return quote(value);

    case 'number':

//JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value) ? String(value) : 'null';

    case 'boolean':
    case 'null':

//If the value is a boolean or null, convert it to a string. Note:
//typeof null does not produce 'null'. The case is included here in
//the remote chance that this gets fixed someday.

        return String(value);

//If the type is 'object', we might be dealing with an object or an array or
//null.

    case 'object':

//Due to a specification blunder in ECMAScript, typeof null is 'object',
//so watch out for that case.

        if (!value) {
            return 'null';
        }

//Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

//Is the value an array?

        if (Object.prototype.toString.apply(value) === '[object Array]') {

//The value is an array. Stringify every element. Use null as a placeholder
//for non-JSON values.

            length = value.length;
            for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || 'null';
            }

//Join all of the elements together, separated with commas, and wrap them in
//brackets.

            v = partial.length === 0 ? '[]' :
                gap ? '[\n' + gap +
                        partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                      '[' + partial.join(',') + ']';
            gap = mind;
            return v;
        }

//If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
                k = rep[i];
                if (typeof k === 'string') {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                }
            }
        } else {

//Otherwise, iterate through all of the keys in the object.

            for (k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                }
            }
        }

//Join all of the member texts together, separated with commas,
//and wrap them in braces.

        v = partial.length === 0 ? '{}' :
            gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                    mind + '}' : '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

//If the JSON object does not yet have a stringify method, give it one.

if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {

//The stringify method takes a value and an optional replacer, and an optional
//space parameter, and returns a JSON text. The replacer can be a function
//that can replace values, or an array of strings that will select the keys.
//A default replacer method can be provided. Use of the space parameter can
//produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

//If the space parameter is a number, make an indent string containing that
//many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

//If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

//If there is a replacer, it must be a function or an array.
//Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                 typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

//Make a fake root object containing our value under the key of ''.
//Return the result of stringifying the value.

        return str('', {'': value});
    };
}


//If the JSON object does not yet have a parse method, give it one.

if (typeof JSON.parse !== 'function') {
    JSON.parse = function (text, reviver) {

//The parse method takes a text and an optional reviver function, and returns
//a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

//The walk method is used to recursively walk the resulting structure so
//that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


//Parsing happens in four stages. In the first stage, we replace certain
//Unicode characters with escape sequences. JavaScript handles many characters
//incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

//In the second stage, we run the text against regular expressions that look
//for non-JSON patterns. We are especially concerned with '()' and 'new'
//because they can cause invocation, and '=' because it can cause mutation.
//But just to be safe, we want to reject all unexpected forms.

//We split the second stage into 4 regexp operations in order to work around
//crippling inefficiencies in IE's and Safari's regexp engines. First we
//replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
//replace all simple value tokens with ']' characters. Third, we delete all
//open brackets that follow a colon or comma or that begin the text. Finally,
//we look to see that the remaining characters are only whitespace or ']' or
//',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

//In the third stage we use the eval function to compile the text into a
//JavaScript structure. The '{' operator is subject to a syntactic ambiguity
//in JavaScript: it can begin a block or an object literal. We wrap the text
//in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

//In the optional fourth stage, we recursively walk the new structure, passing
//each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

//If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };
}
}());

//json2 end

//chat_script start
var isQuestionAsked = false;
var prevResponse="";
var queryTextArea;
var chatBoxDiv;
var chatBoxContainer;
var sendButton;
var innerChatBoxUl;
var suggestedDiv;
var chatAvatarImg;
var deviceAdapter;
var aiResponseMsg='';
var cid="";
var adjacencies="00";
var queryEntered="";
var host="";
var isInit=true;
	$(function(){


		//send init msg , get welcome response from server
		send_query(getParamQueryObj("init"));

		setTimeout(function (){
			send_query(getParamQueryObj("A12345:check_rules"));

			setTimeout(function (){
				send_query(getParamQueryObj("A12345"));
			},500);

		},500);

		queryTextArea = $("#queryBox");
		chatBoxDiv = $("div.chat-box");
		sendButton = $("#sendbtn");
		innerChatBoxUl = chatBoxDiv.find("ul");
		chatBoxContainer =$("div.chat-answers");
		suggestedDiv = $('#suggestionDiv');
		chatAvatarImg = $('img.chat_avatar');
		deviceAdapter = isDesktop() ? new DesktopAdapter() : new MobileAdapter();

		//add listerners
		queryTextArea.keypress(function(event){
			if ( event.which == 13){//on enter , do process
				sendButton.click();
				event.preventDefault();
			}
		});

		sendButton.click(function(event){

			onSendButtonClick(event);
			deviceAdapter.initOnce();
		});

	});

	function isDesktop(){

		return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
	}


	function onSendButtonClick(event){

		event.preventDefault();

		var newQuery = queryTextArea.val();

		if(newQuery.length==0 && isQuestionAsked==false)
			return;

		addUserQueryInChatBox(newQuery);

        //send user query to server, wait for response
		send_query(getParamQueryObj(newQuery));

		closeAutoCompleteDiv();
	}


	function addUserQueryInChatBox(newQuery){

		isQuestionAsked = true;

	    var userAskedTag = "<li class='user-qns'><div><i class='licon-userico'></i><p>"+newQuery+"</p></div></li>";

        queryEntered = queryTextArea.val();

	    queryTextArea.val("");//reset user query

		innerChatBoxUl.html(chatBoxDiv.html() + userAskedTag);

		scrollDownChatArea();
	}

	function scrollDownChatArea(){
		chatBoxContainer.animate({scrollTop: chatBoxContainer.prop("scrollHeight")});
	}


	function showResponseText(jsonResponseObj){

		$("a.recommendTag").unbind("click");

		var responseUI = parseResponse(jsonResponseObj);

		innerChatBoxUl.append(responseUI);

		scrollDownChatArea();

		configurePrevResponse(jsonResponseObj);

		cid = jsonResponseObj.cid;
		adjacencies = jsonResponseObj.adjacencies;


		$("a.recommedtag").click(function(event){

			setTextInQueryBox($(this).text());
		});

		deviceAdapter.speechResponseMessage(jsonResponseObj.response);
		deviceAdapter.setFocusInQueryTextInput();
	}

	function configurePrevResponse(jsonResponseObj){


		if(jsonResponseObj.qresolved)
			this.prevResponse = jsonResponseObj.response;

		if(jsonResponseObj.clearconversation)
			this.prevResponse = "";

	}

	function setTextInQueryBox(selectedItem){

		queryTextArea.val(selectedItem);
		closeAutoCompleteDiv();
		deviceAdapter.setFocusInQueryTextInput();
	}


	function send_query(params){

		var url = appendVaHostWithUrl('ai/va');

		$.ajax({
			type: 'POST',
			url: url,
			data : JSON.stringify(params),
			jsonpCallback: 'onAICalBack',
			contentType: "application/json",
			dataType: "text",
			error: function(xhr, status, error) {
				onAICalBack(JSON.stringify({"response":"error occured"}));
			},
			success: function(data) {
				onAICalBack(data);
			}
		});
	}


function onAICalBack(responseRawdata){

	//message must be in the form of json  ==> {message:" ",state:" "}

	var jsonResponseObj = JSON.parse( responseRawdata );

	if(this.isInit && jsonResponseObj.qresolved!=null && jsonResponseObj.qresolved==false)
	{
		this.adjacencies="";
		send_query(getParamQueryObj("Virtual Assistant"));
		this.isInit=false;
		return;
	}

	showResponseText(jsonResponseObj);

	isQuestionAsked = false;

	aiResponseMsg = jsonResponseObj.response;
	this.isInit=false;
}

function getParamQueryObj(queryMsg){

	var qparam ={};
	qparam.query = queryMsg;
	qparam.prevresp = this.prevResponse;
	qparam.cid = this.cid;
	qparam.adjacencies=this.adjacencies;

    return qparam;
}

function textToSpeak(word){

	return;

	if(window.speechSynthesis.speaking)
		window.speechSynthesis.cancel();

	var msg = new SpeechSynthesisUtterance();
	var speechSynParam = deviceAdapter.getSpeechSynthesisParam();

	msg.voiceURI = speechSynParam.voiceURI;
	msg.volume = speechSynParam.volume; // 0 to 1
	msg.rate = speechSynParam.rate; // 0.1 to 10
	msg.pitch = speechSynParam.pitch; //0 to 2
	msg.text = getHumanReadableWord(word);
	msg.lang = 'en-US';

	msg.onend = function(e) {
	  console.log('text spoken');
	};

	window.speechSynthesis.speak(msg);
}

//word may contain html tags, in that case, return general word
function getHumanReadableWord(word){

	var htmlRegex = /<.+?>|&.+?;/g;

	if(htmlRegex.test(word))
		return "Details are given below";

	return word;

}

//below codes are device adapter section(follows adapter design pattern), mobile adapter added for ipad support to fix the speech synthesis
//all speech synthesis code work for iphone and ipad only when it is called under a event callback

var MobileAdapter = (function () {
    function MobileAdapter() {
        this.previousAiResponse = "";

        // for ipad or iphone user, speech synthesis will work only, on user triggered action block.
        this.addVoiceClickListerner();

    }

    MobileAdapter.prototype.addVoiceClickListerner = function () {

    	$("#mockdiv").click(function(event){
            textToSpeak(deviceAdapter.getPreviousResponseFromAI());
        });
    };

    MobileAdapter.prototype.setFocusInQueryTextInput = function () {
    };
    MobileAdapter.prototype.speechResponseMessage = function (message) {
    	this.previousAiResponse = message;
    	$("#mockdiv").trigger('click');
    };

    MobileAdapter.prototype.getPreviousResponseFromAI = function () {
        return this.previousAiResponse;
    };

    MobileAdapter.prototype.getSpeechSynthesisParam = function () {
        return { voiceURI:'native',volume:1,rate: 0.1, pitch: 1 };
    };
    MobileAdapter.prototype.playWelcomeMessage = function () {
    };

    MobileAdapter.prototype.initOnce = function () {
    	textToSpeak('');//for ipad patch
    };

    return MobileAdapter;
})();
var DesktopAdapter = (function () {
    function DesktopAdapter() {
    }
    DesktopAdapter.prototype.setFocusInQueryTextInput = function () {
    	queryTextArea.focus();
    };
    DesktopAdapter.prototype.speechResponseMessage = function (message) {
    	textToSpeak(message);
    };
    DesktopAdapter.prototype.getSpeechSynthesisParam = function () {
        return {voiceURI:'native',volume:1,rate: 0.5, pitch: 2 };
    };
    DesktopAdapter.prototype.playWelcomeMessage = function () {

    };

    DesktopAdapter.prototype.getPreviousResponseFromAI = function () {
        return "";
    };


    DesktopAdapter.prototype.initOnce = function () {
    };

    return DesktopAdapter;
})();


function appendVaHostWithUrl(url){

	if(host.length==0)
		return url;

	var stringLength = host.length; // this will be 16
	var lastChar = host.charAt(stringLength - 1);

	if(lastChar=="/")
		return host+url;

	return host+"/"+url;
}

//chat_script end

//response interpreter start

var parentWindow;

function parseResponse(responseObj){

	var messageFromServer = responseObj.isspelledcorrectly ?  responseObj.response : getSpelledResponse(responseObj.response);

	var stringArray= messageFromServer.split("|");
	var message = stringArray[0];
	var optionString = stringArray[1];

	var liId= innerChatBoxUl.length;

	var uiTag = "<li id="+liId+" class='admin-ans'><div><i class='licon-adminico'></i><p>"+messageFromServer+"</p></br>";
	var recommemdationHtmlTag="";
	var moreInfoHtmlTag="";
	var similarTag="";

	var optionalListTag = "";

	if(isValidField(optionString)){
		optionalListTag = getWrappedTag(optionString,"<ul class='ans-list'>",simpleOptionWrapper);
	 }

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

   return uiTag+optionalListTag+moreInfoHtmlTag+recommemdationHtmlTag+similarTag+"</div></li>";

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

function simpleOptionWrapper(content){

	return "<span></span>"+content+"</a>";
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


//response intrepreter end


//autocomplete start

$(document).ready(function() {

    // Extend the autocomplete widget with a new "suggest" option.
    $.widget( "app.autocomplete", $.ui.autocomplete, {

                options: {
                    suggest: false
                },

                // Called when the autocomplete menu is about to be displayed.
                _suggest: function( items ) {

                    // If there's a "suggest" function, use it to render the
                    // items. Otherwise, use the default _suggest() implementation.
                    if ( $.isFunction( this.options.suggest ) ) {
                        return this.options.suggest( items );
                    }

                    this._super( items );

                }



     });

    //load auto complete text from server
   // loadAutoCompleteTextFromServer();
    initAutocompleteUI();

    $('body').click(function(event) {

    	var contentPanelId = jQuery(event.target).attr("class");

    	if(contentPanelId=="suggestedli")
    		return;

    	if(suggestedDiv.html().length>0)
    		closeAutoCompleteDiv();

    });

});//end of document load function

function loadAutoCompleteTextFromServer(){

	$.ajax({
		type: 'GET',
		url: "suggest",
		dataType: "text",
		error: function(xhr, status, error) {
			alert("error occured : suggestion text not loaded from server");
			console.error("auto complete suggested text loaded");
		},
		success: function(wordText) {
			console.info("auto complete suggested text loaded");
		    var wordlist = wordText.split(",");
		    wordlist.sort();
		    initAutocompleteUI(wordlist);
		}
	});

}

function initAutocompleteUI(){

	var dataUrl = appendVaHostWithUrl("suggest");

	 $("#queryBox").autocomplete({

	    	source: function(request, responseFn) {

	    		$.ajax({
	  	          url: dataUrl,
	  	          data: {
	  	            query: request.term
	  	          },contentType: "application/json",
	  			  dataType: "text",
	  	          success: function( data ) {
	  	        	  var jsonArray = JSON.parse(data);

	  	        	if(jsonArray.length==0 ||queryTextArea.val().length==0)
					{
		        		closeAutoCompleteDiv();
		        		return;
				    }

	  	        	responseFn( jsonArray );
	  	          }
	  	        });


	        },
	        suggest: function( items ) {

	        	if(items.length==0 ||queryTextArea.val().length==0)
				{
	        		closeAutoCompleteDiv();
	        		return;
			    }

	            var timeInMilli = 100;
	            suggestedDiv.animate({
	  	            height : '50%'
	  	        },timeInMilli);
	            suggestedDiv.empty();
	            suggestedDiv.css("padding","10px");

	            $.each( items, function() {

	            	 var re = new RegExp($("#queryBox").val(), "i") ;

	            	 var wordBoundryList = this.label.match(/\b\w+\b/g);

	            	 var finalReplacedStr = "";
	            	 for(var k=0;k<wordBoundryList.length;k++){
	            		 finalReplacedStr+= wordBoundryList[k].replace(re,"<span style='font-weight:bold;color:#FCD209;'>" + $("#queryBox").val() + "</span>")+" ";
	            	 }

	                 var t = this.label.replace(re,"<span class='suggest-highlight'>" + $("#queryBox").val() + "</span>");

	                 return $( "<li class='suggestedli' style='list-style-type: square;color:#FCD209'></li>" )
	                 .data( "item.autocomplete", this.label )
	                 .append( "<a class='suggestedlink' style='color:white'>" + t + "</a>" )
	                 .appendTo(suggestedDiv);
	            });

	            addClickListenerForSelectedLink();
	            scrollDownChatArea();
	        }
	    });

}//end of method

function closeAutoCompleteDiv(){

	suggestedDiv.empty();
	suggestedDiv.css("height","0%");
	suggestedDiv.css("padding","0");
}

function addClickListenerForSelectedLink(){


	var allHyperLinkTagsInSuggestedDiv = $("a.suggestedlink");

	allHyperLinkTagsInSuggestedDiv.bind('click',function(event){
		event.preventDefault();
		setTextInQueryBox($(this).text());
	});

}




//autocomplete end


