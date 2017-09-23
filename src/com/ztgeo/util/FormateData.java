package com.ztgeo.util;

public class FormateData {
	public static String formateResult(Object obj,int ifValue){
		int resultjson = (int) Double.parseDouble(obj.toString());
		if(resultjson>=ifValue){
			return "成功";
		}
		return "失败";
	}
	
	public static String getPPath(String url){
		//按照冒号进行分割
		String bb[] = url.split("/");
		return new String(bb[0]+bb[1]+"//"+bb[2]+"/");
	}
}
