(function () {
    function autoSlide() {} //构造函数

    //初始化
    autoSlide.prototype.init = function (initParam) {
        this.dsq = null; //定时器
        this.speed = initParam.auto;
        this.initSlide(initParam); //轮播动画
    }

    autoSlide.prototype.initSlide = function (initParam) {
        var _this = this;//区分作用域
        var divEle = document.createElement("div");//创建一个图片列表box
        divEle.className = "slide-box";
        var divFocus = document.createElement("div");//创建一个图片焦点box
        divFocus.className = "slide-focus";
        for (var i = 0; i < initParam.slideLi.length; i++) {
            var slideItem = document.createElement("div");//创建图片项目
            var focusItem = document.createElement("span");
            focusItem.setAttribute("data-index", i);
            if (i == 0) {
                slideItem.className = "active"
                focusItem.className = "on";
            }
            //注意不要使用mousemove，会导致重复调用
            focusItem.onmouseover = function () {
                if (this.className.indexOf("on") < 0) {
                    //获取当前是第几个
                    //alert(this.getAttribute("data-index"));
                    divFocus.getElementsByClassName("on")[0].className = "";//清除之前的标记
                    this.className = "on";//设置当前的状态
                    divEle.getElementsByClassName("active")[0].className = "";//清除
                    //debugger
                    divEle.children[this.getAttribute("data-index")].className = "active";//设置当前的标记
                }
            }

            // debugger
            //querySelectorAll获取出来的是一个数组，所以要选择第几个
            slideItem.style.backgroundImage = "url('" + initParam.slideLi[i].querySelectorAll("img")[0].getAttribute("src") + "')";//这里也需要像css一样，写url();
            divEle.appendChild(slideItem);//存储到图片列表box
            divFocus.appendChild(focusItem);//存储span元素到图片焦点box
        }

        document.getElementById("slidePic").remove();
        var focus = document.getElementById("focus");
        focus.onmousemove = function(){//鼠标经过时候取消定时器
            if(this.speed){
                clearTimeout(_this.dsq);
            }
        }
        focus.onmouseout = function(){//鼠标离开的时候恢复自动播放
            if(this.speed){
                _this.autoPlays();
            }
        }

        focus.appendChild(divEle);
        focus.appendChild(divFocus);

        if(this.speed){
            this.autoPlays();
        }
    }
    autoSlide.prototype.autoPlays = function(){
        var _this = this;
        this.dsq = setTimeout(function(){
            var slideBox = document.getElementsByClassName("slide-box")[0].children;
            var slideFocus =
                document.getElementsByClassName("slide-focus")[0].children;
            var currFocus =
                Number(document.getElementsByClassName("slide-focus")[0].getElementsByClassName("on")[0].getAttribute("data-index"));//当前是第几张
            slideBox[currFocus].className = "";
            slideFocus[currFocus].className = "";
            console.log(currFocus+1);

            if((slideBox.length-1) <= currFocus){//当前标记等于长度减一，这里表示最后一个
                slideBox[0].className = "active";
                slideFocus[0].className = "on";

            }else{
                slideBox[currFocus+1].className = "active";
                slideFocus[currFocus+1].className = "on";

            }
            _this.autoPlays();
        },_this.speed);

    }
    var autoSlide=new autoSlide
    window["autoSlide"] = autoSlide;  //创建了命名空间
})() //自执行函数