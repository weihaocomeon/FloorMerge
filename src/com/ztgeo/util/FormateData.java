package com.ztgeo.util;

public class FormateData {
	public static String formateResult(Object obj,int ifValue){
		int resultjson = (int) Double.parseDouble(obj.toString());
		if(resultjson>=ifValue){
			return "成功";
		}
		return "失败";
	}
}
