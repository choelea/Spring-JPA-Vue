package tech.icoding.sjv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.icoding.sjv.model.ServerInfo;

public interface ServerInfoRepository extends JpaRepository<ServerInfo, Long> {
}