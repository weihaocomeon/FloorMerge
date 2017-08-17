package com.ztgeo.dao;

import java.sql.ResultSet;

public interface Dao {

	//有条件查询 参数 string 关键字 返回值json数组的string字符串
	public ResultSet getData(String sql);
	
	//查询条数
	public int getCount(String sql);
	//预设prep的查询
	public ResultSet getDataByParams(String baseSql,String[] params);
	
	//转移
	public int doExecuteUpdate(String sql, String[] strings);
	
	//合并 非自动提交
	public int doExecuteUpdateNotAuto(String sql, String[] params);
	//复制
}
