define(['jquery','drag','fulltip'],function($,drag,fulltip){
    function Dialog(options){       
        options = options || {};
        if(options.constructor !== Object){
            options = {};
        }
        this.defaults = {
            title:"标题",
            asksure:"一个请求",
            text:"文字",
            left:null,
            top:null,
            okFn(){
                
            }
        }       
        $.extend(this.defaults,options);
        this.init = function(){
            this.bind();
        }
        this.init();
        new drag({
            targetEle: this.h3
            ,moveEle: this.diaDiv[0]
        })
    }
    Dialog.prototype = {
        bind(){
            this.diaDiv = this.createHTML();
            this.mask = this.createMask();
            this.h3 = this.diaDiv[0].querySelector("h3");

            this.position();
            this.closed();
            this.confirm();
            this.cancel();
            this.resize();
            this.center();
        }
        ,resize(){
            var _this = this;
            $(window).bind("resize",_this.debuncing(_this.center,500))
        }
        ,debuncing(fn,delay){
            var timer = null;
            return function(){
                var context = this;
                var args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fn.apply(context,args);
                },delay);
            }
        }
        ,center(){
            var _this = this;
            $(_this.diaDiv).css({
                left : ( $(window).width() - $(_this.diaDiv).outerWidth() )/2 + "px",
                top : ( $(window).height() - $(_this.diaDiv).outerHeight() )/2 + "px",
            })
        }
        ,createHTML(){
            var diaDiv = $("<div></div>");
            diaDiv.attr("id","full-tip");
            var diaHTML =  `<h3 class="title clearfix">
                                <span class="titleName">${this.defaults.title}</span>
                                <span class="close">×</span>
                            </h3>
                            <section class="content clearfix">
                                <div class="tips clearfix">
                                    <div class="asksure">
                                        ${this.defaults.asksure}
                                    </div>
                                    <div class="text">
                                        ${this.defaults.text}
                                    </div>
                                </div>
                                <div class="btnGroup">
                                    <span class="error"></span>
                                    <a href="javascript:void(0);" title="" class="confirm">确定</a>
                                    <a href="javascript:void(0);" title="" class="cancle">取消</a>
                                </div>
                            </section>`;
            diaDiv.html(diaHTML);
            $("body").append(diaDiv);
            diaDiv.css({
                "z-index" : "100"
            });
            window.diaDiv = diaDiv;
            return diaDiv;
        }
        ,createMask(){
            var mask = $("<div></div>");
            mask.addClass("mask");
            mask.css({
                "width":"100%",
                "height":"100%",
                "background":"#000",
                "opacity": ".5",
                "position":"fixed",
                "left":"0",
                "top":"0",
                "z-index":"99"
            });
            $("body").append(mask);
            return mask;
        }
        ,position(){
            var isLeft = this.defaults.left !== null && !isNaN(Number(this.defaults.left));
            var isTop = this.defaults.top !== null && !isNaN(Number(this.defaults.top));
            var top = ($(window).height() - $(this.diaDiv).outerHeight())/2;        
            var left = ($(window).width() - $(this.diaDiv).outerWidth())/2;

            if(isLeft && isTop){
                $(this.diaDiv).css({
                    top : this.defaults.top + "px",
                    left : this.defaults.left + "px"
                })
            }else if( isLeft ){
                $(this.diaDiv).css({
                    top : top + "px",
                    left : this.defaults.left + "px"
                })
            }else if( isTop ){
                $(this.diaDiv).css({
                    top : this.defaults.top + "px",
                    left : left + "px"
                })
            }else{
                $(this.diaDiv).css({
                    top : top + "px",
                    left : left + "px"
                })
            }
        }
        ,closed(){
            $("#full-tip .close").bind("click",function(){
                $("#full-tip").remove();
                $(".mask").remove();
            })
        }
        ,confirm(){     
            $(".btnGroup .confirm").bind("click",function(){
                $("#full-tip").remove();
                $(".mask").remove();
                fulltip("ok","好啊,那我们赶紧回家吧");
            })  
        }
        ,cancel(){
            $(".btnGroup .cancle").bind("click",function(){
                $("#full-tip").remove();
                $(".mask").remove();
                fulltip("warn","可是我想去吃烧烤~")
            })
        }  
    }
    return Dialog;
})
