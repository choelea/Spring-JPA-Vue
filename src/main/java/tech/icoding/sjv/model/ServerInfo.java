package tech.icoding.sjv.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "server_info")
public class ServerInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alias", nullable = false)
    private String alias;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "port", nullable = false)
    private Integer port;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ClientInfo> clients = new HashSet<>();

    // Getters and Setters
}