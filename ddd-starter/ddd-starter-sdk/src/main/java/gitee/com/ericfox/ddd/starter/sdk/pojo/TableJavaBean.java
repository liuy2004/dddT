package gitee.com.ericfox.ddd.starter.sdk.pojo;

import cn.hutool.core.bean.BeanDesc;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
import gitee.com.ericfox.ddd.common.toolkit.coding.BeanUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.ClassUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;

import java.lang.reflect.Field;
import java.util.List;

@Getter
@Setter
public class TableJavaBean<PO extends BasePo<PO>> {
    private Class<PO> clazz;
    private final List<Field> fieldList = CollUtil.newArrayList();
    private final StructureBean structure = new StructureBean();

    @SneakyThrows
    public TableJavaBean(Class<PO> clazz) {
        this.clazz = clazz;
        BeanDesc beanDesc = BeanUtil.getBeanDesc(clazz);
        beanDesc.getProps().forEach(propDesc -> {
            fieldList.add(propDesc.getField());
        });
        Class<Object> innerClass = ClassUtil.loadClass(clazz.getName() + "$STRUCTURE");
        structure.domainName = (String) innerClass.getDeclaredField("domainName").get(null);
        structure.tableName = (String) innerClass.getDeclaredField("table").get(null);
        structure.id = (String) innerClass.getDeclaredField("id").get(null);
    }

    @Getter
    @Setter
    public static class StructureBean {
        private String domainName;
        private String tableName;
        private String id;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof TableJavaBean) {
            TableJavaBean o1 = (TableJavaBean) o;
            return this.getStructure().getTableName().equals(o1.getStructure().getTableName())
                    && this.getStructure().getDomainName().equals(o1.getStructure().getDomainName());
        }
        return false;
    }
}
