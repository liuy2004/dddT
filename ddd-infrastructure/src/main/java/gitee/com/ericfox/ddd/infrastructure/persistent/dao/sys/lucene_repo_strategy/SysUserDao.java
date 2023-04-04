//package gitee.com.ericfox.ddd.infrastructure.persistent.dao.sys.lucene_repo_strategy;
//
//import gitee.com.ericfox.ddd.common.enums.strategy.LuceneFieldTypeEnum;
//import gitee.com.ericfox.ddd.infrastructure.general.common.annotations.service.LuceneFieldKey;
//import gitee.com.ericfox.ddd.infrastructure.persistent.po.sys.SysUser;
//import gitee.com.ericfox.ddd.infrastructure.service.repo.impl.LuceneBaseDao;
//import lombok.Getter;
//import lombok.Setter;
//
//@Setter
//@Getter
//public class SysUserDao extends SysUser implements LuceneBaseDao<SysUser> {
//    @LuceneFieldKey(type = LuceneFieldTypeEnum.LONG_POINT, needSort = true)
//    private Long id;
//    @LuceneFieldKey(type = LuceneFieldTypeEnum.STRING_FIELD, needSort = true)
//    private String username;
//
//    @Override
//    public Class<SysUser> poClass() {
//        return SysUser.class;
//    }
//}
