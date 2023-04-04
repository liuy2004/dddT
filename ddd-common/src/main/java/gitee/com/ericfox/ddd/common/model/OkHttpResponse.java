package gitee.com.ericfox.ddd.common.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class OkHttpResponse {

    private int status;
    private String response;
}
