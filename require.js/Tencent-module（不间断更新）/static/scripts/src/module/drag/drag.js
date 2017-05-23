define(['jquery'],function($){
	function Drag(options) {
		if(typeof options === "undefined" || options.constructor !== Object) {
			throw new Error("传入的参数错误，必须是对象");
			return;
		}
		this.defaults = {
			targetEle: null,
			moveEle: null
		}
		$.extend(this.defaults,options);
		if(this.defaults.moveEle) {
			this.element = this.defaults.moveEle;
		} else {
			this.element = this.defaults.targetEle;
		}
		this.init = function(){
			this.bind();
		}
		this.init();
	}
	Drag.prototype = {
		constructor: Drag
		,bind() {
			this.defaults.targetEle.onmousedown = this.downFn.bind(this);
		}
		,downFn(ev) {
			this.disX = ev.clientX - this.element.offsetLeft;
			this.disY = ev.clientY - this.element.offsetTop;
			document.onmousemove = this.moveFn.bind(this);
			document.onmouseup = this.upFn;
			ev.preventDefault();
		}
		,moveFn(ev) {
			this.element.style.left = ev.clientX - this.disX + "px";
			this.element.style.top = ev.clientY - this.disY + "px";
		}
		,upFn() {
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
	return Drag;
})