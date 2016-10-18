
$(document).ready(function() {
    
    //$(selectors.input).hide();
    //$(selectors.inf_movie).hide();
    $(selectors.search).click(function() {
        $(selectors.infSearch).removeClass("fade");
        var value = $(selectors.input).val();
         if( value !== ""){
           searchBy(value); 
         }

    });

    

    $(selectors.btnBack).click(function() {
        $(selectors.infSearch).addClass("fade");

    });

    $(".img-check").click(function(){
        $(this).toggleClass("check");
    });


    $(selectors.input).keypress(function( event ) {

        var value = $(selectors.input).val();
        if( value !== "" && value.length < 11 && value.length > 5 ){
            searchBy(value);
        }
    });



    

});