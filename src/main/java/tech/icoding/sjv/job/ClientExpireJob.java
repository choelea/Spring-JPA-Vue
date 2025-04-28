package tech.icoding.sjv.job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.repository.ClientInfoRepository;
import tech.icoding.sjv.service.ClientInfoService;
import tech.icoding.sjv.service.ServerInfoService;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author joe
 * @date 2025/04/28
 */
@Component
@Slf4j
public class ClientExpireJob {

    private ClientInfoRepository clientInfoRepository;
    private ClientInfoService clientInfoService;
    private ServerInfoService serverInfoService;

    public ClientExpireJob(ClientInfoRepository clientInfoRepository, ClientInfoService clientInfoService, ServerInfoService serverInfoService) {
        this.clientInfoRepository = clientInfoRepository;
        this.clientInfoService = clientInfoService;
        this.serverInfoService = serverInfoService;
    }


    /**
     * 每天早上5点执行
     */
    @Scheduled(cron = "0 30 22 * * ?")
    public void executeTask() {
        log.info("*********************检查过期客户信息开始*********************");
        List<ClientInfo> byClientName = clientInfoRepository.findByExpiryTimeLessThanEqual(LocalDateTime.now());
        if (byClientName != null && byClientName.size() > 0) {
            for (ClientInfo clientInfo : byClientName) {
                try {
                    serverInfoService.disableDatabase(clientInfo.getServer(), clientInfo.getDatabaseName());
                    clientInfo.setStatus(ClientInfo.UsageStatus.DISABLED);
                    clientInfoRepository.save(clientInfo);
                    log.info("成功禁用客户:{}",clientInfo.getClientName());
                } catch (SQLException e) {
                    log.error("禁用客户{}失败",clientInfo.getClientName(), e);
                }
            }
        }
        log.info("*********************检查过期客户信息结束*********************");
    }
}
