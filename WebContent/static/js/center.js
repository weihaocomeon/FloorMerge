/*$(function(){*/

//控件显示
$("#did").datagrid({
	url: 'getDataByKeywordAndPage',
	fit:true ,
	rownumbers:true,
	title:"查询结果",
	singleSelect: false,
	fitColumns:false,
	striped:true,
	autoRowHeight:true,
	nowrap: true,	
	pagination:true,
	remoteSort:true,//服务器排序
	multiSort:false,
	selectOnCheck:true,
	checkOnSelect:true,
	onDblClickRow: function(index,row){
		showWindow('#singleWind','单户信息详情');
		showDid3(row,'100%');
		
	},	
	columns: [columZ],
	toolbar: [{
		text:'比较',
		iconCls: 'icon-open',
		handler: function(){
			//拿到所有的选中列的tstybm
			var rows = getAllselect('#did');
			if(rows.length==2){
				//新窗口
				showWindow('#wind','户信息详情');
				showDid1(rows[0],rows[1]);
				showDid2(rows[1],rows[0],'50%');
			}
			else if(rows.length>2){
				showMsg("友情提示","请选择两行后使用该功能,请取消多选",'warning')
			}else{
				showMsg("友情提示","请选择两行后使用该功能",'warning')
			}
		}
	},'-',{
		text:'删除',
		iconCls: 'icon-remove',
		handler: function(){
			deleteZ('#did');
		}
	},
	'-',{
		text:'取消选择',
		iconCls: 'icon-clean',
		handler: function(){
			cleanAllCheck('#did');
		}
	},
	'-',{
		text:'刷新',
		iconCls: 'icon-reload',
		handler: function(){
			reloadDatagrid('#did');
		}
	}
	]

})

//刷新表格
function reloadDatagrid(id){
	$(id).datagrid('reload');
}

//获得选择行
function getAllselect(id){
	var rows = '';
	rows = $(id).datagrid('getSelections');
	return rows;
}

function showMsg(msgTitle,msg,icon){
	$.messager.alert(msgTitle,msg,icon);
}

function showWindow(id,title){
	$(id).window({
		module:true,
		collapsible:true,
		title:title,
		
	});	
}

function showDid1(row,row2){
	keywords1="";
	lsztybm1=row.TSTYBM;
	//户信息的详情页数据表格
	$('#pan1').panel({
		title:row.FWZL+'>'+row.ZDTYBM,
		width:'100%',
		height:'50%',
		border:false,
	});
	$('#windDid1').datagrid({
		//以下是排序
		url: 'getHouseData',
		queryParams: {
			tstybm: row.TSTYBM,
			keyword: keywords1,
		},
		rownumbers:true,
		fit:true ,
		loadMsg:'数据加载中...',
		pagePosition:'top',
		striped:true,
		singleSelect:false,
		nowrap: true,
		selectOnCheck:true,
		checkOnSelect:true,
		pageList:[3,5,10],
		pagination:true,
		remoteSort:true,//服务器排序
		multiSort:false,//禁止多列排序允许 目前该工具只做到可以单列排序 多列允许排序但只遵循单列规则
		columns: [columH],
		onDblClickRow:function(index,row){
			EditH(index,"#windDid1",row,'#wind');
		},
		onBeforeLoad:function(){
			document.getElementById('toFind1').value=keywords1;
	},
	toolbar: [{
		text:'向下转移',
		iconCls: 'icon-downz',
		handler: function(){
			//拿到表格一的tstybm,选择行的tstybm并发送给后台
			var rows = getAllselect('#windDid1');
			console.log(rows);
			if(rows.length==0){
				showMsg('友情提示','未选择有效行','warning')
			}else{
				 $.messager.confirm('确认对话框',rows.length+"条信息将要被转移到下方楼盘表,是否确定?", function(r) {
		              if (r){
		            	 ajaxToTransfer(row2.TSTYBM,rows);
		           	   }
		              })
			}
		}
	},
	{	
		text:'删除户信息',
		iconCls: 'icon-remove',
		handler: function(){
			delHinfo('#windDid1');
		}
	},
	{	
		text:'取消选择',
		iconCls: 'icon-clean',
		handler: function(){
			cleanAllCheck('#windDid1');
		}
	}, 	
	{
		text:'转移型下合并',
		iconCls:'icon-todown',
		handler: function(){
			toMerge("#windDid1","#windDid2",0);
		}
	},
	{
		text:'新增户',
		iconCls: 'icon-add',
		handler: function(){
			addH("#windDid1",row,'#wind');
		}
	},
	{
		text:'分割户',
		iconCls: 'icon-split',
		handler: function(){
			splitH("#windDid1",'#wind');
		}
	},
	{
		text:'刷新',	
		iconCls: 'icon-reload',	
		handler: function(){
			reloadDatagrid('#windDid1');
		}
	},
	{
		text:"<button id='bt1'  onclick=toFindH('#windDid1','toFind1')>输入户坐落查找:</button><input id='toFind1' type='text'/>",
		iconCls: 'icon-search',
		handler: function(){
		}
	}
	]

	})
}
	
