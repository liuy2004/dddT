module gitee.com.ericfox.ddd.common {
    requires cn.hutool;
    requires lombok;
    requires spring.web;
    requires spring.core;
    requires java.scripting;
    requires java.sql;
    requires reactor.core;
    requires org.slf4j;
    requires spring.beans;
    requires spring.boot.autoconfigure;
    requires spring.context;
    requires spring.boot;

    exports gitee.com.ericfox.ddd.common.enums;
    exports gitee.com.ericfox.ddd.common.enums.contants;
    exports gitee.com.ericfox.ddd.common.enums.db;
    exports gitee.com.ericfox.ddd.common.enums.strategy;
    exports gitee.com.ericfox.ddd.common.interfaces.infrastructure;
    exports gitee.com.ericfox.ddd.common.toolkit.coding;
    exports gitee.com.ericfox.ddd.common.pattern.starter.sdk;
    exports gitee.com.ericfox.ddd.common.exceptions;
    exports gitee.com.ericfox.ddd.common.interfaces.starter.sdk;
    exports gitee.com.ericfox.ddd.common.interfaces.api;
    exports gitee.com.ericfox.ddd.common.interfaces.domain;
    exports gitee.com.ericfox.ddd.common.toolkit.trans;
    exports gitee.com.ericfox.ddd.common.properties;
    exports gitee.com.ericfox.ddd.common.model;
    exports gitee.com.ericfox.ddd.common.annotations.spring;
    exports gitee.com.ericfox.ddd.common.annotations.dao;
    exports gitee.com.ericfox.ddd.common.annotations.ddd;
}