package gitee.com.ericfox.ddd.common.annotations.ddd;

import org.springframework.stereotype.Service;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Documented
@Target(ElementType.TYPE)
@Service
public @interface DddService {
    String value() default "";

    /**
     * 是否启用缓存
     */
    boolean withCache() default true;
}
