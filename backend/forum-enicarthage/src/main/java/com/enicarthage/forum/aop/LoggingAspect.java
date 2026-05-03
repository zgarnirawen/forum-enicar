package com.enicarthage.forum.aop;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect @Component @Log4j2
public class LoggingAspect {

    @Around("execution(* com.enicarthage.forum.service.*.*(..))")
    public Object logAround(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        log.debug("{}.{}() executed in {}ms",
                pjp.getSignature().getDeclaringTypeName(),
                pjp.getSignature().getName(),
                System.currentTimeMillis() - start);
        return result;
    }
}
