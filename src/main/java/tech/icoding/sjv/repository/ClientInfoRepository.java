package tech.icoding.sjv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.icoding.sjv.model.ClientInfo;

public interface ClientInfoRepository extends JpaRepository<ClientInfo, Long> {
}