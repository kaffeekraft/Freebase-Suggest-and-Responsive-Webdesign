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
	var search_query_backup = "";
	function search(search_query) {
		var search_results = $("#search-results");                          // Output goes here
		    console.log("search_query: " + search_query);     				// Display search query in console

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
	            if(offset===0){
					search_results.children().remove();
				}
				var row = $("<div class='row'>");                       // Make a row
	            search_results.append(row.hide())                  // Keep it hidden
	            var names = response.result;
				var results_length = names.length;         // Get names.
	            jQuery.each(names, function() {            // Loop through names.
					if(this.image!=null){
						var image_found = false;
						if(this.image.id.search(/wikipedia/)!=-1){
							image_found = true;
							row.append($("<div class='four columns result'>").html("<div class='row'><div class='two columns alpha'><h3>"+this.name+"</h3></div><div class='two columns omega'><img src='https://api.freebase.com/api/trans/image_thumb/"+this.image.id+"?maxwidth=400&maxheight=400'></div></div>"));								
						}
						if(image_found===false){
							row.append($("<div class='four columns result'>").html("<div class='row'><div class='four columns alpha'><h3>"+this.name+"</h3></div></div>")); // Make <div> for each.						
						}
					}
					else{
	                	row.append($("<div class='four columns result'>").html("<div class='row'><div class='four columns alpha'><h3>"+this.name+"</h3></div></div>"));
					}

	            });
	            row.show("normal");                        // Reveal the list
	        }
	        else {                                          // On failure...
	            search_results.append("Unknown: " + search_query);     // Display message.
	        }
	    }
	}
	$('#suggest-box').suggest().bind("fb-select", function(e, data) {alert(data.name + ", " + data.id);});
	$('#mysuggest').keypress(function(event){
		search_query_backup = $(this).val();
	 	offset = 0;
		search(search_query_backup);
		//$('#result').append(event);
	});
	$('#more-button').click(function(){
		offset = offset+10;
		search(search_query_backup);
		});
	
});