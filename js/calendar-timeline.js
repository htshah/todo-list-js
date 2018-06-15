/**
 * Calendar Timeline
 * Author: Het Shah
 * Email: htshah60@gmail.com
 */
(function(){
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
    var changeEvent = null;
    var date = new Date();
    var days = ['S','M','T','W','T','F','S'];
    var currDate = date.getDate();
    var currMonth = date.getMonth();
    
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

    function _bindEvents(){
        changeEvent = new CustomEvent("calendar-date-changed",{detail:date},true);
        
        window.onload = function(){
            window.dispatchEvent(changeEvent);
        }
        
        container.addEventListener("click",function(e){
            var ele = e.srcElement.closest(".calendar-item");
            if(ele === null)    return false;
            document.querySelector(".calendar-item.active").classList.remove("active");
            ele.classList.add("active");
            date.setDate(ele.querySelector(".calendar-date").innerHTML);

            window.dispatchEvent(changeEvent);
            // return false;
        });
    }

    function _render(){
        var content = "";
        for (var i = 1; ; i++) {
            date.setDate(i);
            if (date.getMonth() != currMonth) break;
            var ele = _htmlToElement(template);
            ele.querySelector(".calendar-day").innerHTML = days[date.getDay()];
            ele.querySelector(".calendar-date").innerHTML = i;
            if (i == currDate)
                ele.classList.add("active");
            content += ele.outerHTML;
        }
        container.innerHTML = `<div class="calendar-dates dragscroll">${content}</div>`;

        // Scroll to the current date
        var offsetX = getOffset(container.querySelector(".calendar-item.active")).left;
        container.querySelector(".calendar-dates").scrollTo(offsetX-30, 0);
    }

    function getOffset(el) {
        el = el.getBoundingClientRect();
        return {
            left: el.left + window.scrollX,
            top: el.top + window.scrollY
        }
    }
})();