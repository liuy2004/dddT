package gitee.com.ericfox.ddd.common.annotations.ddd;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Documented
@Target(ElementType.TYPE)
public @interface DddController {
    String value();
}
