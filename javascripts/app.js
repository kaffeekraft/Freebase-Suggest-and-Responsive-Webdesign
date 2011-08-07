/* 
* Skeleton V1.0.3
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 7/17/2011
*/	
	

$(document).ready(function() {


	/* Tabs Activiation
	================================================== */
	var tabs = $('ul.tabs');
	
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href') + "Tab";
			
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
			
				e.preventDefault();
			
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				
				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
				
			} 
		});
	});
	var offset = 0;
	var search_query_cache = "";
	var timer;
	var search_text_input = null;
	
	function search(search_query) {
		var search_results = $("#search-results");                          // Output goes here
		    //console.log("search_query: " + search_query);     				// Display search query in console

	    // Adding callback=? to the URL makes jQuery do JSONP instead of XHR.
	    jQuery.getJSON("http://api.freebase.com/api/service/search?callback=?",
	                   {
							query: search_query,
							limit:8,
							start: offset,
						},
	                   displayResults
					);                     // Callback function

	    // This function is invoked when we get the result of our MQL query
	    function displayResults(response) {
	        
	        if (response.code == "/api/status/ok" && response.result) { // Check for success...
	            if(response.result.length === 0){
					search_results.children().remove();
					$('#search-status').children().remove();
		            $('#search-status').append('<div class="sixteen columns"><h2>Sorry no results found for "'+search_query+'"</h2></div>')      // Display no results status.
				}
				else{
					showStatusSelectResult();
					if(offset===0){
						search_results.children().remove();
					}
					var row = $("<div class='row'>");                       // Make a row
		            search_results.append(row.hide())                       // Keep it hidden
		            var results = response.result;                          // Get results.
					var results_length = results.length;

		            jQuery.each(results, function() {                       // Loop through results.
		                if(this.image!=null && this.article!=null){                               // Check if there is a image
		                    var article = "";
		                    var result_guid = this.guid.slice(1);
		                    var item_id = this.id;
		                    row.append($("<div id='"+result_guid+"' class='eight columns result'>").html("<div class='result_img'><img src='https://api.freebase.com/api/trans/image_thumb/"+this.image.id+"?maxwidth=180&maxheight=180'></div><h5>"+this.name+"</h5>"));								
		                    $.getJSON('http://api.freebase.com/api/experimental/topic/basic?callback=?',
		                                    {
		                                    id:item_id,    
		                                    },
		                                    function(data) {
	                            if (data[item_id].code == "/api/status/ok" && data[item_id].result){
	                                $('#'+result_guid).append('<p class="fb-article">'+data[item_id].result.description+'</p>');
	                            }

	                            //console.log('Load was performed: '+article);
	                        });

						}
						else if(this.image!=null && this.article===null){                               // Check if there is a image
							row.append($("<div class='five columns result'>").html("<div class='result_img'><img src='https://api.freebase.com/api/trans/image_thumb/"+this.image.id+"'></div><h5>"+this.name+"</h5>"));								
						}
						else if(this.image==null && this.article!=null){
						    var article = "";
						    var result_guid = this.guid.slice(1);                               // Check if there is a image
							row.append($("<div class='eight columns result'>").html("<h5>"+this.name+"</h5>"));
							$.getJSON('https://api.freebase.com/api/trans/blurb'+this.article.id+"?callback=?&?maxlength=160", function(data) {
	                            if (data.code == "/api/status/ok" && data.result){
	                                $('#'+result_guid).append('<p class="fb-article">'+data.result.body+'</p>');    
	                            }
	                            //console.log('Load was performed: '+article);
	                        });								
						}
						else{
		                	row.append($("<div class='eight columns result'>").html("<h5>"+this.name+"</h5>"));
						}

		            });
		            row.show("normal");                                     // Reveal the list
				}
	        }
	        else {
				search_results.children().remove();                                                      // On failure, or on deleted query...
	            showStatusStartTyping();
	        }
	    }
	}
	function showStatusStartTyping(){
		$('#search-status').children().remove();
        $('#search-status').append('<div class="sixteen columns"><h2>Start typing to get suggestions...</h2></div>')      // Display no results status.
	}
	function showStatusSelectResult(){
	    $('#search-status').children().remove();
	    $('#search-status').append('<div class="sixteen columns"><h2>Select a result</h2></div>');
	}
	function showStatusSearching(){
	    $('#search-status').children().remove();
	    $('#search-status').append('<div class="sixteen columns"><h2>Searching...</h2></div>');
	    //console.log('searching...')
	}
	$('#mysuggest').keydown(function(event){
		function doSearch(){
			search_query_cache = $('#mysuggest').val();
    	 	offset = 0;
			clearTimeout(timer);
    		search(search_query_cache);
		}
		if (event.keyCode===13 || event.charCode===13 ||event.which === 13){
			event.preventDefault();
			doSearch();
		}
	    showStatusSearching();
	    if(timer!=null){
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function(){
    	    doSearch();
	    },1000)
	});
	$('#mysuggest').focus();
	showStatusStartTyping();
	$('#more-button').click(function(){
		offset = offset+8;
		search(search_query_cache);
		});
		
	// Standard FB Suggest Box initialisierung
	$('#suggest-box').suggest().bind("fb-select", function(e, data) {alert(data.name + ", " + data.id);});
	
});