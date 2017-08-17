	
//搜索框
var topKeyWords = $.cookie("keyword");
	$('#ss').searchbox({ 
		prompt:'输入楼盘名称', 
		width:"300px",
		height:"30px",  
		value:topKeyWords,
		searcher:function(value){ 
			$().shown(value);
			//放入缓存
			$.cookie("keyword",value);
			//显示
			
			}, 
		}); 
	$(function(){
		//搜索执行的方法		
		$.fn.shown = function(value){
			//ajax 给关键字赋值
			 $.ajax({
				 url: "setKeyWord",
				 type: "post",
				 data: {keyword:value},
				 success:function(){
						$("#did").datagrid("reload");
				 },
				 
			 })
		}
		
	})