//filter weird characters in the search inpust
alpha = function(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}


//make a clouse to inject context for each record card and separate its events
routerFunction = function(selector,
    callback) {
    return function(e) {
        var target = $(e.target),
            parent;
       
        if (!(parent = target.closest(selector)).length) return;
        callback.call(parent, e);
    };
};