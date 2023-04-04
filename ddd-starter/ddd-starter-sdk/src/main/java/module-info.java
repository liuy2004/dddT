module gitee.com.ericfox.ddd.starter.sdk {
    requires cn.hutool;
    requires spring.boot;
    requires gitee.com.ericfox.ddd.common;
    requires spring.context;
    requires lombok;
    requires spring.boot.autoconfigure;
    requires spring.beans;
    requires org.slf4j;
    requires spring.web;
    requires spring.messaging;
    requires reactor.core;
    requires java.xml;
    requires spring.core;
    requires jakarta.annotation;
    requires java.sql;
//    requires activerecord;

    exports gitee.com.ericfox.ddd.starter.sdk.properties;
    exports gitee.com.ericfox.ddd.starter.sdk.service.gen_code;
    exports gitee.com.ericfox.ddd.starter.sdk.service;
}