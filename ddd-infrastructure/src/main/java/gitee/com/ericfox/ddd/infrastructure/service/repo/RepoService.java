package gitee.com.ericfox.ddd.infrastructure.service.repo;

import gitee.com.ericfox.ddd.common.annotations.dao.RepoEnabledAnnotation;
import gitee.com.ericfox.ddd.common.enums.strategy.RepoTypeStrategyEnum;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BaseDao;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
import gitee.com.ericfox.ddd.common.properties.InfrastructureProperties;
import gitee.com.ericfox.ddd.common.toolkit.coding.ArrayUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.IdUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 持久化service
 */
@Slf4j
@Service
@SuppressWarnings("unchecked")
public class RepoService implements RepoStrategy {
    @Resource
    private InfrastructureProperties infrastructureProperties;

    private RepoTypeStrategyEnum repoStrategy;
    private final Map<String, RepoStrategy> strategyMap = new ConcurrentHashMap<>();

    @Autowired
    public RepoService(Map<String, RepoStrategy> strategyMap) {
        this.strategyMap.putAll(strategyMap);
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findById(PO entity) {
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).findById(entity);
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findFirst(PO entity) {
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).findFirst(entity);
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean deleteById(PO entity) {
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).deleteById(entity);
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(List<PO> entityList) {
        if (CollUtil.isNotEmpty(entityList)) {
            String beanName = getBeanName(entityList.get(0));
            return strategyMap.get(beanName).multiDeleteById(entityList);
        }
        return true;
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(PO... entities) {
        if (ArrayUtil.isNotEmpty(entities)) {
            String beanName = getBeanName(entities[0]);
            return strategyMap.get(beanName).multiDeleteById(entities);
        }
        return true;
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO insert(PO entity) {
        if (entity.getId() == null) {
            entity.setId(IdUtil.getSnowflakeNextId());
        }
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).insert(entity);
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(List<PO> entityList) {
        if (CollUtil.isNotEmpty(entityList)) {
            for (PO entity : entityList) {
                if (entity.getId() == null) {
                    entity.setId(IdUtil.getSnowflakeNextId());
                }
            }
            String beanName = getBeanName(entityList.get(0));
            return strategyMap.get(beanName).multiInsert(entityList);
        }
        return true;
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(PO... entities) {
        if (ArrayUtil.isNotEmpty(entities)) {
            String beanName = getBeanName(entities[0]);
            return strategyMap.get(beanName).multiInsert(entities);
        }
        return true;
    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean updateById(PO entity) {
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).updateById(entity);
    }

//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PageInfo<PO> queryPage(PO entity, int pageNum, int pageSize) {
//        String beanName = getBeanName(entity);
//        return strategyMap.get(beanName).queryPage(entity, pageNum, pageSize);
//    }

    @Override
    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> List<PO> queryList(PO entity, int limit) {
        String beanName = getBeanName(entity);
        return strategyMap.get(beanName).queryList(entity, limit);
    }

    private <PO extends BasePo<PO>, DAO extends BaseDao<PO>> String getBeanName(PO entity) {
        RepoEnabledAnnotation declaredAnnotation = entity.getClass().getDeclaredAnnotation(RepoEnabledAnnotation.class);
        if (declaredAnnotation == null) {
            if (repoStrategy == null) {
                repoStrategy = infrastructureProperties.getRepoStrategy().getDefaultStrategy().toBizEnum();
            }
            return repoStrategy.getCode();
        } else {
            return declaredAnnotation.type().getCode();
        }
    }
}
