module gitee.com.ericfox.ddd.infrastructure {
    requires spring.context;
    requires jakarta.annotation;
    requires gitee.com.ericfox.ddd.common;
    requires lombok;
    requires org.apache.lucene.core;
    requires org.slf4j;
    requires org.apache.tomcat.embed.core;
    requires org.apache.lucene.sandbox;
    requires spring.jdbc;
    requires spring.boot.autoconfigure;
    requires spring.beans;
    requires spring.core;
    requires spring.web;
    requires okhttp3;
    requires r2dbc.spi;
    requires reactor.core;

//    exports gitee.com.ericfox.ddd.infrastructure.persistent.po.sys;
    exports gitee.com.ericfox.ddd.infrastructure.service.repo;
    exports gitee.com.ericfox.ddd.infrastructure.service.repo.impl;
}