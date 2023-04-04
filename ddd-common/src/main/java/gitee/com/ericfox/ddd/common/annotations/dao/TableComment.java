package gitee.com.ericfox.ddd.common.annotations.dao;

import java.lang.annotation.*;

/**
 * 字段长度
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TableComment {
    String value() default "";
}
