package com.ztgeo.service.impl;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.junit.Test;
import org.springframework.stereotype.Service;

import com.ztgeo.dao.Dao;
import com.ztgeo.service.DataService;
import com.ztgeo.util.DoLog;
import com.ztgeo.util.Jdbc;
import com.ztgeo.util.Page;
import com.ztgeo.util.Tojson;

import net.sf.json.JSONArray;



@Service("service")
public class Serviceimpl implements DataService {
	@Resource(name = "dao")
	private Dao dao;
	
	public String getDataByKeyWord(String keyword,String page, String rows){
		String sql = "select * from fc_z_qsdc z where z.fwzl like '%"+keyword+"%' order by zz asc";
		System.out.println(sql);
		//string转int
		int pageInt = Page.parseInt(page);
		int rowsInt = Page.parseInt(rows);

		//拿到全部数据
		JSONArray jsonarray = Tojson.resultToJsonArray(dao.getData(sql));
		//进行过滤数据
		JSONArray newArray = Tojson.getJsonForPage(jsonarray, Page.getStar(pageInt, rowsInt)-1,Page.getEnd(pageInt, rowsInt)-1);
		
		return Tojson.getJsonData(newArray,jsonarray.size()) ;
	}

	
	
	@Override
	public String getDataByParams(String page, String rows, String sort, String order, String tstybm,String keyword) {
		String[] params = new String[3];
		String baseSql ="";
		//计算起始条和结束条
		int star =Page.getStar(Page.parseInt(page), Page.parseInt(rows));
		int end = Page.getEnd(Page.parseInt(page), Page.parseInt(rows));
		//对参数判断 整理成数组传入底层 对是否有sort排序做判断
		String sqlCount = "";
	if(keyword.length()==0){//无关键字
		sqlCount = "select count(1) from fc_h_qsdc h where h.lsztybm = '"+tstybm+"'";
		if(sort==null||sort.length()==0){
			//无值 赋初始值
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_h_qsdc h  where h.lsztybm = ? order by zl asc) a1 where rownum <= ?) where rn >= ?";
			
		}else{ 
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_h_qsdc h  where h.lsztybm = ? order by "+sort+" "+order+") a1 where rownum <= ?) where rn >= ?";
			
		}
	}else{//有关键字
		sqlCount = "select count(1) from fc_h_qsdc h where h.lsztybm = '"+tstybm+"' and h.zl like '%"+keyword+"%'";
		if(sort==null||sort.length()==0){
			//无值 赋初始值
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_h_qsdc h  where h.lsztybm = ? and h.zl like '%"+keyword+"%' order by zl asc) a1 where rownum <= ?) where rn >= ?";
			
		}else{ 
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_h_qsdc h  where h.lsztybm = ? and h.zl like '%"+keyword+"%' order by "+sort+" "+order+") a1 where rownum <= ?) where rn >= ?";
			
		}
		
	}	
		
		 params[0]=tstybm;
		 params[1]=String.valueOf(end);
		 params[2]=String.valueOf(star);
		
		//base sql
		
		//获得总数
				int	total = 0;
				
				total = dao.getCount(sqlCount);
				System.out.println("函数:"+sqlCount+"拿到的条数信息:"+total);
				ResultSet set =dao.getDataByParams(baseSql, params);
		//传入底层  获得数据
		JSONArray jsonarray = Tojson.resultToJsonArray(set);
		
		
		return Tojson.getJsonData(jsonarray, total);
		
	}



	@Override
	public String getDataByKeyWordAndPage(String page, String rows, String sort, String order, String keyword) {
		String[] params = new String[2];
		String baseSql ="";
		int star =Page.getStar(Page.parseInt(page), Page.parseInt(rows));
		int end = Page.getEnd(Page.parseInt(page), Page.parseInt(rows));
		if(sort==null||sort.length()==0){
			//无值 赋初始值
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_z_qsdc z where z.fwzl like '%"+keyword+"%' order by zh asc) a1 where rownum <= ?) where rn >= ?";
			
		}else{
			 baseSql = "select * from (select a1.*, rownum rn  from (select * from fc_z_qsdc z where z.fwzl like '%"+keyword+"%' order by "+sort+" "+order+") a1 where rownum <= ?) where rn >= ?";
			
		}
		params[0]=String.valueOf(end);
		params[1]=String.valueOf(star);
		JSONArray jsonarray = Tojson.resultToJsonArray(dao.getDataByParams(baseSql, params));
		int	total = 0;
		String sqlCount = "select count(1) from fc_z_qsdc z where z.fwzl like '%"+keyword+"%'";
		total = dao.getCount(sqlCount);
		return Tojson.getJsonData(jsonarray, total);
	}



	@Override
	public String toTransfer(String tstybm, String[] trows) {
		//遍历trows数组拿出数据进行执行底层
		//进行stringbuffer的拼接
		StringBuffer sb =new StringBuffer();
		for (int i = 0; i < trows.length; i++) {
			//判断是否是最后一位
			if(i==(trows.length-1)){
				sb.append("'"+trows[i]+"'");
			}else{
				sb.append("'"+trows[i]+"',");	
			}
		}
		String sql ="update fc_h_qsdc set lsztybm='"+tstybm+"' where tstybm in( "+ sb.toString()+" )";
		System.out.println("转移户的sql语句:"+sql);
		int resultCount = dao.doExecuteUpdate(sql,new String[0]);
		//将影响的条数放入json封装对象进行加工成json
		return Tojson.msgTojson(resultCount);
	}

	@Override
	public String toSelectBusiness(String tstybm) {
		JSONArray jsonarray = new JSONArray();
		String[] params = new String[1];
		params[0] = tstybm;
		String sql = "select gl.slbh from dj_tsgl gl left join fc_h_qsdc h  on h.tstybm = gl.tstybm where h.tstybm = ?";
		ResultSet set =dao.getDataByParams(sql, params);
		//将结果集放入json判断处理
		List<String> slbhs = Tojson.isHaveBusiness(set);
		//循环进行编译slbhs拼接字符串
		StringBuffer sb = new StringBuffer();
		//判断如果>0 则有权属信息 进行权属的再次查询
		if(slbhs.size()>0){
			for (int i = 0; i <slbhs.size(); i++) {
				if(i<slbhs.size()-1){
					sb.append("'"+slbhs.get(i)+"',");
				}else{
					sb.append("'"+slbhs.get(i)+"'");
				}
			}
			System.out.println("---拼接的sql条件:"+sb);
		String busInfoSql = 
				"select zx.djlx,\n" +
						"       zx.slbh,\n" + 
						"       zx.xgzh bdczh,\n" + 
						"       zx.bdcdyh,\n" + 
						"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
						"  from dj_xgdjzx zx\n" + 
						"  left join dj_qlrgl qlrgl\n" + 
						"    on qlrgl.slbh = zx.slbh\n" + 
						"  left join dj_qlr qlr\n" + 
						"    on qlr.qlrid = qlrgl.qlrid\n" + 
						" where zx.slbh in ( "+sb+" )\n" + 
						" group by zx.djlx, zx.slbh, zx.xgzh, zx.bdcdyh\n" + 
						"union\n" + 
						"select dy.dylx,\n" + 
						"       dy.slbh,\n" + 
						"       dy.bdczmh bdczh,\n" + 
						"       dy.bdcdyh,\n" + 
						"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
						"  from dj_dy dy\n" + 
						"  left join dj_qlrgl qlrgl\n" + 
						"    on qlrgl.slbh = dy.slbh\n" + 
						"  left join dj_qlr qlr\n" + 
						"    on qlr.qlrid = qlrgl.qlrid\n" + 
						" where dy.slbh in ( "+sb+" )\n" + 
						" group by dy.dylx, dy.slbh, dy.bdczmh, dy.bdcdyh\n" + 
						"union\n" + 
						"select yy.yysx djlx,\n" + 
						"       yy.slbh,\n" + 
						"       yy.bdczmh bdczh,\n" + 
						"       yy.bdcdyh,\n" + 
						"       wmsys.wm_concat(to_char(qlr.qlrmc))\n" + 
						"  from dj_yy yy\n" + 
						"  left join dj_qlrgl qlrgl\n" + 
						"    on qlrgl.slbh = yy.slbh\n" + 
						"  left join dj_qlr qlr\n" + 
						"    on qlr.qlrid = qlrgl.qlrid\n" + 
						" where yy.slbh in ( "+sb+" )\n" + 
						" group by yy.yysx, yy.slbh, yy.bdczmh, yy.bdcdyh\n" + 
						"union\n" + 
						"select djb.djlx,\n" + 
						"       djb.slbh slbh,\n" + 
						"       djb.bdczh bdczh,\n" + 
						"       djb.bdcdyh bdcdyh,\n" + 
						"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
						"  from dj_djb djb\n" + 
						"  left join dj_qlrgl qlrgl\n" + 
						"    on qlrgl.slbh = djb.slbh\n" + 
						"  left join dj_qlr qlr\n" + 
						"    on qlr.qlrid = qlrgl.qlrid\n" + 
						" where djb.slbh in ( "+sb+" )\n" + 
						" group by djb.djlx, djb.slbh, djb.bdczh, djb.bdcdyh\n" + 
						"union\n" + 
						"select cf.cflx djlx,\n" + 
						"       cf.slbh,\n" + 
						"       cf.xgzh bdczh,\n" + 
						"       cf.bdcdyh,\n" + 
						"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
						"  from dj_cf cf\n" + 
						"  left join dj_qlrgl qlrgl\n" + 
						"    on qlrgl.slbh = cf.slbh\n" + 
						"  left join dj_qlr qlr\n" + 
						"    on qlr.qlrid = qlrgl.qlrid\n" + 
						" where cf.slbh in ( "+sb+" )\n" + 
						" group by cf.cflx, cf.slbh, cf.xgzh, cf.bdcdyh";
		System.out.println("---联合查询相关业务的sql语句:"+busInfoSql);
		set =dao.getData(busInfoSql);
		//结果集进行处理
		jsonarray = Tojson.resultToJsonArray(set);
		}
		return  Tojson.getJsonData(jsonarray,slbhs.size()) ;
	}



	@Override
	public String delH(String tstybm) {
		String[] params = new String[1];
		params[0] = tstybm;
		String sql = "delete from fc_h_qsdc where tstybm =?";
		int resultCount = dao.doExecuteUpdate(sql, params);
		return Tojson.msgTojson(resultCount);
	}



	@Override
	public String isCanMerge(String tstybm) {
		JSONArray jsonarray = new JSONArray();
		String[] params = new String[1];
		params[0] = tstybm;
		String sql = "select h.bdcdyh,ts.bdcdyh from fc_h_qsdc h ,dj_tsgl ts where h.tstybm =? and h.tstybm = ts.tstybm";
		ResultSet set =dao.getDataByParams(sql, params);
		List<String> bdcdyhs = Tojson.isCanMerge(set);
		if(bdcdyhs.size()>0){
			sql = "select gl.slbh from dj_tsgl gl left join fc_h_qsdc h  on h.tstybm = gl.tstybm where h.tstybm = ?";
			set =dao.getDataByParams(sql, params);
			//将结果集放入json判断处理
			List<String> slbhs = Tojson.isHaveBusiness(set);
			//循环进行编译slbhs拼接字符串
			StringBuffer sb = new StringBuffer();
			//判断如果>0 则有权属信息 进行权属的再次查询
			if(slbhs.size()>0){
				for (int i = 0; i <slbhs.size(); i++) {
					if(i<slbhs.size()-1){
						sb.append("'"+slbhs.get(i)+"',");
					}else{
						sb.append("'"+slbhs.get(i)+"'");
					}
				}
				System.out.println("---拼接的sql条件:"+sb);
			String busInfoSql = 
					"select zx.djlx,\n" +
							"       zx.slbh,\n" + 
							"       zx.xgzh bdczh,\n" + 
							"       zx.bdcdyh,\n" + 
							"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
							"  from dj_xgdjzx zx\n" + 
							"  left join dj_qlrgl qlrgl\n" + 
							"    on qlrgl.slbh = zx.slbh\n" + 
							"  left join dj_qlr qlr\n" + 
							"    on qlr.qlrid = qlrgl.qlrid\n" + 
							" where zx.slbh in ( "+sb+" )\n" + 
							" group by zx.djlx, zx.slbh, zx.xgzh, zx.bdcdyh\n" + 
							"union\n" + 
							"select dy.dylx,\n" + 
							"       dy.slbh,\n" + 
							"       dy.bdczmh bdczh,\n" + 
							"       dy.bdcdyh,\n" + 
							"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
							"  from dj_dy dy\n" + 
							"  left join dj_qlrgl qlrgl\n" + 
							"    on qlrgl.slbh = dy.slbh\n" + 
							"  left join dj_qlr qlr\n" + 
							"    on qlr.qlrid = qlrgl.qlrid\n" + 
							" where dy.slbh in ( "+sb+" )\n" + 
							" group by dy.dylx, dy.slbh, dy.bdczmh, dy.bdcdyh\n" + 
							"union\n" + 
							"select yy.yysx djlx,\n" + 
							"       yy.slbh,\n" + 
							"       yy.bdczmh bdczh,\n" + 
							"       yy.bdcdyh,\n" + 
							"       wmsys.wm_concat(to_char(qlr.qlrmc))\n" + 
							"  from dj_yy yy\n" + 
							"  left join dj_qlrgl qlrgl\n" + 
							"    on qlrgl.slbh = yy.slbh\n" + 
							"  left join dj_qlr qlr\n" + 
							"    on qlr.qlrid = qlrgl.qlrid\n" + 
							" where yy.slbh in ( "+sb+" )\n" + 
							" group by yy.yysx, yy.slbh, yy.bdczmh, yy.bdcdyh\n" + 
							"union\n" + 
							"select djb.djlx,\n" + 
							"       djb.slbh slbh,\n" + 
							"       djb.bdczh bdczh,\n" + 
							"       djb.bdcdyh bdcdyh,\n" + 
							"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
							"  from dj_djb djb\n" + 
							"  left join dj_qlrgl qlrgl\n" + 
							"    on qlrgl.slbh = djb.slbh\n" + 
							"  left join dj_qlr qlr\n" + 
							"    on qlr.qlrid = qlrgl.qlrid\n" + 
							" where djb.slbh in ( "+sb+" )\n" + 
							" group by djb.djlx, djb.slbh, djb.bdczh, djb.bdcdyh\n" + 
							"union\n" + 
							"select cf.cflx djlx,\n" + 
							"       cf.slbh,\n" + 
							"       cf.xgzh bdczh,\n" + 
							"       cf.bdcdyh,\n" + 
							"       wmsys.wm_concat(to_char(qlr.qlrmc)) qlr\n" + 
							"  from dj_cf cf\n" + 
							"  left join dj_qlrgl qlrgl\n" + 
							"    on qlrgl.slbh = cf.slbh\n" + 
							"  left join dj_qlr qlr\n" + 
							"    on qlr.qlrid = qlrgl.qlrid\n" + 
							" where cf.slbh in ( "+sb+" )\n" + 
							" group by cf.cflx, cf.slbh, cf.xgzh, cf.bdcdyh";
			System.out.println("---联合查询相关业务的sql语句:"+busInfoSql);
			set =dao.getData(busInfoSql);
			//结果集进行处理
			jsonarray = Tojson.resultToJsonArray(set);
			}
		}
		return Tojson.getJsonData(jsonarray,bdcdyhs.size()) ;
	}


	//合并的功能
	@Override
	public String toMergeH(String tTstybm, String bTstybm,String bdcdyh) {
		int margeCount =-1;
		int delCount =-1;
		String[] params1 = new String[3];
		params1[0] = tTstybm;
		params1[1] = bdcdyh;
		params1[2] = bTstybm;
		String sql1 = "update dj_tsgl ts set ts.tstybm  =?,ts.bdcdyh = ? where ts.tstybm = ?";
		
		String[] params2 = new String[1];
		params2[0] = bTstybm;
		String sql2 = "delete from fc_h_qsdc h where h.tstybm =?";
		//需要设置手动提交的处理方式
		Connection conn =Jdbc.getConn();
		//设置手动提交
		try {
			conn.setAutoCommit(false);
			//执行替换tstybm的工作
	    margeCount = dao.doExecuteUpdateNotAuto(sql1,params1);
			//执行删除户的操作
	    delCount = dao.doExecuteUpdateNotAuto(sql2,params2);
		if((margeCount!=-1)&&(delCount!=-1&&delCount!=0)){
			//全部执行则提交
			conn.commit();
		}else{
			//有一项执行失败则回滚
			conn.rollback();
			System.out.println("--执行合并有部分语句执行失败,数据已回滚");
			return Tojson.msgTojson(-1);
		}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			//重设提交方式
			try {
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				System.out.println("---重设提交方式为自动提交失败");
				e.printStackTrace();
			}
			Jdbc.closeConn();
			Jdbc.closeResource();
		}
		System.out.println("---执行合并时替换了"+margeCount+"条,删除了:"+delCount+"条!");
		return  Tojson.msgTojson(1);
	}


	//是否可删除
	@Override
	public String isCanDel(String tstybm) {
		String sql = "select count(1) from fc_h_qsdc h where h.lsztybm = '"+tstybm+"'";
		int total = dao.getCount(sql);
		return Tojson.msgTojson(total);
	}



	@Override
	public String delZ(String tstybm) {
		String sql = "delete from fc_z_qsdc z where z.tstybm =?";
		String[] params = new String[1];
		params[0]=tstybm;
		int total = dao.doExecuteUpdate(sql, params);
		return Tojson.msgTojson(total);
	}


	
	@Override
	public String stillDelH(String tstybm) {
		//用到批量操作
		int delTsCount =-1;
		int delHCount =-1;
		String[] params = new String[1];
		params[0] = tstybm;
		
		String sql1 = "delete from dj_tsgl ts where ts.tstybm=?";
		
		String sql2 = "delete from fc_h_qsdc h where h.tstybm =?";
		//需要设置手动提交的处理方式
		Connection conn =Jdbc.getConn();
		//设置手动提交
		try {
			conn.setAutoCommit(false);
			//执行替换tstybm的工作
			delTsCount = dao.doExecuteUpdateNotAuto(sql1,params);
			//执行删除户的操作
			delHCount = dao.doExecuteUpdateNotAuto(sql2,params);
		if((delTsCount!=-1&&delTsCount!=0)&&(delHCount!=-1&&delHCount!=0)){
			//全部执行则提交
			conn.commit();
		}else{
			//有一项执行失败则回滚
			conn.rollback();
			System.out.println("--执行强制删除户信息有部分语句执行失败,数据已回滚");
			return Tojson.msgTojson(-1);
		}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			//重设提交方式
			try {
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				System.out.println("---重设提交方式为自动提交失败");
				e.printStackTrace();
			}
			Jdbc.closeConn();
			Jdbc.closeResource();
		}
		System.out.println("强制性删除时: 删除户信息:"+delHCount+"条,删除图属信息:"+delTsCount);
		return Tojson.msgTojson(1);
	}


	//分割户
	@Override
	public String splitH(String btstybm, String bbdcdyh) {
		//生成uuid
		String tstybm = UUID.randomUUID().toString();
		System.out.println("生成的随机码:"+tstybm);
		//随机码给日志类赋值
		DoLog.randomTstybm=tstybm;
		int insertCount1=0;
		int insertCount2=0;
		String[] params1 = new String[2];
		params1[0] = tstybm;		//分割后的主键
		params1[1] = btstybm;	//被分割的图属统一编码
		String sql1 ="insert into dj_tsgl ts (ts.glbm,ts.slbh,ts.bdclx,ts.tstybm,ts.djzl,ts.glms,ts.cssj,ts.lifecycle) select sys_guid(),gl.slbh,gl.bdclx,?,gl.djzl,gl.glms,gl.cssj,gl.lifecycle from dj_tsgl gl where gl.tstybm =?";
		String[] params2 = new String[2];
		params2[0] = tstybm;
		params2[1] = btstybm;
		String sql2 = 
				"insert into fc_h_qsdc h(h.qdfs,h.tstybm,h.zdtybm,h.zh,h.hh,h.lsztybm,h.lsfwbh,h.qllx,h.qlxz,h.ghyt,h.zl,h.sjc,h.myc,h.dyh,h.fjh,h.ljzh,h.jzmj,h.tnjzmj,h.ftjzmj,h.tdyt,h.tdsyqr,h.gytdmj,h.fttdmj,h.fwlx,h.fwxz,h.lifecycle,h.tdqlxz) " +
						" select h.qdfs, ?,h.zdtybm,h.zh,h.hh,h.lsztybm,h.lsfwbh,h.qllx,h.qlxz,h.ghyt,h.zl,h.sjc,h.myc,h.dyh,h.fjh,h.ljzh,h.jzmj,h.tnjzmj,h.ftjzmj,h.tdyt,h.tdsyqr,h.gytdmj,h.fttdmj,h.fwlx,h.fwxz,h.lifecycle,h.tdqlxz from fc_h_qsdc h " + 
						" where h.tstybm = ?";

		//需要设置手动提交的处理方式
		Connection conn =Jdbc.getConn();
		//设置手动提交
		try {
			conn.setAutoCommit(false);
			//执行替换tstybm的工作
			insertCount1 = dao.doExecuteUpdateNotAuto(sql1,params1);
			//执行删除户的操作
			insertCount2 = dao.doExecuteUpdateNotAuto(sql2,params2);
		if((insertCount1!=-1)&&(insertCount2!=-1&&insertCount2!=0)){
			//全部执行则提交
			conn.commit();
		}else{
			//有一项执行失败则回滚
			conn.rollback();
			System.out.println("--执行合并有部分语句执行失败,数据已回滚");
			return Tojson.msgTojson(-1);
		}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			//重设提交方式
			try {
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				System.out.println("---重设提交方式为自动提交失败");
				e.printStackTrace();
			}
			Jdbc.closeConn();
			Jdbc.closeResource();
		}
		
		return Tojson.msgTojson(1,tstybm);
	}
}
