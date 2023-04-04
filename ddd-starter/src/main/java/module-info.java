module gitee.com.ericfox.ddd.starter {
    requires gitee.com.ericfox.ddd.starter.sdk;
    requires lombok;
    requires spring.boot;
    requires org.slf4j;
    requires spring.beans;
    requires spring.context;

    exports gitee.com.ericfox.ddd.starter;
    exports gitee.com.ericfox.ddd.starter.config;
}