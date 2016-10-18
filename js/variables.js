
var request, page = 1, pages = 1, toPaint = [], isComplete = true;

var selectors = {
    //filter

    search: '#btn-search',
    input : ' #input-search',
    formSearch : '#search-form',
    searchLabel: '#label-filter',
    
    //record carg
    infSearch: '#upshot-modal',
    btnBack : "#btn-back",
    episodes: '.episodes',
    

};

var pattAlfa = /\d|/;
