
var request, page = 1, pages = 1, toPaint = [], isComplete = true;

/*Input search movie*/

searchBy = function(text) {
    
    $(selectors.parent).html('');
    $(selectors.searchLabel).html(text);
    
    request = 'http://api.themoviedb.org/3/search/tv?query=' + text + '&api_key=2a6fd2d3356476f3bf594deb013e4f76';
    
    requestJson( request , getResults );
};

getResults = function(result) {
    
    page = result.page;
    pages = result.total_pages;
    
    if (result.total_results === 0) {
        $(selectors.searchLabel).html('Not results: ' + $(selectors.searchLabel).html());
        return;
    }
    
    paintResults(result.results);
};

paintResults = function(results) {
    
    if(!isComplete){

      var lastRow = $(".movies").find(".row").last(),
          missin = 3 - lastRow.find(selectors.movieItem).length,
          temp = results.splice(missin);
      
      paintOnlyItem(results.map(buildMovie),lastRow);
      isComplete = true;
      results = temp;
    }
    
    toPaint = results.splice(9);

    if (toPaint.length === 0){
        isComplete = false;
        if (page < pages){ 
            $.getJSON(request + '&page=' + (page + 1)).done(getResults);
        }
    }
    
    paintGrid(grid(results.map(buildMovie)));
};

grid = function(entries) {
    var i, size = entries.length - 1,
        result = [],
        row = [];
    for (i = 0; i < size; i++) {
        if ((i + 1) % 3 === 0){
            row.push(entries[i]);
            result.push(row);
            row = [];
            continue;
        }
        row.push(entries[i]);
    }
    row.push(entries[size]);
    result.push(row);
    return result;
};


paintGrid = function(grid) {
    
    var template = '<div class="row"></div>';
    
    grid.forEach(function(item) {
        
        var row = $(template);
        item.forEach(function(entry) {
            row.append(entry);
        });
        $(selectors.parent).append(row);
    
    });
};

paintOnlyItem = function(items, lastRow){
    for (var i = 0; i < items.length; i++) 
        lastRow.append(items[i]);
}

completeHandler = function(data, modal, entry) {
    
    var $element = $('div[data-id=' + entry.id + ']');
    
    $element.data('item', data);
    
    if(data.number_of_seasons !== 0){
        $(selectors.pagiation).html(pagination(data.number_of_seasons));
        $(selectors.pagiation).data('item', entry);
        completePage(entry, 1);
    }    
    
};

/*callbacks*/
clickManagement = function(e) {

    $(selectors.parent).hide();
    $(selectors.inf_movie).show();

    var modal = $(selectors.inf_movie),
        entry = this.parent().data('item'),
        uri = 'http://api.themoviedb.org/3/tv/' + entry.id + '?api_key=2a6fd2d3356476f3bf594deb013e4f76';
    
    requestJson( uri, function( data ) {
        return completeHandler( data, modal, entry );
    });
    
    modal.find('.modal-body  div.poster').html(buildMovie(entry).html());

};

insideImag = function(e) {

    var entry = this.parent().data('item'),
        parent = this.parent(),
        uri = "http://www.omdbapi.com/?t=" + entry.name + "&y=&plot=short&r=json";
    
    requestJson( uri, function(data){
        buildInfo(entry,data,parent);
    });

};

outImag = function(e) {
    this.parent().find('.' + selectors.summary).remove();
};

scrollWindow = function(e) {
    if ($(window).scrollTop() + $(window).innerHeight() < $(selectors.parent)[0].scrollHeight) return;
    paintResults(toPaint);
};

paginationManagement = function(e) {
    var entry = this.parent().parent().data('item');
    completePage(entry, this.parent().data('id'));
};


/*build movie parameters*/

buildMovie = function(entry) {
    
    var numRandon = Math.floor((Math.random() * 22) + 1);
    
    if (entry.poster_path === null) 
        entry.poster_path = '/'+defaultPoster[numRandon];
    
    var template = ['<div data-id=', entry.id, ' class="col-md-4 col-xs-4 movieItem rectangle">', '<img class="img-responsive center_img" src="http://image.tmdb.org/t/p/w500', entry.poster_path, '?api_key=2a6fd2d3356476f3bf594deb013e4f76" alt="">', '<h3>', '<a>' + entry.original_name + '</a>', '</h3>', '<div class="info_display">', '</div>', '</div>' ].join('');
    var $element = $(template);
    
    $element.data('item', entry);
    
    return $element;
};

buildInfo = function(entry, data, parent){
    
    var actors = "";


    if("False" !== data.Response && data.Actors !== "N/A" ){
        
        var splitActors = data.Actors.split(",");

        /*filter only three actors from API IMDB*/

        actors = splitActors.reduce(function(before,next,index){
            if(index > 2){
                return before;
            }else{
                if(typeof next !== "undefined"){
                    return before.concat(", "+next);
                }else{
                    return before;
                }

            }
        });
    
    }else{
        actors = "Not found";
    }

    result =  $([
        '<div class="', selectors.summary, '">',
        '<p> Vote Average: ', entry.vote_average, 
        '  Vote Count: ', entry.vote_count , '</p>', 
        '<p> Actors: ', actors , '</p>'
        ,'</div>'
        ].join(''));

     parent.find(".info_display").html(result); 
     
}

episodeList = function(season) {
    
    var i, result = [];
    for (i = 0; i < season.episodes.length; i++) 
        result.push('<li data-id=' + i + ' class="list-group-item">' + season.episodes[i].name + '</li>');
    
    return '<ul class="list-group">' + result.join('') + '</ul>';
};


completePage = function(serie, season) {
    
    var uri = 'http://api.themoviedb.org/3/tv/' + serie.id + '/season/' + season + '?api_key=2a6fd2d3356476f3bf594deb013e4f76';    
    
    requestJson(uri, function( data ) {
        
        var $element = $('div[data-id=' + serie.id + ']');
        var seasons = $element.data('seasons');
        if (!seasons) seasons = {};
        seasons[season] = data;
        $element.data('seasons', seasons);
        $(selectors.episodes).html(episodeList(data));
    
    });
};

pagination = function(seasons) {
    var i, results = [];
    for (i = 1; i <= seasons; i++) 
        results.push('<li data-id="' + i + '"><a>' + i + '</a></li>');
    
    return results.join('');
};