function showDid2(row,row1,height){
		keywords2="";
		lsztybm2=row.TSTYBM;
		//户信息的详情页数据表格
		$('#pan2').panel({
			title:row.FWZL+'>'+row.ZDTYBM,
			width:'100%',
			height:height,
			border:false,
		});
		$('#windDid2').datagrid({
			//以下是排序
			url: 'getHouseData',
			queryParams: {
				tstybm: row.TSTYBM,
				keyword: keywords2,
			},
			rownumbers:true,
			fit:true ,
			striped:true,
			nowrap: true,
			loadMsg:'数据加载中...',
			singleSelect:false,
			selectOnCheck:true,
			checkOnSelect:true,
			pagination:true,
			pageList:[3,5,10],
			remoteSort:true,//服务器排序
			multiSort:false,//禁止多列排序允许 目前该工具只做到可以单列排序 多列允许排序但只遵循单列规则
			columns: [columH],
			onDblClickRow:function(index,row){
				EditH(index,"#windDid2",row,'#wind');
			},
			onBeforeLoad:function(){
				document.getElementById('toFind2').value=keywords2;
		},
		toolbar: [{
			text:'向上转移',
			iconCls: 'icon-upz',
			handler: function(){
				//拿到表格一的tstybm,选择行的tstybm并发送给后台
				var rows = getAllselect('#windDid2');
				console.log(rows);
				if(rows.length==0){
					showMsg('友情提示','未选择有效行','warning')
				}else{
					 $.messager.confirm('确认对话框',rows.length+"条信息将要被转移到上方楼盘表,是否确定?", function(r) {
			              if (r){
			            	 ajaxToTransfer(row1.TSTYBM,rows);
			           	   }
			              }) 	
					
				}
				
			}
		},
		{	
			text:'删除户信息',
			iconCls: 'icon-remove',
			handler: function(){
				delHinfo('#windDid2');
				
			}
		},
		{	
			text:'取消选择',
			iconCls: 'icon-clean',
			handler: function(){
				cleanAllCheck('#windDid2');
			}
		},
		{
			text:'转移型上合并',
			iconCls:'icon-toup',	
			handler: function(){
				toMerge("#windDid2","#windDid1",0);
			}
		},
		{
			text:'新增户',
			iconCls: 'icon-add',
			handler: function(){
				addH("#windDid2",row,'#wind');
			}
		},
		{
			text:'分割户',
			iconCls: 'icon-split',
			handler: function(){
				splitH("#windDid2",'#wind');
			}
		},
		{
			text:'刷新',
			iconCls: 'icon-reload',
			handler: function(){
				reloadDatagrid('#windDid2');
			}
		},
		{
			text:"<button id='bt2'  onclick=toFindH('#windDid2','toFind2')>输入户坐落查找:</button><input id='toFind2' type='text'/>",
			iconCls: 'icon-search',
			handler: function(){
			}
		}
		]
		})
	}

