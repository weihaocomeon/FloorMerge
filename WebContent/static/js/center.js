//使用下来框的注意事项  必须先进行js的初始化(设置属性)
$('#reqStr').combobox({  
	editable:false,
}); 
//缓存 回写(之后证明 不需要)
	$('#ss').searchbox({ 
		prompt:'输入后查询', 
		width:"300px",
		height:"30px",  
		//value:topKeyWords,
		searcher:function(value){ 
			//如果为空 则清空did数据  
			if(!value||""==value.trim()){
				showMsg("提示信息", "请输入关键字后搜索", "warning");
			}else{
				var category = $('#reqStr').combobox('getValue');
				$("#did").datagrid("reload",{category:category,keyword:value});
			}
			}, 
		}); 


	
//控件显示
$("#did").datagrid({
	url: 'getDataByKeywordAndPage',
	fit:false ,
	rownumbers:true,
	title:"幢信息查询结果",
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
	onRowContextMenu: function(e, index, row){ //右键
		//选中该行  
		$('#did').datagrid('selectRow', index);
		 $('#mm').menu('show', {
	            left: e.pageX,
	            top: e.pageY
	        });
		 e.preventDefault(); 
		//右键菜单  
		$('#mm').menu({    
			    onClick:function(item){
			    	console.log(item);
			        if(item.text=='查看幢下户信息'){
			        	//和查看相同
			        	showWindow('#singleWind','单户信息详情');
			    		showDid3(row,'100%');
			        }else if(item.text=='刷新'){
			        	reloadDatagrid('#did');
			        }else if(item.text=='删除'){
			        	deleteZ('#did');
			        }else if(item.text=='取消选择'){
			        	cleanAllCheck('#did');
			        } 
			        
			    }    
			});	
		 
	},
	onDblClickRow: function(index,row){				//双击时
		showWindow('#singleWind','单户信息详情');
		showDid3(row,'100%');
	},
	onLoadSuccess: function(data){
    	if(data.total==0){
    		showMsg("提示信息", "根据关键字未查询到相关信息!!", "info");
    	}
    	$('#did').datagrid('uncheckAll');
    },
	
	onBeforeLoad: function (param) {  //查看是否是首次加载 如果是 则 不执行url 加载数据
        var firstLoad = $(this).attr("firstLoad");  
        if (firstLoad == "false" || typeof (firstLoad) == "undefined")  
        {  
            $(this).attr("firstLoad","true");  
            return false;  
        }  
        return true;  
    },
    
    onLoadError: function(xhr){
    	showSessionError(xhr);
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
	'-',
	{
		text:'合并至下方幢',
		iconCls:'icon-down',	
		handler: function(){
			toMergeZ(1);
		}
	},
	'-',
	{
		text:'合并至上方幢',
		iconCls:'icon-up',	
		handler: function(){
			toMergeZ(-1);
	}
	},
	'-',{
		id:'hwzz',
		text:'户幢挂接',
		iconCls: 'icon-building',
		handler: function(){
			showHZGJ();
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


//户幢挂接  
function showHZGJ(){
		var m ;
	//查看按钮当前状态	
	if($("a[id='hwzz'").children("span:eq(0)").children("span:eq(0)").get()[0].innerText=="户幢挂接"){
		//1.改变搜索框上层 div可见性 	
		$("#findDivH").css("display","block");
		//设置表格上的div可见
		$('#findHinfo').css('display','block');
		
		//2.渲染搜索框  
		$('#ssH').searchbox({ 
			prompt:'输入户坐落', 
			width:"300px",
			height:"30px",  
			//value:topKeyWords,
			searcher:function(value){ 
				//如果为空 则清空did数据  
				if(!value||""==value.trim()){
					showMsg("提示信息", "请输入户坐落后搜索", "warning");
				}else{				
					m = $('#ssH').searchbox('getValue');
					
					//重新加载数据 带参数
					$('#didGJ').datagrid('reload',{keyword: m,});
				}
				}, 
			}); 
		$('#ssH').searchbox('clear');  
		
		//3.改变按键名称
		$("a[id='hwzz'").children("span:eq(0)").children("span:eq(0)").get()[0].innerText='隐藏户幢挂接';
		//4.显示表格并加载数据  
			$("#didGJ").datagrid({
				url: 'getHouseData',
				fit:false ,
				rownumbers:true,
				title:"户信息查询结果",
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
				columns: [columH],
				onDblClickRow: function(index,row){				//双击时
					EditH(index,"#didGJ",row);
				},
				onLoadError: function(xhr){
				    	showSessionError(xhr);
				},
				onRowContextMenu: function(e, index, row){ //右键
					//选中该行  
					$('#didGJ').datagrid('selectRow', index);
					//查看该行的lsztybm
					if(row.LSZTYBM&&(!$('#mmGJ').menu('findItem', '查看幢'))){
						$('#mmGJ').menu('appendItem', {
							id:'findZ',
							text: '查看幢',
							iconCls: 'icon-search',
						});
					}else if(!row.LSZTYBM&&($('#mmGJ').menu('findItem', '查看幢'))){
						//alert("进入删除该项目");
						//获得当前的itemID
						//console.log($('#mmGJ'));
						var itemEl = $('#findZ')[0];  // the menu item element
						var item = $('#mm').menu('removeItem',itemEl);
						//alert("已删除");
					}
					 $('#mmGJ').menu('show', {
				            left: e.pageX,
				            top: e.pageY
				        });
					 e.preventDefault(); 
					//右键菜单  
					$('#mmGJ').menu({    
						    onClick:function(item){
						        if(item.text=='查看'||item.text=='编辑'){
						        	//和查看相同
						        	EditH(index,"#didGJ",row);
						        }else if(item.text=='刷新'){
						        	reloadDatagrid('#didGJ');
						        }else if(item.text=='取消选择'){
						        	cleanAllCheck('#didGJ');
						        }else if(item.text=='查看幢'){
						        	reSend(row.LSZTYBM);  delHinfo
						        }else if(item.text=='删除'){
						        	delHinfo('#didGJ');
						        }else if(item.text=='查看业务信息'){
						        	showHDJInfo('#didGJ');
						        }  
						    }    
						});	
				},
				onBeforeLoad: function (param) {  //查看是否是首次加载 如果是 则 不执行url 加载数据
			        //如果是第一次加载   reload的时候 首先进行的是 无参的访问 会出现一次 垃圾访问(bad param)
					 m = $('#ssH').searchbox('getValue');          
					if(m){
						return true;
					}else{
						return false;
					}
			    },
			    toolbar: [{
					text:'挂接',
					iconCls: 'icon-Hook',
					handler:function(){
						 toGj();
					}
			    },
			    '-',{
					text:'取消选择',
					iconCls: 'icon-clean',
					handler: function(){
						cleanAllCheck('#didGJ');
					}
				},
			    '-',{
					text:'刷新',
					iconCls: 'icon-reload',
					handler: function(){
						reloadDatagrid('#didGJ');
					}
				}
			    ]
			});
			//加载本地数据 清空 表格缓存  
			$('#didGJ').datagrid('loadData',{"total":0,"rows":[]});
	}else{
		//1.隐藏表格  
		$('#findDivH').css('display','none');
		$('#findHinfo').css('display','none');
		//改变按钮内容
		$("a[id='hwzz'").children("span:eq(0)").children("span:eq(0)").get()[0].innerText='户幢挂接';
		//清除搜索框的值  
	
;	}	
		
//挂接  
function toGj(){
	//查看did是否有行信息选中;
	var rows1 = getAllselect('#didGJ');
	var rows2 = getAllselect('#did');
	//判断条数表格一至允许选择一行 表格二至允许选择一行
	if((rows1.length>=1)&&(rows2.length==1)){
		//查看当前户信息的lsztybm是否存在
		
			//存在的提示内容
			$.messager.confirm('确认对话框',"当前选择了"+rows1.length+"户进行挂接幢信息,是否确认该操作?", function(r) {
	            if (r){
	            	//进行更新挂接
	            	rowIndex=$('#didGJ').datagrid('getRowIndex',rows2[0]);
	            	ajaxToTransfer(rows2[0].TSTYBM,rows1,'户幢挂接',rowIndex);
	         	   }
			});
			//不存的提示内容
			
		
			
		
	}else{
		showMsg('友情提示','<strong>挂接幢使用须知:</strong></br>1.选择一条幢信息;</br>2.选择一条户信息;</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.点击<strong>挂接按钮</strong></br>注:当前选择无效,请按要求重新选择!','warning')
	}
}
	
};

//点击户链接打开的详情页  
function reSend(value){
	
	$("#did").datagrid("reload",{category:'f2',keyword:value});
}

//刷新某个表格
function reloadDatagrid(id){
	$(id).datagrid('reload');
}

//获得某个表格的所有选择行
function getAllselect(id){
	var rows = '';
	rows = $(id).datagrid('getSelections');
	return rows;
}

//弹出框
function showMsg(msgTitle,msg,icon){
	$.messager.alert(msgTitle,msg,icon);
}

//打开某个窗口
function showWindow(id,title){
	//调用遮盖层 
	showmask();
	$(id).window({
		module:true,
		collapsible:true,
		title:title,
		onClose: function(){
			hidemask();
		}
	});	
}

//合并幢  
function toMergeZ(num){
	//验证是否选择了两条数据
	var rowsS = getAllselect('#did');//去合并
	if(rowsS.length<=1){
		showMsg('友情提示','未选择有效行','warning')
	}else if(rowsS.length>2){
		showMsg('友情提示','合并幢操作仅允许操作两条,请取消多选!','warning')
	}else{
		//获得两条tstybm
		//第一条被选择记录
		s1=rowsS[0].TSTYBM 
		//第二条被选择记录
		s2=rowsS[1].TSTYBM
		
		rowNum1=$('#did').datagrid('getRowIndex',rowsS[0]);
		rowNum2=$('#did').datagrid('getRowIndex',rowsS[1]);
		$.messager.confirm('确认对话框',"幢坐落为:<strong>"+(num==1?(rowsS[0].FWZL):(rowsS[1].FWZL))+"</strong>的该条幢下所有户将要被转移且该条幢信息将要被删除,是否确定该操作?", function(r) {
            if (r){
            	$.ajax({
    				url:'toMergeZ',
    				type:'post',
    				dataType:'json',
    				data:{
    					tTstybm:(num==1?s2:s1),//去合并
    					bTstybm:(num==1?s1:s2),//被合并删除
    				},
    				success:function(data){
    					if(data.msg==1){
    						//刷新表格
    						$('#did').datagrid('reload');
    						
    						//高亮某一行
    						$('#did').datagrid('options').onLoadSuccess=function(){
								$('#did').datagrid('selectRow',(num==1)?(rowNum2-1):rowNum1);
							}; 
    						timeoutMsg("信息提醒","幢信息合并成功!",3000,'slide');
    					}else{
    						showMsg('错误提示','合并信息时,后台程序出错数据已成功回滚,请查看相应日志!','warning')
    					}
    				},
    				error:function(xhr){
    					showSessionError(xhr);
    				}
    			})
         	   }
            }) 	
	
	}
}

//户列表的表格1
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
		onLoadError: function(xhr){
	    	showSessionError(xhr);
	    },
	    onRowContextMenu: function(e, index, row){ //右键 不需要显示 查看幢信息了 因为 已经在幢下进行展示了 
			//选中该行  
			$('#windDid1').datagrid('selectRow', index);
			
			 $('#mmGJ').menu('show', {
		            left: e.pageX,
		            top: e.pageY
		        });
			 e.preventDefault(); 
		
			 //右键菜单  
			$('#mmGJ').menu({    
				    onClick:function(item){
				        if(item.text=='查看'||item.text=='编辑'){
				        	//和查看相同
				        	EditH(index,"#windDid1",row,'#wind');
				        }else if(item.text=='刷新'){
				        	reloadDatagrid('#windDid1');
				        }else if(item.text=='取消选择'){
				        	cleanAllCheck('#windDid1');
				        }else if(item.text=='删除'){
				        	delHinfo('#windDid1');
				        }else if(item.text=='查看业务信息'){
				        	showHDJInfo('#windDid1');
				        }  
				    }    
				});	
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
		text:'转移&合并至下方户',
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

//户列表的表格二
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
			onLoadError: function(xhr){
		    	showSessionError(xhr);
		    },
			onBeforeLoad:function(){
				document.getElementById('toFind2').value=keywords2;
			},
			onRowContextMenu: function(e, index, row){ //右键 不需要显示 查看幢信息了 因为 已经在幢下进行展示了 
				//选中该行  
				$('#windDid2').datagrid('selectRow', index);
				
				 $('#mmGJ').menu('show', {
			            left: e.pageX,
			            top: e.pageY
			        });
				 e.preventDefault(); 
				
				 //右键菜单  
				$('#mmGJ').menu({    
					    onClick:function(item){
					        if(item.text=='查看'||item.text=='编辑'){
					        	//和查看相同
					        	EditH(index,"#windDid2",row,'#wind');
					        }else if(item.text=='刷新'){
					        	reloadDatagrid('#windDid2');
					        }else if(item.text=='取消选择'){
					        	cleanAllCheck('#windDid2');
					        }else if(item.text=='删除'){
					        	delHinfo('#windDid2');
					        }else if(item.text=='查看业务信息'){
					        	showHDJInfo('#windDid2');
					        }  
					    }    
					});	
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
			text:'转移&合并至上方户',
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
		title:row.FWZL+'>'+row.TSTYBM,
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
			//console.log(row);
			EditH(index,"#singleDid",row,'#singleWind');
		},
		onLoadError: function(xhr){
		    	showSessionError(xhr);
		},
		onBeforeLoad:function(){
				document.getElementById('toFind3').value=keywords3;
		},
		onRowContextMenu: function(e, index, row){ //右键 不需要显示 查看幢信息了 因为 已经在幢下进行展示了 
			//选中该行  
			$('#singleDid').datagrid('selectRow', index);
			
			 $('#mmGJ').menu('show', {
		            left: e.pageX,
		            top: e.pageY
		        });
			 e.preventDefault(); 
			
			 //右键菜单  
			$('#mmGJ').menu({    
				    onClick:function(item){
				        if(item.text=='查看'||item.text=='编辑'){
				        	//和查看相同
				        	EditH(index,"#singleDid",row,'#singleWind');
				        }else if(item.text=='刷新'){
				        	reloadDatagrid('#singleDid');
				        }else if(item.text=='取消选择'){
				        	cleanAllCheck('#singleDid');
				        }else if(item.text=='删除'){
				        	delHinfo('#singleDid');
				        }else if(item.text=='查看业务信息'){
				        	showHDJInfo('#singleDid');
				        }  
				    }    
				});	
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
		text:'合并至下方户',
		iconCls:'icon-down',	
		handler: function(){
			toMerge("#singleDid","#singleDid",1);
		}
	},
	{
		text:'合并至上方户',
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
function ajaxToTransfer(tstybm,rows,info,index){//info是标识符 标识是否是户幢挂接  index 代表幢信息的当前行 (户幢使用)
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
					if(info=='户幢挂接')	{
						$('#didGJ').datagrid('reload');
						$('#did').datagrid('reload');
						//定位
						$('#did').datagrid('selectRow',index);
						//提醒
						timeoutMsg("信息提醒",data.msg+"条户信息挂接幢成功!",3000,'slide');
					}else{
						$('#windDid1').datagrid('reload');
						$('#windDid2').datagrid('reload');
						//提醒
						timeoutMsg("信息提醒",data.msg+"条户信息转移成功!",3000,'slide');
					}
						
				}else{
					showMsg('错误提醒','操作数据失败,详情请查看错误日志!','warning')
				}
			},
			error:function(xhr){
				showSessionError(xhr);
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

function showHDJInfo(id){//当前的表格ID
	//查看现在多少户被选中  满足条件的是1条或者2条
	var rows = getAllselect(id);
	if(rows.length==0){
		showMsg('友情提示','未选择有效行','warning')
	}else if (rows.length>2){
		showMsg('友情提示','查看业务信息最大允许两条,请取消后重新选择!','warning')
	}
	else{
		var data1;
		var data2;
		//一条请求一遍ajax
		if(rows.length==1){
		data1 = HDJInfo(rows[0].TSTYBM);
		//传入底层
		showQLinfo('40%','#busDid',data1,'100%',rows[0].ZL);
		}else{//两条 请求两遍ajax
			data1 = HDJInfo(rows[0].TSTYBM);
			data2 = HDJInfo(rows[1].TSTYBM);
			showQLinfo('80%','#busDid',data1,'50%',rows[0].ZL,'#busDid2',data2,'50%',rows[1].ZL);
		}
		
		
	}
	
}
function HDJInfo(tstybm){
	var dataR;
	$.ajax({
		async: false,  
		url:'toSelectBusiness',
		dataType:'json',
		beforeSend: showLoad(),
		data:{
			tstybm:tstybm
		},
		success:function(data){
			hideLoad();
			dataR = data.rows;
			
		},
		error:function(xhr){
			showSessionError(xhr);
		}
	}) 
	return dataR;
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
			error:function(xhr){
				showSessionError(xhr);
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
	    maximizable:true,
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
		fit:false ,
		striped:true,
		columns:[columQ],
		data:data.rows,
		busDid:true,
	});
	
}

//对于查询  
//加载权属信息
function showQLinfo(heightBig,id1,data1,height1,title1,id2,data2,height2,title2){//条件
	//显示dialog
	$('#busDialog').dialog({    
	    title:'权属信息详情',  
	    top:'10%',
		left:'10%',
	    width: "80%",    
	    height: heightBig,
	    minimizable:true,
	    maximizable:true,
	    resizable:true,
	    closed: false,  
	    constrain:false,
	    modal:false

	});    
	//显示数据表格
	$(id1).datagrid({
		title: '<strong>'+title1+'</strong>权属信息详情', 
		width:'100%',
		height:height1,
		rownumbers:true,
		fit:false ,
		striped:true,
		columns:[columQ],
		data:data1,
	});
	$(id2).datagrid({
		title:  '<strong>'+title2+'</strong>权属信息详情', 
		width:'100%',
		height:height2,
		rownumbers:true,
		fit:false,
		striped:true,
		columns:[columQ],
		data:data2,
	});
	
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
		error:function(xhr){
			showSessionError(xhr);
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
		error:function(xhr){
			showSessionError(xhr);
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
				error:function(xhr){
					showSessionError(xhr);
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
				error:function(xhr){
					showSessionError(xhr);
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
		error:function(xhr){
			showSessionError(xhr);
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
					showMsg('友情提示','该幢下存在有效户信息,<br/>不能直接删除,请双击行查看户详情!','warning')
				}else if (data.msg<0){
					showMsg('错误提醒','查询幢下是否有户信息时出错,详情请查看错误日志!','warning')
				}
				else{
					$.messager.confirm('确认对话框',"坐落为:<strong>"+rows[0].FWZL+"</strong><br/>的该条幢信息可以被删除,是否确定该操作?", function(r) {
			              if (r){
			            	  ajaxToDelZ(rows[0].TSTYBM,id);
			           	   }
			              }) 	
				}
			},
			error:function(xhr){
				showSessionError(xhr);
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
				showMsg('严重错误','删除幢信息时后台程序出错,详情请查看日志!','warning')
			}else {
				//刷新表格
				$(id).datagrid('reload');
				//提醒
				timeoutMsg("信息提醒",data.msg+"条幢户信息删除成功!",3000,'slide');
			}
		},
		error:function(xhr){
			showSessionError(xhr);
		}
	})
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
			error:function(xhr){
				showSessionError(xhr);
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

//遮罩层
function showmask(){
    //遮罩层,利用datagrid的遮罩层
    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body"); 

}
function showSessionError(xhr){
	if(xhr.status==200){
		location.reload();
		//showMsg("提示信息", "当前SESSION过期,请重新登录后打开该页面!", "warning");
	}
	else{
		showMsg("错误提示", "后台程序出错"+xhr.status + " " + xhr.statusText+" 详情请查看日志!", "warning");
	}
}
//取消遮罩层  
function hidemask(){
    $(".datagrid-mask").hide();
}
