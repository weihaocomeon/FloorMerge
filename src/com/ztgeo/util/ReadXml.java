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
	
	
	static{
		SAXReader reader = new SAXReader();
		try {
			String userdir = System.getProperty("catalina.home");
			String filePath =userdir+"//webapps//FloorMerge//xml//property.xml";
			Document doc = reader.read(new File(filePath));
			Element root = doc.getRootElement();
			List<Element> elements = root.elements();
			for (Element e : elements) {
				String elementName = e.getName();
				switch (elementName) {
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
				default:
					break;
				}
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		
	}
}
