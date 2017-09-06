package com.ztgeo.util;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.google.gson.Gson;

public class DoLog {
	private static String resultStr;//返回数
	public static String randomTstybm;
	static Gson gs =  new Gson();
	static Map<String,String> map =null;
	static Document doc =null;
	static Object sre = null;
	public static void doLog(String funName,Object[] params, Object retVal, String userName){
		//对方法名称进行判断
		switch (funName) {
		case "toTransfer"://转移
				//设置了关键词
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
			String[] trows = (String[])params[1];
			//将被合并的不动产单元号进行加入stringbuffer
			StringBuffer sb =new StringBuffer();
			for (int i = 0; i <trows.length; i++) {
				//判断是否是最后一位
					sb.append(trows[i]+",");
			}
			    doc = new Document();
				doc.append("opTime", GetSystimeDate.getTime())
				.append("opUser", userName)
				.append("opType", "转移操作")
				.append("opIds", new Document().append("被转移户的TSTYBM:",sb.toString()).append("转移到的LSZTYBM:", params[0]))
				.append("opResult",resultStr);
				MongodbUtil.insertMongo(doc);
				break;
		case "delH":  //删除户信息
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "普通删除户操作")
			.append("opIds", new Document().append("被删除户的TSTYBM:",params[0]))
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
			break;
			
		case "stillDelH":
				//强制删除户信息
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "强制删除户操作")
			.append("opIds", new Document().append("被删除户的TSTYBM:",params[0]))
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
			break;
			
		case "toMergeH":
			//合并户信息
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "合并户操作")
			.append("opIds", new Document().append("被合并户的TSTYBM:",params[1])
					.append("合并至户的TSTYBM", params[0])
					.append("合并至户的BDCDYH", params[2]))
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
		break;
		
		case "splitH":
			//分割户操作
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "分割户操作")
			.append("opIds", new Document()
					.append("被分割户的TSTYBM", params[0])
					.append("分割后新户的TSTYBM",randomTstybm))
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
		break;
		
		case "delZ":
			//删除幢信息
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "删除幢操作")
			.append("opIds", new Document()
					.append("被删除幢的TSTYBM", params[0]))
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
		break;
		
		case "toMergeZ":
			//幢的合并
			map = gs.fromJson(retVal.toString(), Map.class);
		    sre = map.get("msg");
			resultStr=FormateData.formateResult(sre, 1);
		    doc = new Document();
			doc.append("opTime", GetSystimeDate.getTime())
			.append("opUser", userName)
			.append("opType", "删除幢操作")
			.append("opIds", new Document()
					.append("去合并幢的TSTYBM", params[0]))
					.append("被合并幢的TSTYBM", params[1])
			.append("opResult",resultStr);
			MongodbUtil.insertMongo(doc);
		break;
		default:
			break;
		}
		
	}
}