function showDid3(row,height){
	keywords3="";
	lsztybm3=row.TSTYBM;
	//户信息的详情页数据表格
	$('#singlePan').panel({
		title:row.FWZL+'>'+row.ZDTYBM,
		width:'100%',
		height:height,
	});
	$('#singleDid').datagrid({
		//以下是排序
		url: 'getHouseData',
		queryParams: {
			tstybm: row.TSTYBM,
			keyword: keywords3,
		},
		rownumbers:true,
		fit:true ,
		striped:true,
		nowrap: true,
		singleSelect:false,
		pagination:true,
		selectOnCheck:true,
		loadMsg:'数据加载中...',
		checkOnSelect:true,
		pageList:[3,5,10],
		remoteSort:true,//服务器排序
		multiSort:false,//禁止多列排序允许 目前该工具只做到可以单列排序 多列允许排序但只遵循单列规则
		columns: [columH],
		onDblClickRow:function(index,row){
			console.log(row);
			EditH(index,"#singleDid",row,'#singleWind');
		},
		onBeforeLoad:function(){
				document.getElementById('toFind3').value=keywords3;
		},
			
	toolbar: [
	{	
		text:'删除户信息',
		iconCls: 'icon-remove',
		handler: function(){
			delHinfo('#singleDid');
			
		}
	},
	{
		text:'向下合并',
		iconCls:'icon-down',	
		handler: function(){
			toMerge("#singleDid","#singleDid",1);
		}
	},
	{
		text:'向上合并',
		iconCls:'icon-up',	
		handler: function(){
			toMerge("#singleDid","#singleDid",-1);
		}
	},
	{
		text:'新增户',
		iconCls: 'icon-add',
		handler: function(){
			addH("#singleDid",row,'#singleWind');
		}
	},
	{	
		text:'取消选择',
		iconCls: 'icon-clean',
		handler: function(){
			cleanAllCheck('#singleDid');
		}
	}
	,
	{
		text:'分割户',
		iconCls: 'icon-split',
		handler: function(){
			splitH('#singleDid','#singleWind');
		}
	},{
		text:'刷新',
		iconCls: 'icon-reload',
		handler: function(){
			reloadDatagrid('#singleDid');
		}
	},
	{
		text:"<button id='bt3'  onclick=toFindH('#singleDid','toFind3')>输入户坐落查找:</button><input id='toFind3' type='text'/>",
		iconCls: 'icon-search',
		handler: function(){
		}
	}
	],
	})
}

//按照户信息查找
function toFindH(datagrid,bt){
		var keyword = document.getElementById(bt).value;
		if(keyword.length>0){
			//发送ajax执行查询
			switch (bt) {
			case "toFind1":
				keywords1=keyword;
				tstybm=lsztybm1;
				break;
			case "toFind2":
				keywords2=keyword;
				tstybm=lsztybm2;
				break;
			case "toFind3":
				keywords3=keyword;
				tstybm=lsztybm3;
				break;

			default:
				break;
			}
		}else{
			switch (bt) {
			case "toFind1":
				keywords1="";
				break;
			case "toFind2":
				keywords2="";
				break;
			case "toFind3":
				keywords3="";
				break;

			default:
				break;
			}
		}
		$(datagrid).datagrid('load',{
			tstybm: tstybm,
			keyword: keyword,
		});
}

//执行ajax执行转移
function ajaxToTransfer(tstybm,rows){
	//循环rows将h的tstybm遍历后组成数组
	var trows = new Array();
	for (var i = 0; i < rows.length; i++) {
		trows[i]=rows[i].TSTYBM
	}	
		$.ajax({
			url:'toTransfer',
			type:'post',
			dataType:'json',
			data:{
				tstybm:tstybm,
				trows:trows
			},
			success:function(data){
				if(data.msg>=1){
					//刷新表格
					$('#windDid1').datagrid('reload');
					$('#windDid2').datagrid('reload');
					//提醒
					timeoutMsg("信息提醒",data.msg+"条户信息转移成功!",3000,'slide');
				}else{
					showMsg('严重错误','转移数据失败,后台程序出错,请联系开发者查错!','warning')
				}
			},
			error:function(data){
				alert('失败');
			}
		})
	
}

function timeoutMsg(title,msg,timeout,showType){
	$.messager.show({
		title:title,
		msg:msg,
		timeout:timeout,
		showType:showType
	});

	
}

