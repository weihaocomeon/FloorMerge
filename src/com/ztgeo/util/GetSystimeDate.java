package com.ztgeo.util;

import java.sql.Date;
import java.text.SimpleDateFormat;

//获得系统时间
public class GetSystimeDate {
	public static String getTime(){
			SimpleDateFormat sf = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");
			Date  curDate  = new  Date(System.currentTimeMillis());//获取当前时间       
			String  str = sf.format(curDate);   
			return str;
	}
}
