package gitee.com.ericfox.ddd.infrastructure.service.repo;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BaseDao;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
import org.springframework.lang.NonNull;

import java.util.List;

/**
 * 持久化策略接口
 */
public interface RepoStrategy {
    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findById(PO entity);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findFirst(PO entity);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean deleteById(PO entity);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(List<PO> entity);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(PO... entities);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO insert(PO entity);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(List<PO> entityList);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(PO... entities);

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean updateById(PO entity);

//    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PageInfo<PO> queryPage(PO entity, int pageNum, int pageSize);

    @NonNull
    default <PO extends BasePo<PO>, DAO extends BaseDao<PO>> List<PO> queryList(PO entity) {
        return queryList(entity, -1);
    }

    <PO extends BasePo<PO>, DAO extends BaseDao<PO>> List<PO> queryList(PO entity, int limit);
}
