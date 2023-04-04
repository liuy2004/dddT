package gitee.com.ericfox.ddd.infrastructure.config;

import gitee.com.ericfox.ddd.common.properties.InfrastructureProperties;
import gitee.com.ericfox.ddd.common.toolkit.coding.FileUtil;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.ControlledRealTimeReopenThread;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.SearcherFactory;
import org.apache.lucene.search.SearcherManager;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Lucene持久化配置类
 */
@Configuration
@Slf4j
@ConditionalOnProperty(prefix = "custom.infrastructure.repo-strategy.lucene", value = {"enable"})
public class LuceneRepoConfig {
    @Resource
    private InfrastructureProperties infrastructureProperties;

    @Bean
    public Analyzer analyzer() {
//        FIXME 解决分词器问题
//        return new IKAnalyzer();
        return null;
    }

    @Bean
    @SneakyThrows
    public Directory directory() {
        String rootPath = infrastructureProperties.getRepoStrategy().getLucene().getRootPath();
        if (!FileUtil.isDirectory(rootPath)) {
            FileUtil.touch(rootPath);
        }
        Path path = Paths.get(rootPath);
        return FSDirectory.open(path);
    }

    @Bean
    @SneakyThrows
    public IndexWriter indexWriter() {
        IndexWriterConfig indexWriterConfig = new IndexWriterConfig();
        IndexWriter indexWriter = new IndexWriter(directory(), indexWriterConfig);
        if (infrastructureProperties.getRepoStrategy().getLucene().getClearWhenStart()) {
            indexWriter.deleteAll();
            indexWriter.commit();
        }
        return indexWriter;
    }

    @Bean
    @SneakyThrows
    public SearcherManager searcherManager(Directory directory, IndexWriter indexWriter) {
        SearcherManager searcherManager = new SearcherManager(indexWriter, false, false, new SearcherFactory());
        ControlledRealTimeReopenThread<IndexSearcher> controlledRealTimeReopenThread = new ControlledRealTimeReopenThread(indexWriter, searcherManager, 5.0, 0.025);
        controlledRealTimeReopenThread.setDaemon(true);
        controlledRealTimeReopenThread.setName("更新IndexReader线程");
        controlledRealTimeReopenThread.start();
        return searcherManager;
    }
}
