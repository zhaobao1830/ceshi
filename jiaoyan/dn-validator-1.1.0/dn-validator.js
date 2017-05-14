(function(root,factory,plug){
	factory(root.jQuery,plug);
})(window,function($,plug){
	//用户在使用插件时的默认参数
	var __DEFAULTS__ = {
		emit : "change"//默认change
	}
    var strRegex = new RegExp("^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$");

    //用来定义规则，用来给用户扩展
	var __RULES__ = {
		"required" : function(){
			return $(this).val()?true:false;
		},
		"regex" : function(){
			return new RegExp($(this).data("dnv-regex")).test($(this).val())
		},
		"email" : function(){
			return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val());
		},
		"website" : function(){
			return strRegex.test($(this).val());
		},
		"integer" : function(){
			return /^[1-9]+[0-9]*$/.test($(this).val());
		},
		"between" : function(){
			var range = $(this).data("dnv-between").split("-")
			var val = Number($(this).val());
			return val>=Number(range[0])&&val<=Number(range[1]);
		},
		"remote" : function(){
			var params = {};
			params[$(this).attr("name")] = $(this).val();
			$.getJSON($(this).data("dnv-remote"),params,function(data){
				alert(data);
			})
			return true;
		}
	}
	$.fn[plug] = function(options){
		$.extend(this,__DEFAULTS__,options);//扩展属性
		var emit = this.emit;
		//就是所有需要被验证的表单元素
		var $fileds = $(this).find("input,textarea,select").not("[type=submit],[type=reset]");
		$fileds.on(emit,function(){
			var $filed = $(this);
			var $group = $filed.parents(".form-group").removeClass("has-error has-success");//父元素
			$group.children("p").remove();//先把之前的信息都删除
			var result = true;//最终验证的结果
			$.each(__RULES__,function(rule,action){
				//判断是否被验证的表单域配置了对应的规则
				if($filed.data("dnv-"+rule)){
					var res = action.call($filed)
					$group.addClass(res?"has-success":"has-error")
					if(!res){
						$group.append("<p class='text-danger'>"+($filed.data("dnv-"+rule+"-message"))+"</p>");
					}
					return res;
				}
			})
		})
		this.on("submit",function(){
			var size1 = $fileds.size();
			$fileds.trigger(emit)
			var size2 = $fileds.parents(".form-group.has-success").size()
			if(size1===size2){
				this.submit()
			}else {
                return false;
            }
		})
	}
},"dnValidator");