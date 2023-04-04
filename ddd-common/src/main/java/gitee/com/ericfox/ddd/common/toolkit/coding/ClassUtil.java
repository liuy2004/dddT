package gitee.com.ericfox.ddd.common.toolkit.coding;

public class ClassUtil extends cn.hutool.core.util.ClassUtil {
    public static java.util.Set<Class<?>> scanPackage(String packageName) {
        return cn.hutool.core.util.ClassUtil.scanPackage(packageName);
    }

    public static <T> Class<T> getClass(T obj) {
        return cn.hutool.core.util.ClassUtil.getClass(obj);
    }

    public static java.lang.reflect.Method getPublicMethod(Class<?> clazz, String methodName, Class<?>... paramTypes) throws SecurityException {
        return cn.hutool.core.util.ClassUtil.getPublicMethod(clazz, methodName, paramTypes);
    }
}