function delHinfo(id){
	//通过id查询被选择行 限制 不可以多行删除
	var rows = getAllselect(id);
	if(rows.length==0){
		showMsg('友情提示','未选择有效行','warning')
	}else if (rows.length>1){
		showMsg('友情提示','删除户操作只允许单行操作,请取消多行选择!','warning')
	}
	else{
		$.ajax({
			url:'toSelectBusiness',
			dataType:'json',
			beforeSend: showLoad(),
			data:{
				tstybm:rows[0].TSTYBM
			},
			success:function(data){
				hideLoad();
				if(data.total>0){
					showQl(data,rows[0].TSTYBM,id);
				}else{
					 $.messager.confirm('确认对话框',"该条户信息将要被删除,是否确定?", function(r) {
			              if (r){
			            	  ajaxToDelH(rows[0].TSTYBM,id);
			           	   }
			              }) 	
				}
			},
			error:function(data){
				alert('失败');
			}
		}) 
	}
	//查询该条信息是否有办理过业务
	
}

//加载权属信息
function showQl(data,tstybm,id){
	//显示dialog
	$('#busDialog').dialog({    
	    title: '警告:&nbsp&nbsp该条信息有如下权证信息存在,是否继续删除?',    
	    width: "80%",    
	    height: "30%",
	    minimizable:true,
	    maximizable:false,
	    resizable:true,
	    resizable:true,
	    closed: false,  
	    constrain:true,
	    modal:true,
	    buttons:[{
			text:'继续删除',
			iconCls:'icon-closer',
			handler:function(){
				//发送ajax批量删除
				stillDelH(data,tstybm,id);
			}
		},{
			text:'关闭',
			iconCls:'icon-close',
			handler:function(){
				$('#busDialog').dialog('close');
			}
		}]

	});    
	//显示数据表格
	$("#busDid").datagrid({
		rownumbers:true,
		fit:true ,
		striped:true,
		columns:[columQ],
		data:data.rows,
		busDid:true,
	})
}

//合并显示权利ajaxToMerge(rowsM[0].TSTYBM,rowsToM[0].TSTYBM,rowsM[0].BDCDYH,id1,id2);
function showQl2(data,bTSTYBM,tTSTYBM,bdcdyh,id1,id2){
	//显示dialog
	$('#busDialog').dialog({    
	    title: '警告:&nbsp&nbsp该条信息有如下权证信息存在,是否继续合并?',    
	    width: "80%",    
	    height: "30%",
	    minimizable:true,
	    maximizable:false,
	    resizable:true,
	    resizable:true,
	    closed: false,  
	    constrain:true,
	    modal:true,
	    buttons:[{
			text:'继续合并',
			iconCls:'icon-input',
			handler:function(){
				//处理流程和非强制删除的一样
				ajaxToMerge(bTSTYBM,tTSTYBM,bdcdyh,id1,id2);
			}
		},{
			text:'关闭',
			iconCls:'icon-close',
			handler:function(){
				$('#busDialog').dialog('close');
			}
		}]

	});    
	//显示数据表格
	$("#busDid").datagrid({
		rownumbers:true,
		fit:true ,
		striped:true,
		columns:[columQ],
		data:data.rows,
	})
}

//执意删除户操作
function stillDelH(data,tstybm,id){
	//加入数组进行拼接
	var slbhArray = new Array();
	for (var i = 0; i < data.rows.length; i++) {
		slbhArray[i]="'"+data.rows[i].SLBH+"'";
	}
	//进行字符串的隔离
	var slbhs = slbhArray.join(",");
	
	//ajax进行删除
	$.ajax({
		url:'stillDelH',
		type:'post',
		dataType:'json',
		data:{
			tstybm:tstybm,
			slbhs:slbhs
		},
		success:function(data){
			if(data.msg==1){
				//刷新表格
				$(id).datagrid('reload');
				$('#busDialog').dialog('close');
				//提醒
				timeoutMsg("信息提醒",data.msg+"条户信息及相关图属信息删除成功!",3000,'slide');
			}else{
				showMsg('严重错误','删除数据失败,后台程序出错,请联系开发者查错!','warning')
			}
			
		},
		error:function(data){
			alert('失败');
		}
	})
	
}
//执行内嵌ajax执行户的删除操作
function ajaxToDelH(tstybm,id){
	$.ajax({
		url:'delH',
		type:'post',
		dataType:'json',
		data:{
			tstybm:tstybm,
		},
		success:function(data){
			if(data.msg>=1){
				//刷新表格
				$(id).datagrid('reload');
				//提醒
				timeoutMsg("信息提醒",data.msg+"条信息删除成功!",3000,'slide');
			}else{
				showMsg('严重错误','删除数据失败,后台程序出错,请联系开发者查错!','warning')
			}
			
		},
		error:function(data){
			alert('失败');
		}
	})
}

