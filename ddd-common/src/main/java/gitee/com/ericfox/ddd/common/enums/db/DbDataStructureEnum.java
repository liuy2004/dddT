package gitee.com.ericfox.ddd.common.enums.db;

import gitee.com.ericfox.ddd.common.enums.BaseEnum;
import lombok.Getter;

/**
 * 数据类型枚举类
 */
@Getter
public enum DbDataStructureEnum implements BaseEnum<DbDataStructureEnum, String> {
    HASH_MAP("hashMap", "哈希MAP"),
    B_TREE("bTree", "B树");

    private final String code;
    private final String comment;

    DbDataStructureEnum(String code, String comment) {
        this.code = code;
        this.comment = comment;
    }

    @Override
    public String getName() {
        return name();
    }

    @Override
    public DbDataStructureEnum[] getEnums() {
        return values();
    }
}
