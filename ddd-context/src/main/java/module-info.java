module gitee.com.ericfox.ddd.context {
    requires lombok;
    requires gitee.com.ericfox.ddd.common;
    requires java.sql;
    requires spring.context;
    requires jakarta.annotation;

    exports gitee.com.ericfox.ddd.context.sys.model.sys_token;
    exports gitee.com.ericfox.ddd.context.sys.model.sys_user;
}