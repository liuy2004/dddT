package gitee.com.ericfox.ddd.common.annotations.dao;

import gitee.com.ericfox.ddd.common.enums.strategy.RepoTypeStrategyEnum;

import java.lang.annotation.*;

/**
 * 启用持久化（通常注解在Po实体类上）
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RepoEnabledAnnotation {
    /**
     * 数据主键
     */
    String value() default "id";

    RepoTypeStrategyEnum type() default RepoTypeStrategyEnum.R2DBC_MY_SQL_REPO_STRATEGY;
}
