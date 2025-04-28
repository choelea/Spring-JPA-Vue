package tech.icoding.sjv.model.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.validation.annotation.NullOrNotBlank;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Schema(description = "Client Info Create Request")
public class ClientInfoRequest {

    @Schema(description = "Client Name", example = "客户A")
    @NotBlank(message = "客户名称不能为空")
    private String clientName;

    @Schema(description = "Port Number", example = "1433")
    @NotNull(message = "端口不能为空")
    private String port;

    @Schema(description = "Annual Fee", example = "5000.00")
    @NotNull(message = "年费不能为空")
    private BigDecimal annualFee;

    @Schema(description = "Expiry Time", example = "2025-04-27 10:10:00")
    @NotNull(message = "到期时间不能为空")
    private LocalDateTime expiryTime;

    @Schema(description = "Server ID")
    @NotBlank(message = "Server ID 不能为空")
    private Long serverId;

    @Schema(description = "Database Name")
    @NotBlank(message = "数据库名不能为空")
    private String databaseName;

}