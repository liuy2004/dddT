package gitee.com.ericfox.ddd.common.interfaces.infrastructure;

import gitee.com.ericfox.ddd.common.interfaces.domain.BaseCondition;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.ReflectUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.StrUtil;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

public interface BasePo<PO extends BasePo<PO>> extends Serializable {
    Serializable getId();

    void setId(Serializable id);

    BaseCondition<?> get_condition();

    /**
     * 获取字段
     *
     * @param isUnderline 是否下划线分割
     */
    default List<String> fields(boolean isUnderline) {
        Field[] fields = ReflectUtil.getFields(this.getClass());
        List<String> list = CollUtil.newArrayList();
        Arrays.stream(fields).forEach(field ->
                list.add(isUnderline ? StrUtil.toUnderlineCase(field.getName()) : StrUtil.toCamelCase(field.getName()))
        );
        return list;
    }

    final class STRUCTURE {
        public static String domainName;
        public static String table;
        public static String id;
    }
}