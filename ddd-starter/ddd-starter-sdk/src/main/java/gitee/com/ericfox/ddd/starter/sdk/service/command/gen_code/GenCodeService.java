package gitee.com.ericfox.ddd.starter.sdk.service.command.gen_code;

import cn.hutool.core.date.DateUtil;
import cn.hutool.extra.template.Template;
import cn.hutool.extra.template.TemplateEngine;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.properties.CustomProperties;
import gitee.com.ericfox.ddd.common.toolkit.coding.BeanUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.FileUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.MapUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.StrUtil;
import gitee.com.ericfox.ddd.starter.sdk.interfaces.SdkMessageBus;
import gitee.com.ericfox.ddd.starter.sdk.pojo.TableXmlBean;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.StringWriter;
import java.util.Map;

@Slf4j
@Service
public class GenCodeService implements SdkMessageBus {
    @Resource
    private CustomProperties customProperties;
    @Resource
    private TemplateEngine velocityEngine;
    private static final StrUtil strUtil = new StrUtil();
    private static final DateUtil dateUtil = new DateUtil();

    /**
     * 获取模板原文
     */
    @SneakyThrows
    public String getTemplateCodeWithOutRendering(String path) {
        File file = new ClassPathResource(path).getFile();
        return FileUtil.readUtf8String(file);
    }

    /**
     * 创建代码
     */
    private String getCodeByTableXmlBean(TableXmlBean tableXml, Map<String, Object> context, String path) {
        context.put("strUtil", strUtil);
        context.put("dateUtil", dateUtil);
        context.put("rootPackage", customProperties.getRootPackage());
        Map<String, Object> metaMap = tableXml.getMeta().toMap();
        context.put("meta", metaMap);
        Map<String, Object> dataMap = BeanUtil.beanToMap(tableXml.getData());
        context.put("data", dataMap);
        String result = null;
        try {
            Template template = velocityEngine.getTemplate(path);
            if (template == null) {
                String eMsg = "genCodeService::getCodeByTableXmlBean velocity模板初始化失败: " + path;
                logError(log, eMsg);
                throw new FrameworkApiException(eMsg, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            StringWriter sw = new StringWriter();
            template.render(context, sw);
            result = sw.toString();
        } catch (Exception e) {
            logError(log, "genCodeService::getCodeByTableXmlBean 加载模板异常");
        }
        logDebug(log, "生成代码：" + System.lineSeparator() + result);
        return result;
    }

    /**
     * po代码
     */
    public String getPoCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/po/Po.java.vm");
    }

    /**
     * dao代码
     */
    public String getDaoCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/dao/" + StrUtil.toUnderlineCase(tableXml.getMeta().getRepoTypeStrategyEnum().getCode()) + "/Dao.java.vm");
    }

    public String getEntityCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/entity/Entity.java.vm");
    }

    public String getEntityBaseCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/entity/EntityBase.java.vm");
    }

    public String getContextCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/context/Context.java.vm");
    }

    public String getServiceCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/service/Service.java.vm");
    }

    public String getServiceBaseCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/service/ServiceBase.java.vm");
    }

    public String getDtoCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/dto/Dto.java.vm");
    }

    public String getDtoBaseCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/dto/DtoBase.java.vm");
    }

    public String getPageParamCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/param/PageParam.java.vm");
    }

    public String getDetailParamCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/param/DetailParam.java.vm");
    }

    public String getControllerCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/controller/Controller.java.vm");
    }

    public String getControllerBaseCode(TableXmlBean tableXml) {
        Map<String, Object> context = MapUtil.newHashMap();
        return getCodeByTableXmlBean(tableXml, context, "gen/velocity_home/controller/ControllerBase.java.vm");
    }
}
