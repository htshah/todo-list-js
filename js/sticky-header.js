/**
* 	Sticky header plugin
*/
(function(){
    var headerEle = $(".header");

    // `headerPlaceHolderEle` acts a placeholder block for header element
    // with its actual height
    var headerPlaceHolderEle = $("<div class='header-placeholder'>");
    headerEle.after(headerPlaceHolderEle);

    // event to change headerPlaceHolderEle height
    // if the `headerEle` height changes
    headerEle.bind("heightChange",changeHeight);

    function changeHeight(){
        var height = $(this).outerHeight() + 10;
        headerPlaceHolderEle.css("height", height + "px");
    }

    headerEle.bind("shrink",function(){
        if(!headerEle.hasClass("shrinked-header")){
            headerEle.addClass("shrinked-header");
            var pos = headerEle.find(".calendar-timeline").position();
            headerEle.css("transform",`translateY(-${pos.top+10}px)`)
            headerEle.trigger("heightChange");
        }
    });

    headerEle.bind("expand",function(){
        if(headerEle.hasClass("shrinked-header")){
            headerEle.removeClass("shrinked-header");
            headerEle.css("transform", `translateY(0px)`)
            headerEle.trigger("heightChange");
        }
    });

    // inital event trigger to set height
    window.addEventListener("load",function(){
        headerEle.trigger("heightChange");
    });

    // shrinks the `headerEle` when window
    // is scrolled down after certian amount 
    // and expands `headerEle` when scrolled
    // up.
    var lastScroll = 0;
    var threshold = 30;
    $(window).scroll(function(){
        var scroll = $(window).scrollTop();
        if(Math.abs(scroll - lastScroll) < threshold) return;
        if(scroll >= 100){
            if(scroll < lastScroll){
                headerEle.trigger("expand");
            }else{
                headerEle.trigger("shrink");
            }
            
        }else{
            headerEle.trigger("expand");
        }
        lastScroll = scroll;
    });
})();