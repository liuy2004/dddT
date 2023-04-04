package gitee.com.ericfox.ddd.starter.cache.service;

import gitee.com.ericfox.ddd.common.interfaces.starter.cache.CacheService;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.starter.cache.config.RedisCacheConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.StringJoiner;

/**
 * Redis缓存策略实现
 */
@Component
@Slf4j
@ConditionalOnBean(value = RedisCacheConfig.class)
public class RedisCacheStrategy implements CacheService {
    @Resource
    RedisTemplate redisTemplate;

    @Override
    public void put(Object key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public Object get(Object key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public Boolean remove(Object key) {
        return redisTemplate.delete(key);
    }

    /**
     * 通过lua实现，删除指定前缀的缓存（原子性操作）
     */
    @Override
    public Long removeByPrefix(String prefix) {
        //String UUID = IdUtil.fastUUID();
        // 扫描指定前缀的key并删除
        StringJoiner luaFunJoiner = new StringJoiner(System.lineSeparator());
        luaFunJoiner.add("redis.replicate_commands()");
        luaFunJoiner.add("local cursor = 0");
        luaFunJoiner.add("local keyNum = 0  ");
        luaFunJoiner.add("repeat");
        luaFunJoiner.add("   local res = redis.call('scan',cursor,'match',KEYS[1],'count',ARGV[1])");
        luaFunJoiner.add("   if(res ~= nil and #res>=0) ");
        luaFunJoiner.add("   then");
        luaFunJoiner.add("      cursor = tonumber(res[1])");
        luaFunJoiner.add("      local ks = res[2]");
        luaFunJoiner.add("      if(ks ~= nil and #ks>0) ");
        luaFunJoiner.add("      then");
        luaFunJoiner.add("         for i=1,#ks,1 do");
        luaFunJoiner.add("            local key = tostring(ks[i])");
        luaFunJoiner.add("            redis.call('del',key)");
        luaFunJoiner.add("         end");
        luaFunJoiner.add("         keyNum = keyNum + #ks");
        luaFunJoiner.add("      end");
        luaFunJoiner.add("     end");
        luaFunJoiner.add("until( cursor <= 0 )");
        luaFunJoiner.add("return keyNum;");
        // luaFun = "scan match '" + prefix + "' count 2000";
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>(luaFunJoiner.toString(), Long.class);
        try {
            return (Long) redisTemplate.execute(redisScript, CollUtil.newArrayList(prefix), 100);
        } catch (Exception e) {
            log.error("redisCacheStrategy::flushByPrefix 清除指定前缀缓存出错", e);
        }
        return 0L;
    }

    @Override
    public Long removeByPrefix(String module, String prefix) {
        return removeByPrefix(module + ":" + prefix);
    }
}
