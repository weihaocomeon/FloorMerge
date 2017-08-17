package com.ztgeo.util;
//分页相关
public class Page {
	//计算开始和结束
	public static int getStar(int page,int rows){
		return page*rows-rows+1;
	}
	
	public static int getEnd(int page,int rows){
		return page*rows;
		}
	
	public static int parseInt(String str){
		return Integer.parseInt(str);
	}
}
