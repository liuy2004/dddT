package gitee.com.ericfox.ddd.common.toolkit.coding;

import java.util.ArrayList;
import java.util.Map;

public class CollUtil extends cn.hutool.core.collection.CollUtil {
    /**
     * 计算两个集合的交集有多少
     */
    public static <K, V> int containsKeyCount(Map<K, V> map, ArrayList<K> list) {
        int count = 0;
        if (isEmpty(map) || isEmpty(list)) {
            return count;
        }
        for (K k : list) {
            if (map.containsKey(k)) {
                count++;
            }
        }
        return count;
    }
}
