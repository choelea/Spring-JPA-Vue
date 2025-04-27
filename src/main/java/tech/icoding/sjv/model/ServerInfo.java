package tech.icoding.sjv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NonNull;
import tech.icoding.sjv.validation.annotation.NullOrNotBlank;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "biz_server_info")
@Schema(name = "Server Info", description = "服务器信息")
@Data
public class ServerInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alias", nullable = false)
    @NullOrNotBlank(message = "Login Username can be null but not blank")
    private String alias;

    @Column(name = "address", nullable = false)
    @NullOrNotBlank(message = "Login Username can be null but not blank")
    private String address;

    @Column(name = "port", nullable = false)
    @NotNull(message = "Port cannot be null")
    private Integer port;

    @Column(name = "username")
    @NullOrNotBlank(message = "Login Username can be null but not blank")
    private String username;

    @Column(name = "password")
    @NullOrNotBlank(message = "Login Username can be null but not blank")
    private String password;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ClientInfo> clients = new HashSet<>();
}