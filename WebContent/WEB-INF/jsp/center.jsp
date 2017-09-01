<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<%-- <%@include file="../../import.jsp" %> --%>
<script type="text/javascript" src="static/js/center.js"></script>
<link rel="stylesheet" type="text/css" href="static/css/center.css">

	<div id='findDiv' class="findDiv">		
		<!-- <label class='find'>按楼盘搜索:</label> -->
		<select id="reqStr" class="easyui-combobox" name="dept" style="width:200px;height:30px">   
	    <option value="f1">按楼盘搜索</option>   
	    <option value="f2">按图书统一编码搜索</option>   
	    <option value="f3">按宗地统一编码搜索</option>   
		</select>  
		<input id="ss" ></input> 
	</div>
	<table id="did" >
    </table>	
   
   
   <!--户幢信息挂接-->
    <div id='findDivH' class="findDiv" style="display: none;">		
			<label class='find'>按户坐落搜索:</label>
			<input id="ssH" ></input> 
		</div>
   <div id='findHinfo'>
	  
		<table id="didGJ" >
	    </table>	
   </div>
    
    
 	<div  id="wind" title="My Window" style="width:90%;height:90%;display: none;">   
		<div id="pan1">
		<table id="windDid1"></table> 
		</div>
		<div id="pan2">
		<table id="windDid2"></table> 
		</div>
    </div>   

    <div id="singleWind" title="My Window" style="width:90%;height:90%;display: none;">   
		<div id="singlePan">
		<table id="singleDid"></table> 
		

		</div>
    </div> 
    
    <div id='busDialog'>
    	<table id ="busDid" style="width:90%;height:90%;display: none;"></table>
    	<table id ="busDid2" style="width:90%;height:90%;display: none;"></table>
    </div>
    
	
    <!-- 右键菜单did -->  
<div id="mm" class="easyui-menu" style="width:120px;">
    <div  data-options="iconCls:'icon-search'">查看幢下户信息</div>
    <div  data-options="iconCls:'icon-clean'">取消选择</div>
    <div  data-options="iconCls:'icon-remove'">删除</div>
    <div class="menu-sep"></div>
    <div data-options="iconCls:'icon-reload'">刷新</div>
</div>

    <!-- 右键菜单 户幢挂接表 -->  
<div id="mmGJ" class="easyui-menu" style="width:120px;">
    <div  data-options="iconCls:'icon-search'">查看</div>
      <div  data-options="iconCls:'icon-reload'">查看业务信息</div>
    <div  data-options="iconCls:'icon-edit'">编辑</div>
    <div  data-options="iconCls:'icon-clean'">取消选择</div>
    <div  data-options="iconCls:'icon-remove'">删除</div>
    <div  data-options="iconCls:'icon-reload'">刷新</div>
</div>

</body>
</html>