//读取xml
if (window.XMLHttpRequest)
{// code for IE7+, Firefox, Chrome, Opera, Safari
xmlhttp=new XMLHttpRequest();
}
else
{// code for IE6, IE5
xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","static/property.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;
var serverUrl=xmlDoc.getElementsByTagName("serverPath")[0].childNodes[0].nodeValue;
//分页的关键词
var keywords1="";
var keywords2="";
var keywords3="";
var lsztybm1="";
var lsztybm2="";
var lsztybm3="";	
//工具条列
var columH = [
	{
        field: 'LSFWBH',
        checkbox:true,
        width: '3%',
      },
      {
          field: 'ZDTYBM',
          title: '宗地统一编码',
          width: '10%',
          sortable :true,
       },
       {
           field: 'BDCDYH',
           title: '不动产单元号',
           width: '15%',
           formatter: function(value,row,index){
				if (value==undefined){
					row.BDCDYH=""
					return row.BDCDYH;
				} else {
					return value;
				}
			}
        },
       {
           field: 'ZH',
           title: '幢号',
           width: '4%',
       },
       {
         field: 'HH',
         title: '户号',
         width: '4%',
         sortable :true,
       },
    
     {
         field: 'ZL',
         title: '坐落',
         width: '20%',
         sortable :true,
     },
     {
         field: 'LSZTYBM',
         title: '隶属幢统一编码',
         width: '13%',
         sortable :true,
         formatter: function(value,row,index){
        	if(value){
        		 return '<a href="#" class="btnSend" onclick="reSend(\''+value+'\')">'+value+'</a>'; 	
        	} 
        		return value;
 			}
     },
     {
         field: 'SJC',
         title: '实际层',
         width: '4%',
       },
       {
           field: 'MYC',
           title: '名义层',
           width: '4%',
         },
     {
         field: 'DYH',
         title: '单元号',
         width: '4%'
      },
      {
          field: 'FJH',
          title: '房间号',
          width: '4%'
       },
       {
           field: 'JZMJ',
           title: '建筑面积',
           width: '4%'
        },
        {
            field: 'TNSCMJ',
            title: '套内面积',
            width: '4%'
         },
         {
             field: 'FTJZMJ',
             title: '分摊面积',
             width: '4%'
          },
          {
              field: 'LSFWBM',
              title: '隶属房屋编号',
              width: '10%',
           },
];

//幢工具条列
var columZ =[
	{
        field: 'LSZTYBM',
        checkbox:true,
        width: '3%',
        align:'center',
      },
  	
   
     {
         field: 'ZDTYBM',
         title: '宗地统一编码',
         width: '10%',
         align:'center',
     },
     {
         field: 'FWBH',
         title: '房屋编号',
         width: '15%',
         align:'center',
     },
     {
         field: 'BDCDYH',
         title: '不动产单元号',
         width: '15%',
         sortable :true,
         align:'center',
      },
     {
         field: 'ZH',
         title: '幢号',
         width: '4%',
         sortable :true,
         order:'desc',
         align:'center',
     },
     {
         field: 'FWZL',
         title: '房屋坐落',
         width: '25%',
         sortable :true,
         order:'desc',
       },
       {
           field: 'HCOUNT',
           title: '幢下房屋数量',
           width: '8%',
         },
     {
         field: 'XMMC',
         title: '项目名称',
         width: '15%',
      },
      {
          field: 'SCJZMJ',
          title: '实测建筑面积',
          width: '8%'
       },

];

var columQ =[
	{
        field: 'DJLX',
        title: '登记类型',
        width: '10%',
        align:'center',
      },
  	
   
     {
         field: 'SLBH',
         title: '受理编号',
         width: '20%',
         align:'center',
     },
     {
         field: 'BDCZH',
         title: '相关证号',
         width: '30%',
         align:'center',
     },
     {
         field: 'BDCDYH',
         title: '不动产单元号',
         width: '20%',
         align:'center',
      },
     {
         field: 'QLR',
         title: '相关联人',
         width: '20%',
         align:'center',
     },
     
];