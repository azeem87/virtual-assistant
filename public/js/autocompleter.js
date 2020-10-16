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
	            	 
	                 var t = this.label.replace(re,"<span style='font-weight:bold;color:#FCD209;'>" + $("#queryBox").val() + "</span>");
	              
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

