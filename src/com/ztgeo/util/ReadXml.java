package com.ztgeo.util;

import java.io.File;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class ReadXml {
	public static String url ;//数据库连接地址
	public static String username; //用户名
	public static String password; //密码
	public static String mongodbUrl;//mongodb数据库url
	public static String logPath;//logPath
	public static String localUrl;//本项目访问地址
	public static String RefererUrl;//程序接入点的url
	public static String mongoDBName;//使用的mongodb数据库名称
	public static String collName;//使用的mongodb集合名称
	public static String serverPath;//补录软件地址
	public static String Ztable;//删除幢的备份表
	public static String Htable;//删除户的备份表
	
	
	
	static{
		SAXReader reader = new SAXReader();
		try {
			String userdir = System.getProperty("catalina.home");
			String filePath =userdir+"\\webapps\\FloorMerge\\xml\\property.xml";
			System.out.println("当前的配置文件地址:"+filePath);
			Document doc = reader.read(new File(filePath));
			Element root = doc.getRootElement();
			List<Element> elements = root.elements();
			for (Element e : elements) {
				String elementName = e.getName();
				switch (elementName) {
				case "serverPath":
					serverPath = e.getText();
					System.out.println("serverPath:"+serverPath);
				break;
				case "url":
					
						url = e.getText();
						System.out.println("url1:"+url);
					break;
				case "password":
						password = e.getText();
						System.out.println("password:"+password);
					break;
					
				case "username":
					username = e.getText();
					System.out.println("username:"+username);
					break;
				case "mongodbUrl":
					mongodbUrl = e.getText();
					System.out.println("mongodbUrl:"+mongodbUrl);
					break;
				case "logPath":
					logPath = e.getText();
					System.out.println("logPath:"+logPath);
					break;
				case "localUrl":
					localUrl = e.getText();
					System.out.println("localUrl:"+localUrl);
					break;
				case "RefererUrl":
					RefererUrl = e.getText();
					System.out.println("RefererUrl:"+RefererUrl);
					break;
				case "mongoDBName":
					mongoDBName = e.getText();
					System.out.println("mongoDBName:"+mongoDBName);
					break;
				case "collName":
					collName = e.getText();
					System.out.println("collName:"+collName);
					break;	
				case "Ztable":
					Ztable = e.getText();
					System.out.println("Ztable:"+Ztable);
					break;	
				case "Htable":
					Htable = e.getText();
					System.out.println("Htable:"+Htable);
					break;		
				default:
					break;
				}
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		
	}
}
