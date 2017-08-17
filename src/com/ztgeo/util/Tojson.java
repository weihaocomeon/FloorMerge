package com.ztgeo.util;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

//数据转换json的工具类
public class Tojson {
	public static JSONArray resultToJsonArray(ResultSet set){
			//新建json数组
			JSONArray jsonArray = new JSONArray();
			
			//新建json对象
			JSONObject jsonObj = new JSONObject();
		try {	
			//获取列
			ResultSetMetaData mataData = set.getMetaData();
			
			//获取总列数
			int columnCount = mataData.getColumnCount();
			while (set.next()){  
				//遍历每一列并保存在jsonobj中
				for (int i = 1; i <= columnCount; i++) {
					String columnName = mataData.getColumnLabel(i);
					String columnValue = set.getString(i);
					jsonObj.put(columnName, columnValue);
				}
				
				//放入json数组
				jsonArray.add(jsonObj);
				
			}	
		} catch (SQLException e) {
				System.out.println("----结果集转换为列时报错");
				e.printStackTrace();
			}finally {
				Jdbc.closeResource();
				Jdbc.closeConn();
			}
			
			return jsonArray;
		}
	
	//json分页数据过滤
	public static JSONArray getJsonForPage(JSONArray array,int star,int end){
		JSONArray jsonArray = new JSONArray();
		for (int i = 0; i < array.size(); i++) {
			if(i>=star&&i<=end){
				jsonArray.add(array.get(i));
			}
		}
		return jsonArray;
	}
	
	//json格式转换器
	public static String getJsonData(Object results, int total) {
		Map<String, Object> reMap = new HashMap<>();
		reMap.put("rows", results);
		reMap.put("total", total);
		JSONObject responseJSONObject = JSONObject.fromObject(reMap); 
		return responseJSONObject.toString();
	}
	
	
	//update remove or update MSG toJson
	public static String msgTojson(int resultCount){
		Map<String, Integer> reMap = new HashMap<>();
		reMap.put("msg", resultCount);
		JSONObject responseJSONObject = JSONObject.fromObject(reMap); 
		return responseJSONObject.toString();
	}
	
	//对户对应的业务信息set进行筛选是否有slbh非空的状态

	public static List<String> isHaveBusiness(ResultSet set) {
		List<String> slbhs = new ArrayList<>();
		try {
			while(set.next()){
				String slbh = set.getString(1);
				System.out.println("--是否有业务查询时遍历出的slbh之一:"+slbh+"/n");
				if(slbh!=null&&!"".equals(slbh)){
					slbhs.add(slbh);
				}
			}
			
		} catch (SQLException e) {
			System.out.println("---查询是否有业务时结果集被关闭");
			e.printStackTrace();
		}finally {
			Jdbc.closeResource();
			Jdbc.closeConn();
		}
		return slbhs;
	}
	//判断合并的时候是否有bdcdyh不为空的
	public static List<String> isCanMerge(ResultSet set) {
		List<String> bdcdyhs = new ArrayList<>();
		try {
			while(set.next()){
				String tbdcdyh = set.getString(2);
				if(tbdcdyh!=null||!"".equals(tbdcdyh)){
					bdcdyhs.add(tbdcdyh);
					System.out.println("--是否有已发出证书的查询(能否被合并):找到一条空数据");
				}
			}
			
		} catch (SQLException e) {
			System.out.println("---查询是否有业务时结果集被关闭");
			e.printStackTrace();
		}finally {
			Jdbc.closeResource();
			Jdbc.closeConn();
		}
	     return bdcdyhs;
	}

	public static String msgTojson(int resultCount, String tstybm) {
		Map<String, Object> reMap = new HashMap<>();
		reMap.put("msg", resultCount);
		reMap.put("tstybm", tstybm);
		JSONObject responseJSONObject = JSONObject.fromObject(reMap); 
		return responseJSONObject.toString();
	}
}