function toMerge(id1,id2,state){  //id1代表去覆盖 id2代表被覆盖
	//拿到被覆盖的tstybm去后台查 是否满足合并条件
	//通过id查询被选择行 限制 不可以多行删除
	if(state==0){ //说明是跨表操作
		var rowsM = getAllselect(id2);//去合并
		var rowsToM = getAllselect(id1);//被合并
		if(rowsM.length==0||rowsToM.length==0){
			showMsg('友情提示','未选择有效行','warning')
		}else if(rowsM.length>1||rowsToM.length>1){
			showMsg('友情提示','合并操作只允许单行对应单行操作,请取消多行选择!','warning')
		}
		else{
			$.ajax({
				url:'isCanMerge',
				type:'post',
				dataType:'json',
				data:{
					tstybm:rowsToM[0].TSTYBM,
				},
				beforeSend: showLoad(),
				success:function(data){
					hideLoad();
					if(data.total>0){
						showQl2(data,rowsM[0].TSTYBM,rowsToM[0].TSTYBM,rowsM[0].BDCDYH,id1,id2);
					}else{
						$.messager.confirm('确认对话框',"该条户信息将要被覆盖,是否确定?", function(r) {
				              if (r){
				            	  ajaxToMerge(rowsM[0].TSTYBM,rowsToM[0].TSTYBM,rowsM[0].BDCDYH,id1,id2);
				           	   }
				              }) 	
					}
					
				},
				error:function(data){
					alert('失败');
				}
			})
		}
	}else{ //否则是同表操作
		var rows = getAllselect(id1);//去合并
		
		if(rows.length<2){
			showMsg('友情提示','未选择有效行','warning')
		}else if(rows.length>2){
			showMsg('友情提示','合并操作只允许选择两行,请取消多行选择!','warning')
		}else{
			//用三目来判断变量的赋值
			var bTstybm = (state==1)?rows[0].TSTYBM:rows[1].TSTYBM;//被验证
			var tTstybm=(state==1)?rows[1].TSTYBM:rows[0].TSTYBM;//去覆盖
			var bdcdyh=(state==1)?rows[1].BDCDYH:rows[0].BDCDYH;
		//选择了 两行 看是向上合并还是向下合并 如果是向下合并为1 向上合并为-1 跨表为0
			$.ajax({
				url:'isCanMerge',
				type:'post',
				dataType:'json',
				data:{
					tstybm:bTstybm,
				},
				beforeSend: showLoad(),
				success:function(data){
					hideLoad(); 
					if(data.total>0){
						showQl2(data,tTstybm,bTstybm,bdcdyh,id1,id2);
					}else{
						
						$.messager.confirm('确认对话框',"该条户信息将要被覆盖,是否确定?", function(r) {
				              if (r){
				            	  ajaxToMerge(tTstybm,bTstybm,bdcdyh,id1,id2);
				           	   }
				              }) 	
					}
					
				},
				error:function(data){
					alert('失败');
				}
			})
		}
		
	}	
}

//显示加载信息
function showLoad(){
	$.messager.progress({text:'数据加载中....'}); 
};
//隐藏加载信息
function hideLoad(){
	$.messager.progress('close'); 
}

