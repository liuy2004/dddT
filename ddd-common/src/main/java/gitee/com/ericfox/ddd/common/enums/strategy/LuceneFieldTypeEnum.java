package gitee.com.ericfox.ddd.common.enums.strategy;

import gitee.com.ericfox.ddd.common.enums.BaseEnum;
import lombok.Getter;

/**
 * lucene文档的数据类型枚举类
 */
@Getter
public enum LuceneFieldTypeEnum implements BaseEnum<LuceneFieldTypeEnum, Integer> {
    STRING_FIELD(1, "字符串，会被索引，不分词"),
    TEXT_FIELD(2, "文本，会被索引，分词"),
    INT_POINT(3, "整形，会被索引，分词"),
    LONG_POINT(4, "长整型，会被索引，分词"),
    DOUBLE_POINT(5, "浮点数，会被索引，分词"),
    BINARY_POINT(6, "二进制数据，不会索引，不分词");

    private final Integer code;
    private final String comment;

    LuceneFieldTypeEnum(Integer code, String comment) {
        this.code = code;
        this.comment = comment;
    }

    @Override
    public String getName() {
        return name();
    }

    @Override
    public LuceneFieldTypeEnum[] getEnums() {
        return values();
    }
}
