package tech.icoding.sjv.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "client_info")
public class ClientInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "version")
    private String version;

    @Column(name = "dongle_number")
    private String dongleNumber;

    @Column(name = "annual_fee")
    private BigDecimal annualFee;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id")
    private ServerInfo server;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UsageStatus status;

    public enum UsageStatus {
        ENABLED,
        DISABLED
    }

    // Getters and Setters
}