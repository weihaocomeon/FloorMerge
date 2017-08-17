package com.ztgeo.util;

import org.bson.Document;
import org.junit.Test;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

//mongodb操作数据库
public class MongodbUtil {

	public static void insertMongo(Document doc){
		MongoClient mongoClient = new MongoClient(ReadXml.mongodbUrl);
		MongoDatabase database = mongoClient.getDatabase("mydb");
		MongoCollection<Document> col = database.getCollection("users");
		col.insertOne(doc);
	}
	
	@Test
	public void test(){
	}
}
