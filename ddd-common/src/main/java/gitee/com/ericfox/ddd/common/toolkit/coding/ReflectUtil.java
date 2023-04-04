package gitee.com.ericfox.ddd.common.toolkit.coding;

import lombok.SneakyThrows;

public class ReflectUtil extends cn.hutool.core.util.ReflectUtil {
    @SneakyThrows
    public static java.lang.reflect.Method getPublicMethod(Class<?> clazz, String methodName, Class<?>... paramTypes) throws SecurityException {
        return cn.hutool.core.util.ReflectUtil.getPublicMethod(clazz, methodName, paramTypes);
    }

    @SneakyThrows
    public static java.lang.reflect.Method getMethodByName(Class<?> clazz, String methodName) throws SecurityException {
        return cn.hutool.core.util.ReflectUtil.getMethodByName(clazz, methodName);
    }

    @SneakyThrows
    public static <T> T invokeStatic(java.lang.reflect.Method method, Object... args) throws cn.hutool.core.exceptions.UtilException {
        return cn.hutool.core.util.ReflectUtil.invokeStatic(method, args);
    }
}