function ajaxToMerge(tTstybm,bTstybm,bdcdyh,id1,id2){
	console.log("bdcdyh:"+bdcdyh);
	$.ajax({
		url:'toMergeH',
		type:'post',
		dataType:'json',
		data:{
			tTstybm:tTstybm,
			bTstybm:bTstybm,
			bdcdyh:bdcdyh,
		},
		success:function(data){
			if(data.msg==1){
				//如果表格存在 则关闭表格
				if($('#busDialog').dialog()!=undefined){
					$('#busDialog').dialog('close');
				}	
				//刷新表格
				if(id1!=id2){
					$(id1).datagrid('reload');
					$(id2).datagrid('reload');
				}else{
					$(id1).datagrid('reload');
				}
				
				
				timeoutMsg("信息提醒","户信息合并成功!",3000,'slide');
				
			}else{
				showMsg('严重错误','合并信息时,后台程序出错数据已成功回滚,请联系开发者查错!','warning')
			}
		},
		error:function(data){
			alert('失败');
		}
	})
}
//删除幢信息
function deleteZ(id){
	//获取所有行
	var rows = getAllselect(id);
	if(rows.length==0){
		showMsg('友情提示','未选择有效行!','warning')
	}else if(rows.length>1){
		showMsg('友情提示','删除幢操作只允许单行操作,请取消多行选择!','warning')
	}else{
		//查询是否有户信息存在
		$.ajax({
			url:'isCanDel',
			type:'post',
			dataType:'json',
			data:{
				tstybm:rows[0].TSTYBM,
			},	
			success:function(data){
				if(data.msg>0){
					showMsg('友情提示','该条记录存在户信息,<br/>不能直接删除,请双击行查看详情!','warning')
				}else if (data.msg<0){
					showMsg('严重错误','查询幢下户信息时程序出错,请联系管理员差错!','warning')
				}
				else{
					$.messager.confirm('确认对话框',"该条幢信息可以被删除,是否确定操作?", function(r) {
			              if (r){
			            	  ajaxToDelZ(rows[0].TSTYBM,id);
			           	   }
			              }) 	
				}
			},
			error:function(data){
				alert('失败');
			}
		})
	}
}

//ajax删除幢
function ajaxToDelZ(tstybm,id){
	$.ajax({
		url:'delZ',
		type:'post',
		dataType:'json',
		data:{
			tstybm:tstybm,
		},
		success:function(data){
			if(data.msg<=0){
				showMsg('严重错误','删除幢信息时后台程序出错,请联系管理员差错!','warning')
			}else {
				//刷新表格
				$(id).datagrid('reload');
				//提醒
				timeoutMsg("信息提醒",data.msg+"条幢户信息删除成功!",3000,'slide');
			}
		},
		error:function(data){
			alert('失败');
		}
	})
}

//页面跳转的方法 使用的方法是模拟被点击
function openUrl(url){
	var a = $(url).get(0);
	 var e = document.createEvent('MouseEvents');
	 e.initEvent('click', true, true);
	 a.dispatchEvent(e);
}

//取消选择的行
function cleanAllCheck(id){
		$(id).datagrid('uncheckAll');
}	

//新增户信息
function addH(id,row,windowID){
	var url = "";
	//判断是否有选择
	var rows = getAllselect(id);
	if(rows.length==1){	//复制型新增
		url = serverUrl+"/WorkArea/HouseInfo4repeat?H_ID="+rows[0].TSTYBM;
	}else{	//带幢信息新增
		url = serverUrl+"/WorkArea/HouseInfo/?Z_ID="+row.TSTYBM;	
	}
	//关闭面板	
	$(windowID).window('close');
	openDialog(url,windowID,id);
	
}
//修改户
function EditH(index,datagridId,row,windowID){	
	var url = serverUrl+"/WorkArea/HouseInfo?H_ID="+row.TSTYBM;
	$(windowID).window('close');//关闭面板
	
	openDialog(url,windowID,datagridId);
	
}

//分割户信息
function splitH(datagrid,windowID){
	//获取所有选择
	var rows = getAllselect(datagrid);
	if(rows.length==0){
		showMsg('友情提示','未选择有效行!','warning')
	}else if(rows.length>1){
		showMsg('友情提示','分割户操作只允许单行操作,请取消多行选择!','warning')
	}else{
		$.ajax({
			url:'splitH',
			type:'post',
			dataType:'json',
			data:{
				btstybm:rows[0].TSTYBM,
				bbdcdyh:rows[0].BDCDYH,
			},
			success:function(data){
				if(data.msg>=1){
					var url = serverUrl+"/WorkArea/HouseInfo?H_ID="+data.tstybm;
					$(windowID).window('close');//关闭面板
					openDialog(url,windowID,datagrid);
				}else{
					showMsg('严重错误','分割户信息(复制)时后台程序出错,请联系开发者查错!','warning')
				}
			},
			error:function(data){
				alert('失败');
			}
		})
	}
};

//打开新页面
function openDialog(url,windowID,datagridId){
		
	 art.dialog.open(url, {
	        width: 850,
	        height: 570,	
	        lock: true,
	        close:function(){
	        	$(windowID).window('open');
	        	//刷新表格
	        	$(datagridId).datagrid('reload');
	        	
	        }
		 });
}

/*})*///我是jquery的下括号补全


