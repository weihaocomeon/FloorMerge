package com.ztgeo.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;


@Aspect   //使用注解告诉spring这是织入类
@Component  //本类的初始化 未初始化 则不能使用aop 这点很重要
public class AopForLog {
	
	private final static Log log = LogFactory.getLog(AopForLog.class);
	
	@Pointcut("execution(* com.ztgeo.controller.Ctrl.*(..))") //切入点的集合  如果所有的切入方式都有统一切入点表达式 可以这样使用
	public void myPointCut(){};
	
	
	//环绕执行 方法前后都可以执行 用pjp执行方法 切记 aop必须使用返回值 否则404
	@Around("myPointCut()")
	public Object around(ProceedingJoinPoint pjp) throws Throwable{
		Object retVal=null;
		String funName = pjp.getSignature().getName(); //方法名称
		Object[]  args = pjp.getArgs(); //参数
			//将方法名和args传入日志记录进行匹配记录
		 retVal=pjp.proceed();
		 //返回值	
		 //查看是否配置了mongoDB的地址 如果配置了 则 进行记录  否则 不进行记录  
		if(ReadXml.mongodbUrl!=null&&!"".equals(ReadXml.mongodbUrl)){ 
			DoLog.doLog(funName, args,retVal);
		}
				return  retVal;
	}
	
	@AfterThrowing(pointcut="myPointCut()",throwing="e")//抛异常记录txt日志
	public void afterThrow(JoinPoint jointPoint,Exception e){
		System.out.println("---进入切面编程");
		//判断输出日志级别
		if(log.isErrorEnabled()){
			log.info("afterThrow"+jointPoint+"\t"+e.getMessage());
		}
		//详细错误信息
		StringBuffer ErrorMsg = new StringBuffer();
		StackTraceElement[] trace = e.getStackTrace();
		for (StackTraceElement s : trace) {
			ErrorMsg.append("\tat:"+ s + "\r\n");
		}
		
		//写入异常日志
		WriteErrorLog.writeLog(ErrorMsg.toString(), jointPoint, e);
	}
}
