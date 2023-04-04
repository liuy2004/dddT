//package gitee.com.ericfox.ddd.infrastructure.service.repo.impl;
//
//import cn.hutool.core.bean.copier.CopyOptions;
//import com.github.pagehelper.PageInfo;
//import gitee.com.ericfox.ddd.common.enums.strategy.RepoTypeStrategyEnum;
//import gitee.com.ericfox.ddd.common.interfaces.domain.BaseCondition;
//import gitee.com.ericfox.ddd.common.interfaces.domain.BaseEntity;
//import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BaseDao;
//import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
//import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
//import gitee.com.ericfox.ddd.common.toolkit.coding.*;
//import gitee.com.ericfox.ddd.common.toolkit.trans.SQL;
//import gitee.com.ericfox.ddd.infrastructure.general.toolkit.trans.ClassTransUtil;
//import gitee.com.ericfox.ddd.infrastructure.service.repo.RepoStrategy;
//import lombok.SneakyThrows;
//import org.springframework.stereotype.Component;
//
//import java.io.Serializable;
//import java.lang.reflect.Method;
//import java.util.List;
//import java.util.Map;
//import java.util.regex.Pattern;
//
///**
// * 实现mySql方式持久化
// */
//@Component
//@SuppressWarnings("unchecked")
//public class MySqlRepoStrategy implements RepoStrategy {
//    private static final CopyOptions updateCopyOptions = Constants.IGNORE_NULL_VALUE_COPY_OPTIONS;
//    private static final CopyOptions dbToJavaBeanCopyOptions = Constants.CAMEL_CASE_KEY_COPY_OPTIONS;
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findById(PO entity) {
//        PO t = entity;
//        JFinalBaseDao dao = getDao(t);
//        Model<?> result = dao.findById(t.getId());
//        if (result.toRecord() != null) {
//            BeanUtil.copyProperties(result.toRecord().getColumns(), t, false);
//            return entity.fromPo(t);
//        }
//        return null;
//    }
//
//    @Override
//    @SneakyThrows
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO findFirst(PO entity) {
//        PO t = entity;
//        JFinalBaseDao dao = getDao(t);
//
//        SQL whereSql = EasyQuery.parseWhereCondition(entity, true);
//        SqlPara sqlPara = new SqlPara();
//        String tableName = (String) t.getClass().getDeclaredClasses()[0].getField("table").get(null);
//        Model<?> result = dao.findFirst("SELECT " + CollUtil.join(t.fields(true), ",") + " FROM " + tableName + whereSql.toString() + " LIMIT 1 ");
//        if (result != null) {
//            BeanUtil.copyProperties(result.toRecord().getColumns(), t, false);
//            return entity.fromPo(t);
//        }
//        return null;
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, U extends BaseDao<PO>> boolean deleteById(PO entity) {
//        PO po = entity;
//        JFinalBaseDao dao = getDao(po);
//        return dao.deleteById(BeanUtil.getProperty(po, PO.STRUCTURE.id));
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(List<PO> entityList) {
//        if (CollUtil.isEmpty(entityList)) {
//            return true;
//        }
//        List<Serializable> idList = CollUtil.newArrayList();
//        JFinalBaseDao dao = getDao(entityList.get(0).toPo());
//        for (PO tmp : entityList) {
//            PO t = tmp;
//            Serializable id = BeanUtil.getProperty(t, PO.STRUCTURE.id);
//            idList.add(id);
//        }
//        dao.deleteByIds(idList);
//        return false;
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiDeleteById(PO... entities) {
//        if (ArrayUtil.isEmpty(entities)) {
//            return true;
//        }
//        return multiDeleteById(CollUtil.newArrayList(entities));
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PO insert(PO entity) {
//        PO po = entity;
//        JFinalBaseDao dao = getDao(po);
//        dao.put(BeanUtil.beanToMap(po, true, false));
//        dao.save();
//        return entity;
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(List<PO> entityList) {
//        if (CollUtil.isEmpty(entityList)) {
//            return true;
//        }
//        JFinalBaseDao dao = getDao(entityList.get(0).toPo());
//        return dao.multiInsert(entityList, entityList.size());
//    }
//
//    @SafeVarargs
//    @Override
//    public final <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean multiInsert(PO... entities) {
//        return multiInsert(CollUtil.newArrayList(entities));
//    }
//
//    @Override
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> boolean updateById(PO entity) {
//        PO po = entity;
//        JFinalBaseDao dao = getDao(po);
//        po = (PO) dao.findById(BeanUtil.getProperty(po, PO.STRUCTURE.id));
//        BeanUtil.copyProperties(po, dao, updateCopyOptions);
//        return dao.update();
//    }
//
//    @Override
//    @SneakyThrows
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> PageInfo<PO> queryPage(PO entity, int pageNum, int pageSize) {
//        PO t = entity;
//        SQL whereSql = EasyQuery.parseWhereCondition(entity, true);
//        SqlPara sqlPara = new SqlPara();
//        String tableName = (String) t.getClass().getDeclaredClasses()[0].getField("table").get(null);
//        sqlPara.setSql("SELECT " + CollUtil.join(t.fields(true), ",") + " FROM " + tableName + whereSql.toString());
//        for (Object value : whereSql.getParamList()) {
//            sqlPara.addPara(value);
//        }
//        Page<Record> paginate = Db.paginate(pageNum, pageSize, sqlPara);
//        List<PO> result = CollUtil.newArrayList();
//        if (paginate.getList() != null) {
//            for (Record tmp : paginate.getList()) {
//                PO tmpPo = ReflectUtil.newInstance((Class<PO>) t.getClass());
//                BeanUtil.copyProperties(tmp.getColumns(), tmpPo, dbToJavaBeanCopyOptions);
//                PO vInstance = (PO) ReflectUtil.newInstance(entity.getClass());
//                result.add(vInstance.fromPo(tmpPo));
//            }
//        }
//        PageInfo<PO> pageInfo = new PageInfo<>();
//        pageInfo.setPageNum(paginate.getPageNumber());
//        pageInfo.setPageSize(paginate.getPageSize());
//        pageInfo.setTotal(paginate.getTotalRow());
//        pageInfo.setList(result);
//        return pageInfo;
//    }
//
//    @Override
//    @SneakyThrows
//    public <PO extends BasePo<PO>, DAO extends BaseDao<PO>> List<PO> queryList(PO entity, int limit) {
//        PO po = entity;
//        SQL whereSql = EasyQuery.parseWhereCondition(entity, true);
//        SqlPara sqlPara = new SqlPara();
//        String tableName = (String) po.getClass().getDeclaredClasses()[0].getField("table").get(null);
//        sqlPara.setSql("SELECT " + CollUtil.join(po.fields(true), ",") + " FROM " + tableName + whereSql.toString());
//        for (Object value : whereSql.getParamList()) {
//            sqlPara.addPara(value);
//        }
//        if (limit >= 0) {
//            sqlPara.setSql(sqlPara.getSql() + " LIMIT " + limit);
//        }
//        List<Record> list = Db.find(sqlPara);
//        List<PO> result = CollUtil.newArrayList();
//        if (list != null) {
//            for (Record tmp : list) {
//                PO tmpPo = ReflectUtil.newInstance((Class<PO>) po.getClass());
//                BeanUtil.copyProperties(tmp.getColumns(), tmpPo, dbToJavaBeanCopyOptions);
//                PO vInstance = (PO) ReflectUtil.newInstance(entity.getClass());
//                result.add(vInstance.fromPo(tmpPo));
//            }
//        }
//        return result;
//    }
//
//    @SneakyThrows
//    private <PO extends BasePo<PO>, DAO extends JFinalBaseDao<PO, DAO>> JFinalBaseDao<PO, DAO> getDao(PO po) {
//        Method toPoMethod = ClassUtil.getPublicMethod(po.getClass(), JFinalBaseDao.TO_PO_METHOD_NAME, (Class<?>) null);
//        if (toPoMethod != null) {
//            po = ReflectUtil.invoke(po, toPoMethod, (Object) null);
//        }
//        Class<DAO> daoClass = ClassTransUtil.getDaoClassByPo(po, RepoTypeStrategyEnum.MY_SQL_REPO_STRATEGY);
//        return ReflectUtil.newInstance(daoClass);
//    }
//
//
//    private static class EasyQuery {
//        public static <PO extends BasePo<PO>, DAO extends JFinalBaseDao<PO, DAO>> SQL parseWhereCondition(PO entity, boolean matchAllIfEmpty) {
//            SQL sql = SQL.getInstance().where();
//            BaseCondition<?> condition = entity.get_condition();
//            if (condition == null) {
//                return matchAllIfEmpty ? sql.matchAll() : sql.matchNothing();
//            }
//            Map<String, Object> conditionMap = condition.getConditionMap();
//            if (CollUtil.isEmpty(conditionMap) && !matchAllIfEmpty) {
//                sql.matchNothing();
//            } else {
//                sql.matchAll();
//            }
//            return parseWhereCondition(conditionMap, sql);
//        }
//
//        private static <PO extends BasePo<PO>, DAO extends JFinalBaseDao<PO, DAO>> SQL parseWhereCondition(Map<String, Object> conditionMap, SQL sql) {
//            conditionMap.keySet().forEach(key -> {
//                String fieldName = BaseCondition.getFieldByConditionKey(key);
//                String type = BaseCondition.getTypeByConditionKey(key);
//                Object value = conditionMap.get(key);
//                if (StrUtil.equals(type, BaseCondition.MATCH_ALL)) {
//                    sql.and().matchAll();
//                } else if (StrUtil.equals(type, BaseCondition.MATCH_NOTHING)) {
//                    sql.and().matchNothing();
//                } else if (StrUtil.equals(type, BaseCondition.OR)) {
//                    sql.or(parseWhereCondition(((BaseCondition<?>) conditionMap.get(key)).getConditionMap(), sql));
//                } else if (StrUtil.equals(type, BaseCondition.AND)) {
//                    sql.and(parseWhereCondition(((BaseCondition<?>) conditionMap.get(key)).getConditionMap(), sql));
//                } else if (StrUtil.equals(type, BaseCondition.EQUALS)) {
//                    sql.and().equal(fieldName, value);
//                } else if (StrUtil.equals(type, BaseCondition.NOT_EQUALS)) {
//                    sql.and().notEqual();
//                } else if (StrUtil.equals(type, BaseCondition.IS_NULL)) {
//                    sql.and().isNull(fieldName);
//                } else if (StrUtil.equals(type, BaseCondition.IS_NOT_NULL)) {
//                    sql.and().isNotNull(fieldName);
//                } else if (StrUtil.equals(type, BaseCondition.REGEX)) {
//                    sql.and().regexp(((Pattern) value).pattern());
//                } else if (StrUtil.equals(type, BaseCondition.GREAT_THAN)) {
//                    sql.and().greatThan(fieldName, value);
//                } else if (StrUtil.equals(type, BaseCondition.GREAT_THAN_OR_EQUALS)) {
//                    sql.and().greatThanEqual(fieldName, value);
//                } else if (StrUtil.equals(type, BaseCondition.LESS_THAN)) {
//                    sql.and().lessThan(fieldName, value);
//                } else if (StrUtil.equals(type, BaseCondition.LESS_THAN_OR_EQUALS)) {
//                    sql.and().lessThanEqual(fieldName, value);
//                } else if (StrUtil.equals(type, BaseCondition.BETWEEN)) {
//                    List<?> list = (List<?>) value;
//                    Object v1 = list.get(0);
//                    Object v2 = list.get(1);
//                    sql.and().between(fieldName, v1, v2);
//                } else if (StrUtil.equals(type, BaseCondition.LIKE)) {
//                    sql.and().likePrefix(fieldName, (String) value);
//                } else if (StrUtil.equals(type, BaseCondition.NOT_LIKE)) {
//                    sql.and().notLikePrefix(fieldName, (String) value);
//                } else if (StrUtil.equals(type, BaseCondition.IN)) {
//                    sql.and().in(fieldName, (List<?>) value);
//                } else if (StrUtil.equals(type, BaseCondition.REGEX)) {
//                    Pattern pattern = (Pattern) value;
//                    sql.and().regexp(pattern.pattern());
//                }
//            });
//            return sql;
//        }
//    }
//}
