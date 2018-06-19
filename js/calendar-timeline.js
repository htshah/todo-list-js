/**
 * Calendar Timeline
 * Author: Het Shah
 * Email: htshah60@gmail.com
 */
var CalendarTimeline = (function(){
    /**
    *	Initialization
    */
    var container = document.querySelector(".calendar-timeline");
    var template = 
        `<div class="calendar-item">
            <span class="calendar-day"></span>
            <span class="calendar-date"></span>
        </div>`;
    
    
    // Get current date
    var date = null;
    var currDate = null;
    var currMonth = null;
    var days = ['S','M','T','W','T','F','S'];
    
    
    _setDate(new Date().toString());
    _bindEvents();
    _render();
    
    /**
    *	Methods
    */
    function _htmlToElement(htmlStr) {
        var tmp = document.createElement("template");
        tmp.innerHTML = htmlStr.trim();
        return tmp.content.firstChild;
    }
    function _emmitChangeEvent(){
        var changeEvent = new CustomEvent("calendar-date-changed", { detail: date }, true);
        window.dispatchEvent(changeEvent);

    }
    function _bindEvents(){
        window.onload = function(){
            _emmitChangeEvent();
        };
        
        // Fix for confusion between mouse click and drag
        var isDragged = true;
        container.addEventListener("mousedown",function(){
            isDragged = false;
        },false);
        container.addEventListener("mousemove",function(){
            isDragged = true;
        },false);
        container.addEventListener("mouseup",function(e){
            if(!isDragged){
                var ele = e.srcElement.closest(".calendar-item");
                if (ele === null) return false;
                document.querySelector(".calendar-item.active").classList.remove("active");
                ele.classList.add("active");
                date.setDate(ele.querySelector(".calendar-date").innerHTML);

                _emmitChangeEvent();
            }
        },false);
    }

    function _render(){
        var tmpDate = new Date(date.toString());
        var content = "";
        //Set prev arrow
        var arrowEle = _htmlToElement(template);
        arrowEle.innerHTML = "&lt;";
        content+=arrowEle.innerHTML;
        for (var i = 1; ; i++) {
            tmpDate.setDate(i);
            if (tmpDate.getMonth() != currMonth) break;
            var ele = _htmlToElement(template);
            ele.querySelector(".calendar-day").innerHTML = days[tmpDate.getDay()];
            ele.querySelector(".calendar-date").innerHTML = i;
            if (i == currDate)
                ele.classList.add("active");
            content += ele.outerHTML;
        }
        //Set next arrow
        arrowEle.innerHTML = "&gt;";
        content += arrowEle.innerHTML;
        container.innerHTML = `<div class="calendar-dates dragscroll">${content}</div>`;

        // Scroll to the current date
        var activeItem = container.querySelector(".calendar-item.active");
        var offsetX = getOffset(activeItem).left;
        // var offsetErr = activeItem.offsetWidth;
        var offsetErr = 0;
        
        container.querySelector(".calendar-dates").scrollTo(offsetX - offsetErr, 0);
    }

    function getOffset(el) {
        el = el.getBoundingClientRect();
        return {
            left: el.left + window.scrollX,
            top: el.top + window.scrollY
        }
    }

    function _setDate(dateStr){
        date = new Date(dateStr);
        currDate = date.getDate();
        currMonth = date.getMonth();
    }

    function setDate(dateStr){
        _setDate(dateStr);
        _render();
        _emmitChangeEvent();
    }

    return {
        setDate: setDate,
    };
})();



/**
 * Polyfill for CustomEvents
 */
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();