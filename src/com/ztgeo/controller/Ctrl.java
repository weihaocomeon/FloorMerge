package com.ztgeo.controller;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ztgeo.service.DataService;
import com.ztgeo.util.ReadXml;

@Controller
public class Ctrl {
	
	//装配属性
	@Resource(name="service")
	private DataService service;
	
	//目标文件的转发
	@RequestMapping(value ="/restourl") 
	public String ResToUrl(String url) {
		return url;
	}
	
	//根据关键字 查询 包含分页
	@RequestMapping(value ="getDataByKeywordAndPage",produces="application/json; charset=utf-8")
	@ResponseBody
	public Object  getDataByKeywordAndPage(@RequestParam(value="page", required=false) String page,@RequestParam(value="rows", required=false) String rows,
			@RequestParam(value="sort", required=false) String sort,@RequestParam(value="order", required=false) String order,@RequestParam(value="keyword",required=false) String keyword,
			@RequestParam(value="category", required=false) String category
			){
		System.out.println("---关键字"+keyword +"当前页/页面容量:"+page+rows);
		//如果关键字非空调用底层
			return service.getDataByKeyWordAndPage(page, rows, sort, order, keyword,category);
	}
	
	
	//根据关键字 查询 包含分页
	@RequestMapping("saveSession")
	public String saveSession(@RequestParam(value="user", required=false) String user,HttpServletRequest req,HttpSession session){
		//查看来源   本地服务器可以访问
		String url = req.getHeader("Referer");
		System.out.println("url的父级目录:"+url);
		if(ReadXml.RefererUrl.equals(url)||ReadXml.localUrl.equals(url)){
			//如果关键字非空调用底层
			System.out.println("进入到的session验证,携带的user属性是:"+user);
			if(user!=null&&!"".equals(user)){
				session.setAttribute("user", user);
				return "redirect:/";
			}else{
			return "sessionInfo";
			}
		}else{
			return "redirect:/arr.jsp";
		}
	}
	
	//获得户详情  
	@RequestMapping(value ="getHouseData",produces="application/json; charset=utf-8")
	@ResponseBody
	public Object getHouseData(@RequestParam(value="page", required=false) String page,@RequestParam(value="rows", required=false) String rows,
			@RequestParam(value="sort", required=false) String sort,@RequestParam(value="order", required=false) String order,
			@RequestParam(value="tstybm",required=false) String tstybm,@RequestParam("keyword") String keyword
			){
		System.out.println("tstybm:"+tstybm+"排序方式:"+order);
		Object obj = service.getDataByParams(page,rows,sort,order,tstybm,keyword);
	return obj;
	}
	
	//转移的功能
	@RequestMapping(value ="toTransfer",produces="application/json; charset=utf-8")
	@ResponseBody
	public String toTransfer(@RequestParam(value="tstybm") String tstybm,@RequestParam(value="trows[]", required=false) String[] trows){
		System.out.println("拿到的幢tstybm:"+tstybm+"户数组的长度:"+trows.length);
		//调用转移的底层功能
		return service.toTransfer(tstybm,trows);
	}
	
	//查询户信息是否有业务信息产生 toSelectBusiness
	@RequestMapping(value ="toSelectBusiness",produces="application/json; charset=utf-8")
	@ResponseBody
	public String toSelectBusiness(@RequestParam(value="tstybm") String tstybm){
		System.out.println("统计是否有业务拿到的幢tstybm:"+tstybm);
		//调用查询条数的底层功能
		return service.toSelectBusiness(tstybm);
	}
	
	//删除户信息
	@RequestMapping(value ="delH",produces="application/json; charset=utf-8")
	@ResponseBody
	public String delH(@RequestParam(value="tstybm") String tstybm){
		System.out.println("删除户信息拿到的幢tstybm:"+tstybm);
		//调用查询条数的底层功能
		return service.delH(tstybm);
	}
	
	//强制性删除户信息  删除的有两个sql语句 第一条删除hu信息 第二条删除tsgl中该条对应的信息;其他表暂时不动
	//slbhs存在 是因为以后可能会做功能拓展,展示保留
	@RequestMapping(value ="stillDelH",produces="application/json; charset=utf-8")
	@ResponseBody
	public String stillDelH(@RequestParam(value="tstybm") String tstybm,
			@RequestParam(value="slbhs") String slbhs,@RequestParam(value="row") String row){	
		System.out.println("强制性删除户信息拿到的幢tstybm:"+tstybm+"slbhs是:"+slbhs);
		//调用查询条数的底层功能
		return service.stillDelH(tstybm);
	}
	
	//合并操作时判断是否可以合并isCanMerge
	@RequestMapping(value ="isCanMerge",produces="application/json; charset=utf-8")
	@ResponseBody
	public String isCanMerge(@RequestParam(value="tstybm") String tstybm){
		System.out.println("统计是否有业务拿到的幢tstybm:"+tstybm);
		//调用查询条数的底层功能
		return service.isCanMerge(tstybm);
	}
	
	//合并户信息toMergeH
	@RequestMapping(value ="toMergeH",produces="application/json; charset=utf-8")
	@ResponseBody
	public String toMergeH(@RequestParam(value="tTstybm") String tTstybm,@RequestParam(value="bTstybm") String bTstybm,
			@RequestParam(value="bdcdyh") String bdcdyh
			){
		System.out.println("去合并的tstybm:"+tTstybm+"\n被合并"+bTstybm);
		//调用查询条数的底层功能   
		//执行的步骤1.tsgl的重新挂接 2.h信息的删除 3.bdcdyh的重新赋值
		return service.toMergeH(tTstybm,bTstybm,bdcdyh);
	}
	
	//查询是否可以被删除
	@RequestMapping(value ="isCanDel",produces="application/json; charset=utf-8")
	@ResponseBody
	public String isCanDel(@RequestParam(value="tstybm") String tstybm){
		System.out.println("删除幢信息查看是否有户信息拿到的tstybm:"+tstybm);
		//调用查询条数的底层功能   
		return service.isCanDel(tstybm);
	}
	
	//删除幢
	@RequestMapping(value ="delZ",produces="application/json; charset=utf-8")
	@ResponseBody
	public String delZ(@RequestParam(value="tstybm") String tstybm){
		System.out.println("删除幢信息拿到的tstybm:"+tstybm);
		//调用查询条数的底层功能   
		return service.delZ(tstybm);
	}
	
	//合并幢 
	@RequestMapping(value ="toMergeZ",produces="application/json; charset=utf-8")
	@ResponseBody
	public String toMergeZ(@RequestParam(value="tTstybm") String tTstybm,@RequestParam(value="bTstybm") String bTstybm){
		System.out.println("合并幢信息的TSTYBM:"+tTstybm+bTstybm);
		//调用查询条数的底层功能   
		return service.toMergeZ(tTstybm,bTstybm);
	}
	
	
	//拆分户 拆分之前已复制性新增户 现在需要拿到被复制的tstybm 查到slbh 并赋值给新赋值的户信息上
	@RequestMapping(value="splitH",produces="application/json;charset=utf-8")
	@ResponseBody
	public String splitH(@RequestParam(value="btstybm") String btstybm,
		@RequestParam(value="bbdcdyh",required=false)String bbdcdyh){
		System.out.println("被分割户的tstybm:"+btstybm+",被分割后的bdcdyh:"+bbdcdyh);
		return service.splitH(btstybm,bbdcdyh);
	}
	
}
