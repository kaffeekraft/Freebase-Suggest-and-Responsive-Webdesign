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
		    console.log("search_query: " + search_query);     				// Display search query in console

	    // Adding callback=? to the URL makes jQuery do JSONP instead of XHR.
	    jQuery.getJSON("http://api.freebase.com/api/service/search?callback=?",
	                   {
							query: search_query,
							limit:12,
							start: offset,
						},
	                   displayResults
					);                     // Callback function

	    // This function is invoked when we get the result of our MQL query
	    function displayResults(response) {
	        showStatusSelectResult();
	        if (response.code == "/api/status/ok" && response.result) { // Check for success...
	            if(offset===0){
					search_results.children().remove();
				}
				var row = $("<div class='row'>");                       // Make a row
	            search_results.append(row.hide())                       // Keep it hidden
	            var results = response.result;                          // Get results.
				var results_length = results.length;
				
	            jQuery.each(results, function() {                       // Loop through results.
					if(this.image!=null){                               // Check if there is a image
						row.append($("<div class='four columns result'>").html("<h3>"+this.name+"</h3><div class='result_img'><img src='https://api.freebase.com/api/trans/image_thumb/"+this.image.id+"?maxwidth=400&maxheight=400'></div>"));								
					}
					else{
	                	row.append($("<div class='four columns result'>").html("<div class='row'><h3>"+this.name+"</h3>"));
					}

	            });
	            row.show("normal");                                     // Reveal the list
	        }
	        else {                                                      // On failure...
	            $('#search-status').children().remove();
	            $('#search-status').append('<div class="sixteen columns"><h2>Sorry no results found for "'+search_query+'"</h2></div>')      // Display no results status.
	        }
	    }
	}
	function showStatusSelectResult(){
	    $('#search-status').children().remove();
	    $('#search-status').append('<div class="sixteen columns"><h2>Select a result</h2></div>');
	}
	function showStatusSearching(){
	    $('#search-status').children().remove();
	    $('#search-status').append('<div class="sixteen columns"><h2>Searching...</h2></div>');
	    console.log('searching...')
	}
	$('#mysuggest').keypress(function(event){
	    showStatusSearching();
	    if(timer!=null){
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function(){
    	    search_query_cache = $('#mysuggest').val();
    	 	offset = 0;
    		search(search_query_cache);
	    },1000)
	});
	$('#more-button').click(function(){
		offset = offset+12;
		search(search_query_cache);
		});
		
	// Standard FB Suggest Box initialisierung
	$('#suggest-box').suggest().bind("fb-select", function(e, data) {alert(data.name + ", " + data.id);});
	
});