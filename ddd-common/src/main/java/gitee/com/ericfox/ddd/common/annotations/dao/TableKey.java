package gitee.com.ericfox.ddd.common.annotations.dao;

import gitee.com.ericfox.ddd.common.enums.db.MySqlTableKeyEnum;

public @interface TableKey {
    String[] value();

    MySqlTableKeyEnum type() default MySqlTableKeyEnum.PRIMARY_KEY;
}
