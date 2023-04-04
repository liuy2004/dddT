module gitee.com.ericfox.ddd.api {
    requires gitee.com.ericfox.ddd.common;
    requires gitee.com.ericfox.ddd.context;
    requires spring.web;
    requires spring.messaging;
    requires reactor.core;
    requires lombok;
    requires jakarta.annotation;
    requires spring.context;
    requires org.reactivestreams;
    requires org.slf4j;
    requires rsocket.transport.netty;
    requires rsocket.core;
    requires spring.boot;
    requires spring.boot.autoconfigure;

    opens gitee.com.ericfox.ddd.api;
    opens gitee.com.ericfox.ddd.api.config;
    opens gitee.com.ericfox.ddd.api.controller.framework.base;
    opens gitee.com.ericfox.ddd.api.controller.framework;
    opens gitee.com.ericfox.ddd.api.controller.starter.sdk;
}