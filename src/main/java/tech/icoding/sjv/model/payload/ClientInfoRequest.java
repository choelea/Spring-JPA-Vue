package tech.icoding.sjv.model.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import tech.icoding.sjv.model.ClientInfo;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Schema(description = "Client Info Create Request")
public class ClientInfoRequest {

    @Schema(description = "Client Name", example = "客户A")
    @NotNull
    private String clientName;

    @Schema(description = "Version", example = "v1.0")
    private String version;

    @Schema(description = "Port Number", example = "1433")
    private String port;

    @Schema(description = "Annual Fee", example = "5000.00")
    private BigDecimal annualFee;

    @Schema(description = "Expiry Time", example = "2025-04-27 10:10:00")
    private LocalDateTime expiryTime;

    @Schema(description = "Server ID")
    @NotNull
    private Long serverId;

    @Schema(description = "Database Name")
    @NotNull
    private String databaseName;

}