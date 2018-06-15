/**
 * 
 * @param object userOptions 
 * @param array seedList 
 */
function List(userOptions,seedList){
    // =========== Initialization ===========
    var container,template;
    var list = [];
    var lastId = 0;
    // set options
    var defaults = {
        attributes: ['name'],
        container: '.list-container',
        localStorage: 'todo-list',
        template: ".list-template",
        item: ".item-wrapper",
    };
    var options = _extendDefaults(defaults,userOptions);
    options["listIdAttr"] = "data-list-id";
    options["listId"] = "listId";
    
    var publicAPI = { options: options};

    // setup initial list
    _initList();
    _cacheDOM();
    _bindEvents();
    _render();

    // =========== Methods ===========
    function _extendDefaults(src,properties){
        for(var prop in properties){
            if(properties.hasOwnProperty(prop)){
                if(prop === "attributes"){
                    //convert all attributes to objects
                    for(var attr in properties[prop]){
                        if(typeof properties[prop][attr] === "string"){
                            properties[prop][attr] = { name: properties[prop][attr]};
                        }
                    }
                }

                src[prop] = properties[prop];
            }
        }
        return src;
    }

    function _initList(){
        var tmpList;
        // fetch list from localStorage
        if (options.localStorage !== false) {
            tmpList = JSON.parse(localStorage.getItem(options.localStorage));
        }
        if(!(tmpList instanceof Array)){
            tmpList = new Array;
        }
        // copy seedList to the existing list
        if (typeof seedList !== "undefined") {
            if (seedList.constructor.name.toLowerCase() === "object"){
                seedList = [seedList];
            }
            tmpList = tmpList.concat(seedList);
        }

        //get list-id to each element
        for(var i in tmpList){
            add(tmpList[i],false);
        }
    }

    function _htmlToElement(htmlStr){
        var tmp = document.createElement("template");
        tmp.innerHTML = htmlStr.trim();
        return tmp.content.firstChild;
    }

    function _cacheDOM(){
        container = document.querySelector(options.container);


        template = options.template;
        if (template.charAt(0) != '<') {    //Not a opening tag
            template = container.querySelector(template);
            if (template == null) {
                throw new Error("No template found for rendering..");
            }
            template = template.innerHTML;
        }
    }

    function _bindEvents(){
        //Bind unload event for localStorage
        if(options.localStorage !== false){
            window.addEventListener("unload",function(){
                localStorage.setItem(options.localStorage, JSON.stringify(list));
            });
        }
        // Bind attribute events
        for(var i in options.attributes){
            var attr = options.attributes[i];
            if(attr.hasOwnProperty("events")){
                for(var event in attr.events){
                    container.addEventListener(event,function(e){
                        var ele = e.srcElement;
                        if(e.target && e.target.matches(`.${this.name}`)){
                            var id = _getElementId(ele);
                            var item = _getItemFromArr(id,false);
                            this.events[event](publicAPI,id,item,ele);
                        }
                    }.bind(attr));
                }
            }
        }
    }

    function _render(){
        var tmpContainer = document.createElement("div");
        for(var i in list){
            var item = list[i];
            var ele = _htmlToElement(template);
            for(var j in options.attributes){
                var attr = options.attributes[j];
                var attrEle = ele.querySelector(`.${attr.name}`);

                if(attr.hasOwnProperty("render")){
                    attr.render(item[attr.name], attrEle);
                }else{
                    attrEle.innerHTML = item[attr.name];
                }
            }
            ele.setAttribute(options.listIdAttr, item[options.listId]);
            tmpContainer.appendChild(ele);
        }
        container.innerHTML = tmpContainer.innerHTML;
    }

    
    function _getElementId(ele){
        return ele.closest(options.item).getAttribute(options.listIdAttr);
    }
    function _getItemFromArr(id,returnRef = true){
        for(var i in list){
            if(list[i][options.listId] == id)
                return returnRef === true ? list[i]:Object.assign({},list[i]);
        }
        return null;
    }
    publicAPI.getListItem = _getItemFromArr;



    function add(item,render = true){
        item[options.listId] = ++lastId;
        list.push(item);
        if(render)
            _render();
    }
    // function delete(){}
    function update(id, values, render = true) {
      var item = _getItemFromArr(id);
      item = _extendDefaults(item, values);

      if (render == true) _render();
    }
    // function search(){}
    
    publicAPI.add = add;
    publicAPI.update = update;
    
    return publicAPI;
}

/**
 * Mustache template for todo
 * <script id="todo-template" type="text/template">
        {{#todos}}
        <div class="row todo-item-wrapper no-margin">
            <div class="col s12">
                <div class=" card todo-item no-margin z-depth-0">
                    <div class="grid-container justify-space-between card-content">
                        <span class="todo-tag" data-tag="red"></span>
                        <span class="todo-name normal-text bold-text">{{name}}</span>
                        <i class="todo-pin material-icons normal-text">outlined_flag</i>
                        <label style="justify-self:end;">
                            <input type="checkbox" {{#done}}checked="checked" {{/done}} class="todo-check">
                            <span></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        {{/todos}}
        {{^todos}}
        <div class="row no-margin">
            <h5 class="col s12 no-margin grey-text text-darken-1">nothing-to-do :)</h5>
        </div>
        {{/todos}}
    </script>
 */