package com.ztgeo.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

//管理数据库
@Repository("jdbc")
public class Jdbc {
	//驱动
	
	private static String driver = "oracle.jdbc.driver.OracleDriver";
	private static Connection conn;
	private static ResultSet set;
	private static int resultCount;
	private static PreparedStatement prep;
	public static Connection getConn(){
		//获得驱动
		try {
			Class.forName(driver);
			conn = DriverManager.getConnection(ReadXml.url, ReadXml.username, ReadXml.password);
		} catch (ClassNotFoundException e) {
			System.out.println("----未发现数据库驱动类");
			e.printStackTrace();
		} catch (SQLException e) {
			System.out.println("----连接数据库失败") ;
			e.printStackTrace();
		}
		return conn;
	}
	
	
	//无预设的查询
	public static ResultSet getData(String sql){
		//获得连接
		conn = getConn();
		try {
			prep = conn.prepareStatement(sql);
			set = prep.executeQuery();
		} catch (SQLException e) {
			System.out.println("----预编译sql语句有误");
			e.printStackTrace();
		}
		return set;
	}
	
	//获得条数
	public static int getCount(String sql){
		int total = 0;
		//获得连接
		conn = getConn();
		try {
			prep = conn.prepareStatement(sql);
			set = prep.executeQuery();
			while(set.next()){
				total = set.getInt(1);
			}
		} catch (SQLException e) {
			System.out.println("----预编译sql语句有误");
			e.printStackTrace();
			return -1;
		}finally {
			closeConn();
			closeResource();
		}
		return total;
	}
	
	
	//有预设的查询 可用于分页等
	public static ResultSet getDataByParams(String baseSql,String[] params){
		conn = getConn();
		//遍历params进行预设prep
		try {
			prep = conn.prepareStatement(baseSql);
			//循环赋值预设
			for (int i = 0; i < params.length; i++) {
				prep.setObject(i+1, params[i]);
			}
			set = prep.executeQuery();
		} catch (SQLException e) {
			System.out.println("----预编译sql语句有误");
			e.printStackTrace();
		}
		return set;
	};
	
	//执行增改查的工作 
	public static int doExecuteUpdate(String baseSql,String[] params){
		conn= getConn();
		try {
			prep = conn.prepareStatement(baseSql);
			//循环赋值预设
			for (int i = 0; i < params.length; i++) {
				prep.setObject(i+1, params[i]);
			}
			resultCount=prep.executeUpdate();
		} catch (SQLException e) {
			System.out.println("----预编译sql语句有误");
			e.printStackTrace();
			return -1;//如果return-1 说明更新失败 在上层做判断
		}finally {
			closeConn();
			closeResource();
		}
		return resultCount;
	} 
	
	//批量提交的执行增删改的方法
	//执行增改查的工作 
		public static int doExecuteUpdateNotAuto(String baseSql,String[] params){
			//使用本方法记得获得连接 设置连接 关闭连接
			try {
				prep = conn.prepareStatement(baseSql);
				//循环赋值预设
				for (int i = 0; i < params.length; i++) {
					prep.setObject(i+1, params[i]);
				}
				resultCount=prep.executeUpdate();
			} catch (SQLException e) {
				System.out.println("----预编译sql语句有误");
				e.printStackTrace();
				return -1;//如果return-1 说明更新失败 在上层做判断
			}
			return resultCount;
		} 
		
		
		public static void closeConn(){
			try {
				if(!conn.isClosed()){
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("-----关闭连接时遇到问题");
				e.printStackTrace();
			}
			
		} 
	
	//关闭资源文件
	public static void closeResource(){
		try {
			
			if(prep!=null){
				prep.close();
			}
			if(set!=null){
				set.close();
			}
		} catch (SQLException e) {
			System.out.println("----关闭资源文件遇到问题");
			e.printStackTrace();
		}
		
		
	}
	
	
	
}
	