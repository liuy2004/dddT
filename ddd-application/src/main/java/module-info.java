module gitee.com.ericfox.ddd.application {
    requires spring.boot;
    requires lombok;
    requires gitee.com.ericfox.ddd.common;
    requires gitee.com.ericfox.ddd.infrastructure;
    requires gitee.com.ericfox.ddd.domain.sys;
    requires java.sql;
    requires spring.security.core;
    requires spring.boot.autoconfigure;

    opens gitee.com.ericfox.ddd.application;

    exports gitee.com.ericfox.ddd.application;
}