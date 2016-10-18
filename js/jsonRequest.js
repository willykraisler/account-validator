
/*
	DATA COMPONENT
	Only is necessary a simple get to APIs IMDB 
	it was necessary to use several API because they are very 
	incomplete 
*/
requestJson = function(url, callback) {
	
	$.getJSON(url).done(callback);

}

