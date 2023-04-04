package gitee.com.ericfox.ddd.infrastructure.service.repo.impl;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BaseDao;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;
import org.apache.lucene.analysis.Analyzer;
//import org.wltea.analyzer.lucene.IKAnalyzer;

/**
 * Lucene抽象Dao
 *
 * @param <PO> Po实体类
 */
public interface LuceneBaseDao<PO extends BasePo<PO>> extends BaseDao<PO> {
    /**
     * 获取该文档的分词器
     */
    default Analyzer analyzer() {
//        FIXME 解决分词器问题
//        return new IKAnalyzer(false);
        return null;
    }
}
