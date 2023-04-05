module gitee.com.ericfox.ddd.context {
    requires lombok;
    requires gitee.com.ericfox.ddd.common;
    requires java.sql;
    requires spring.context;
    requires jakarta.annotation;
    requires org.mapstruct;

    exports gitee.com.ericfox.ddd.context.sys.model.sys_token;
    exports gitee.com.ericfox.ddd.context.sys.model.sys_user;
    exports gitee.com.ericfox.ddd.context.sys.converter;
}