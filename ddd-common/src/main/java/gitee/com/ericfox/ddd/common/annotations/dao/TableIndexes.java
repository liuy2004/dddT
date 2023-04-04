package gitee.com.ericfox.ddd.common.annotations.dao;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TableIndexes {
    TableIndex[] value();
}
