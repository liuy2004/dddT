package gitee.com.ericfox.ddd.starter.sdk.service.gen_code;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
import gitee.com.ericfox.ddd.common.properties.CustomProperties;
import gitee.com.ericfox.ddd.common.toolkit.coding.*;
import gitee.com.ericfox.ddd.starter.sdk.interfaces.SdkConstants;
import gitee.com.ericfox.ddd.starter.sdk.interfaces.SdkMessageBus;
import gitee.com.ericfox.ddd.starter.sdk.pojo.TableMySqlBean;
import gitee.com.ericfox.ddd.starter.sdk.pojo.TableXmlBean;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@Service
@Slf4j
public class GenTableWritingService implements SdkMessageBus {
    @Resource
    private CustomProperties customProperties;
    @Resource
    private GenCodeService genCodeService;

    /**
     * 写入Po代码
     */
    public void writePoCode(TableXmlBean tableXml) {
        String poCode = genCodeService.getPoCode(tableXml);
        String filePath = getInfrastructurePath() + "/persistent/po/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().toMap().get("ClassName") + ".java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, poCode);
    }

    /**
     * 写入Dao代码
     */
    public void writeDaoCode(TableXmlBean tableXml) {
        String daoCode = genCodeService.getDaoCode(tableXml);
        String repoType = StrUtil.toUnderlineCase(tableXml.getMeta().getRepoTypeStrategyEnum().getCode());
        String filePath = getInfrastructurePath() + "/persistent/dao/" + tableXml.getMeta().getDomainName() + "/" + repoType + "/" + tableXml.getMeta().toMap().get("ClassName") + "Dao.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, daoCode);
    }

    /**
     * 写入Entity代码
     */
    public void writeEntityCode(TableXmlBean tableXml) {
        String entityCode = genCodeService.getEntityCode(tableXml);
        String filePath = getDomainPath(tableXml) + "/model/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "Entity.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, entityCode);
    }

    /**
     * 写入EntityBase代码
     */
    public void writeEntityBaseCode(TableXmlBean tableXml) {
        String entityBaseCode = genCodeService.getEntityBaseCode(tableXml);
        String filePath = getDomainPath(tableXml) + "/model/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "EntityBase.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, entityBaseCode);
    }

    /**
     * 写入Context代码
     */
    public void writeContextCode(TableXmlBean tableXml) {
        String entityBaseCode = genCodeService.getContextCode(tableXml);
        String filePath = getDomainPath(tableXml) + "/model/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "Context.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, entityBaseCode);
    }

    /**
     * 写入Service代码
     */
    public void writeServiceCode(TableXmlBean tableXml) {
        String serviceCode = genCodeService.getServiceCode(tableXml);
        String filePath = getDomainPath(tableXml) + "/model/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "Service.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, serviceCode);
    }

    /**
     * 写入ServiceBase代码
     */
    public void writeServiceBaseCode(TableXmlBean tableXml) {
        String serviceBaseCode = genCodeService.getServiceBaseCode(tableXml);
        String filePath = getDomainPath(tableXml) + "/model/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "ServiceBase.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, serviceBaseCode);
    }

    /**
     * 写入Dto代码
     */
    public void writeDtoCode(TableXmlBean tableXml) {
        String dtoCode = genCodeService.getDtoCode(tableXml);
        String filePath = getApiPath() + "/model/dto/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "Dto.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, dtoCode);
    }

    /**
     * 写入DtoBase代码
     */
    public void writeDtoBaseCode(TableXmlBean tableXml) {
        String dtoBaseCode = genCodeService.getDtoBaseCode(tableXml);
        String filePath = getApiPath() + "/model/dto/" + tableXml.getMeta().getDomainName() + "/base/" + tableXml.getMeta().toMap().get("ClassName") + "DtoBase.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, dtoBaseCode);
    }

    public void writePageParamCode(TableXmlBean tableXml) {
        String pageParamCode = genCodeService.getPageParamCode(tableXml);
        String filePath = getApiPath() + "/model/param/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "PageParam.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, pageParamCode);
    }

    public void writeDetailParamCode(TableXmlBean tableXml) {
        String detailParamCode = genCodeService.getDetailParamCode(tableXml);
        String filePath = getApiPath() + "/model/param/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().getTableName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "DetailParam.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, detailParamCode);
    }

    public void writeControllerCode(TableXmlBean tableXml) {
        String controllerCode = genCodeService.getControllerCode(tableXml);
        String filePath = getApiPath() + "/controller/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().toMap().get("ClassName") + "Controller.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, controllerCode);
    }

    public void writeControllerBaseCode(TableXmlBean tableXml) {
        String controllerBaseCode = genCodeService.getControllerBaseCode(tableXml);
        String filePath = getApiPath() + "/controller/" + tableXml.getMeta().getDomainName() + "/base/" + tableXml.getMeta().toMap().get("ClassName") + "ControllerBase.java";
        File file = FileUtil.file(filePath);
        FileUtil.touch(file);
        IoUtil.writeUtf8(FileUtil.getOutputStream(file), true, controllerBaseCode);
    }

    /**
     * 序列化
     */
    @SneakyThrows
    public void writeTableXml(TableXmlBean tableXml) {
        //运行时环境
        String targetPath = URLUtil.getURL(SdkConstants.META_HOME_PATH).getFile();
        //coding环境
        String sourcePath = ReUtil.replaceAll(targetPath, "/target/classes", "/src/main/resources");
        File file = FileUtil.touch(sourcePath + "/" + tableXml.getMeta().getDomainName() + "/" + tableXml.getMeta().getTableName() + ".xml");
        FileUtil.touch(file);
        XmlUtil.writeObjectAsXml(file, tableXml);
    }

    /**
     * 把xml发布到target运行时环境
     */
    public void publishTablesToRuntime() {
        logInfo(log, "genTableWritingService::publishTablesToRuntime 开始发布xml表结构...");
        String targetPath = URLUtil.getURL(SdkConstants.META_HOME_PATH).getFile();
        //   /E:/idea_projects/ddd/ddd-domain-gen/target/classes/gen/meta_home
        String sourcePath = ReUtil.replaceAll(targetPath, "/target/classes", "/src/main/resources");
        //   /E:/idea_projects/ddd/ddd-domain-gen/src/main/resources/gen/meta_home
        targetPath = StrUtil.replace(targetPath, SdkConstants.META_HOME_PATH, "gen");
        FileUtil.copy(sourcePath, targetPath, true);
        logInfo(log, "genTableWritingService::publishTablesToRuntime 发布xml表结构完成");
    }

    /**
     * 根据表结构导出SQL内容
     */
    public StringBuilder exportSqlByXml(List<TableXmlBean> list) {
        StringBuilder sb = new StringBuilder();
        if (CollUtil.isEmpty(list)) {
            return sb;
        }
        list.forEach(tableXmlBean -> {
            TableMySqlBean tableMySqlBean = TableMySqlBean.load(tableXmlBean);
            sb.append(tableMySqlBean.toSqlString(true));
        });
        return sb;
    }

    /**
     * 基础设施层真实路径
     */
    public String getInfrastructurePath() {
        String infrastructurePath = Constants.PROJECT_ROOT_PATH;
        infrastructurePath += "/" + customProperties.getProjectName() + "-infrastructure/src/main/java/" + customProperties.getRootPackage().replaceAll("[.]", "/") + "/infrastructure";
        return infrastructurePath;
    }

    /**
     * 领域层真实路径
     */
    public String getDomainPath(TableXmlBean tableXml) {
        String domainPath = Constants.PROJECT_ROOT_PATH;
        domainPath += "/" + customProperties.getProjectName() + "-domain-" + tableXml.getMeta().getDomainName() + "/src/main/java/" + customProperties.getRootPackage().replaceAll("[.]", "/") + "/domain/" + tableXml.getMeta().getDomainName();
        return domainPath;
    }

    /**
     * 接口层真实路径
     */
    public String getApiPath() {
        String apiPath = Constants.PROJECT_ROOT_PATH;
        apiPath += "/" + customProperties.getProjectName() + "-api/src/main/java/" + customProperties.getRootPackage().replaceAll("[.]", "/") + "/api";
        return apiPath;
    }
}
