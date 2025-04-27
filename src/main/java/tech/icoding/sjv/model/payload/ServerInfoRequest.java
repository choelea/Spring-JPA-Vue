package tech.icoding.sjv.model.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;
import tech.icoding.sjv.validation.annotation.NullOrNotBlank;

@Data
@Schema(description = "Server Info Create/Update Request")
public class ServerInfoRequest {

    @Schema(description = "服务器别名", example = "上海机房服务器")
    @NullOrNotBlank(message = "Alias can be null but not blank")
    private String alias;

    @Schema(description = "服务器地址", example = "192.168.1.100")
    @NullOrNotBlank(message = "Address can be null but not blank")
    private String address;

    @Schema(description = "端口号", example = "1433")
    @NotNull(message = "Port cannot be null")
    private Integer port;

    @Schema(description = "登录用户名", example = "sa")
    private String username;

    @Schema(description = "登录密码", example = "password123")
    private String password;
}