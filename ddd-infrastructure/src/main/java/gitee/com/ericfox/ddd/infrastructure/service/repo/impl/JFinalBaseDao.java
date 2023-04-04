//package gitee.com.ericfox.ddd.infrastructure.service.repo.impl;
//
////import com.jfinal.plugin.activerecord.Db;
////import com.jfinal.plugin.activerecord.Model;
//
//import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BaseDao;
//import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
//import gitee.com.ericfox.ddd.common.toolkit.coding.ArrayUtil;
//import lombok.extern.slf4j.Slf4j;
//
//import java.util.List;
//
///**
// * JFinal抽象Dao
// *
// * @param <PO>  Po实体类
// * @param <DAO> Dao实体类
// */
//@Slf4j
//public abstract class JFinalBaseDao<PO extends BasePo<PO>, DAO extends JFinalBaseDao<PO, DAO>> extends Model<DAO> implements BaseDao<PO> {
//    public static final String DAO_FIELD_NAME = "dao";
//
//    public boolean multiInsert(List<DAO> daoList, int batchSize) {
//        try {
////            FIXME 解决依赖问题
////            int[] ints = Db.batchSave(daoList, batchSize);
//            int[] ints = new int[]{1};
//            return ArrayUtil.isNotEmpty(ints);
//        } catch (Exception e) {
//            log.error("jFinalBaseDao::multiInsert jFinal批量入库失败");
//        }
//        return false;
//    }
//}
