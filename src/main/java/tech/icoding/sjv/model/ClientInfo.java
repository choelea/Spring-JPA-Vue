package tech.icoding.sjv.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "biz_client_info")
@Data
public class ClientInfo {

    @Transient
    public String getServerAlias() {
        return server.getAlias();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 客户名
     */
    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "version")
    private String version;

    @Column(name = "annual_fee")
    private BigDecimal annualFee;

    @Column(name = "expiry_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "server_id")
    private ServerInfo server;

    @Column(name = "db_name", nullable = false)
    private String databaseName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UsageStatus status;

    public enum UsageStatus {
        ENABLED,
        DISABLED
    }

}