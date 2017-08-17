package com.ztgeo.service;

public interface DataService {
	//根据关键字拼接sql语句 并查询结果
	public Object getDataByKeyWord(String keyword, String page, String rows);
	
	//关键字的分页查询
	public String getDataByKeyWordAndPage(String page, String rows, String sort, String order, String keyword);
	
	//有条件拼接的查询 预设prep
	public String getDataByParams(String page, String rows, String sort, String order, String tstybm, String keyword);
	
	//转移 
	public String toTransfer(String tstybm, String[] trows);
	
	//查询户信息是否办理过业务
	public String toSelectBusiness(String tstybm);
	
	//删除户信息
	public String delH(String tstybm);
	
	//强制删除户
	public String stillDelH(String tstybm);
	
	//查询被合并的户是否bdcdyh为空(既有没有发过证)
	public String isCanMerge(String tstybm);
	
	//合并功能  
	public String toMergeH(String tTstybm, String bTstybm, String bdcdyh);
	
	//是否可以删除
	public String isCanDel(String tstybm);
	
	//删除幢
	public String delZ(String tstybm);
	//分割户
	public String splitH(String btstybm, String bbdcdyh);
	
}
