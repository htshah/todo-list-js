var todoList = {
	list:[],
	filters:{
		ALL:"all",
		CHCKED:"checked",
		UNCHCKED:"unchecked",
	},
	init:function(container){
		this.$container = $(container);
		this.currFilter = this.filters.ALL;

		// this.list = JSON.parse(localStorage.getItem('todo-list')) || [{ name: "Demo", done: false }];
		this.list = [{ name: "Demo", done: false }, { name: "Demo2", done: false },
	{ name: "Demo3", done: true },
];
		this.cacheDom();
		this.bindEvents();
		this.render();
	},
	cacheDom:function(){
		this.$input = this.$container.find("#todo-input");
		this.$addBtn = this.$container.find("#add-todo-btn");
		this.template = this.$container.find("#todo-template").html();
		this.$listContainer = this.$container.find("#todo-list");
		this.$pinnedListContainer = this.$container.find("#pinned-todo-list");

		this.$filterBox = this.$container.find("#todo-filter");
	},
	bindEvents:function(){
		this.$addBtn.click(this.addTodo.bind(this));
		this.$input.keyup(this.addOnEnterKey.bind(this));
		this.$listContainer.on('swipe','.todo-item-wrapper',this.deleteTodo.bind(this));
		this.$listContainer.on('click','.todo-check',this.checkTodo.bind(this));

		this.$filterBox.change(this.updateFilter.bind(this));

		$(window).on('beforeunload',this.saveState.bind(this));
	},
	render:function(){
		var filteredList = this.currFilter==this.filters.ALL ? this.list:_.filter(this.list,{done:this.currFilter==this.filters.CHCKED});
		var todos = {
			todos:filteredList,
		}
		this.$listContainer.html(Mustache.render(this.template,todos));
		this.$pinnedListContainer.html(Mustache.render(this.template,todos));
	},
	addOnEnterKey:function(e){
		if(e.which == 13)	this.addTodo();
	},
	addTodo:function(){
		var todo = this.$input.val();
		this.list.push({name:todo,done:false});

		this.$input.val("");
		this.render();
	},
	
	deleteTodo:function(event){
		console.log("swipe-left");
		var todo = this.getTodoEleName(event.target);
		var index = this.getTodoIndex(todo);

		this.list.splice(index,1);
		this.render();
	},
	checkTodo:function(event){
		var todo = this.getTodoEleName(event.target);
		var index = this.getTodoIndex(todo);
		this.list[index].done = $(event.target).is(":checked");

		// this.render();
	},
	getTodoEleName:function(ele){
		return $(ele).closest(".todo-item-wrapper").find(".todo-name").text();
	},
	getTodoIndex:function(name){
		return _.findIndex(this.list,{name:name});
	},
	updateFilter:function(){
		this.currFilter = this.$filterBox.find("option:selected").val();
		this.render();
	},

	saveState:function(){
		localStorage.setItem("todo-list",JSON.stringify(this.list));
	}
}

todoList.init('#todo-module');