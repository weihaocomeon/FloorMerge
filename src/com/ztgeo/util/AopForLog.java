package com.ztgeo.util;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import javax.servlet.ServletRequestAttributeEvent;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@Aspect   //使用注解告诉spring这是织入类
@Component  //本类的初始化 未初始化 则不能使用aop 这点很重要
public class AopForLog {
	
	private Lock lock = new ReentrantLock();
	
	private final static Log log = LogFactory.getLog(AopForLog.class);
	
	@Pointcut("execution(* com.ztgeo.controller.Ctrl.*(..))") //切入点的集合  如果所有的切入方式都有统一切入点表达式 可以这样使用
	public void myPointCut(){};
	
	
	//执行方法前 进行lock锁定线程  
	@Before("myPointCut()")  
    public void befor(){  
        System.out.println("前置通知被执行---");
        lock.lock();
    }  
	
	//执行方法后 无论是否异常 进行 执行后的lock 释放
	@After("myPointCut()")  
    public void after(){  
        System.out.println("方法执行后通知被执行---");
        lock.unlock();
    }  
	
	
	//环绕执行 方法前后都可以执行 用pjp执行方法 切记 aop必须使用返回值 否则404
	@Around("myPointCut()")
	public Object around(ProceedingJoinPoint pjp) throws Throwable{
	    HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		Object user = req.getSession().getAttribute("user");
		
		
		Object retVal=null;
		String funName = pjp.getSignature().getName(); //方法名称
		Object[]  args = pjp.getArgs(); //参数
			//将方法名和args传入日志记录进行匹配记录
		 retVal=pjp.proceed();
		 //返回值	
		 //查看是否配置了mongoDB的地址 如果配置了 则 进行记录  否则 不进行记录  
		
		 if(user!=null){//存在用户 则记录
			 if(ReadXml.mongodbUrl!=null&&!"".equals(ReadXml.mongodbUrl)){ 
					DoLog.doLog(funName, args,retVal,user.toString());
				}
			}
		 //释放资源
		 req=null;
		 user=null;
		 funName=null;
		 args=null;
				return  retVal;
	}
	
	//抛出异常后执行
	@AfterThrowing(pointcut="myPointCut()",throwing="e")//抛异常记录txt日志
	public void afterThrow(JoinPoint jointPoint,Exception e){
		System.out.println("---进入切面编程异常记载");
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
