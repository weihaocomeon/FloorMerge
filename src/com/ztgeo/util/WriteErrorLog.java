package com.ztgeo.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

//记录错误日志
public class WriteErrorLog {
	public static void writeLog(String ErrorLog,JoinPoint joinpoint,Exception e){
		
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		//获取请求的url
		StringBuffer requestUrl = request.getRequestURL();
		//获得参数信息
		String queryString = request.getQueryString();
		//封装完整请求的url
		if(queryString!=null){
			requestUrl.append("?").append(queryString);
		}
		String cla = joinpoint.getTarget().getClass().getName();//所在的类
		String method = joinpoint.getSignature().getName();//所在的方法
		File filedir = new File(ReadXml.logPath);
	try {
		if (!filedir.exists()) {
			filedir.mkdirs();
		}
		File file = new File(filedir,"FloorMergeErrorLog.log");
		if(!file.exists()){
			file.createNewFile();
		}
		FileOutputStream out = new FileOutputStream(file,true);
		//日志参数
		StringBuffer sb=new StringBuffer();
		sb.append("-----------"+GetSystimeDate.getTime()+"------------\r\n");
        sb.append("远程请求URL["+requestUrl+"]\r\n");
        sb.append("接口方法：["+cla+"."+method+"]\r\n");
        sb.append("详细错误信息："+e+"\r\n");
        sb.append(ErrorLog+"\r\n");
        out.write(sb.toString().getBytes("utf-8"));//注意需要转换对应的字符集
        out.close();
	} catch (IOException e1) {
		e1.printStackTrace();
	}
	}
}
