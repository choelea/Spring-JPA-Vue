package tech.icoding.sjv.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.icoding.sjv.model.ClientInfo;

import java.time.LocalDateTime;
import java.util.List;

public interface ClientInfoRepository extends JpaRepository<ClientInfo, Long> {
    /**
     * 根据客户名模糊查询客户列表
     */
    List<ClientInfo> findByClientNameLike(String clientName);


    /**
     * 检查某个服务器是否有客户使用
     */
    boolean existsByServerId(Long serverId);

    /**
     * 查找过期时间小于当前时间的客户列表
     */
    List<ClientInfo> findByExpiryTimeLessThanEqual(LocalDateTime expiryTime);

}