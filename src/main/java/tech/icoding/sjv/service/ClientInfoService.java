package tech.icoding.sjv.service;

import org.springframework.stereotype.Service;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.model.payload.ClientInfoRequest;
import tech.icoding.sjv.repository.ClientInfoRepository;
import tech.icoding.sjv.repository.ServerInfoRepository;

import java.util.List;

@Service
public class ClientInfoService {

    private final ClientInfoRepository repository;
    private final ServerInfoRepository serverInfoRepository;

    public ClientInfoService(ClientInfoRepository repository, ServerInfoRepository serverInfoRepository) {
        this.repository = repository;
        this.serverInfoRepository = serverInfoRepository;
    }

    public List<ClientInfo> findAll() {
        return repository.findAll();
    }

    /**
     * 根据客户名模糊查询所有客户列表
     * @param clientName
     * @return
     */
    public List<ClientInfo> findByClientName(String clientName) {
        if(clientName == null || clientName.isEmpty()) {
            return findAll();
        }
        return repository.findByClientNameLike(clientName);
    }

    public ClientInfo convert(ClientInfoRequest request) {
        ClientInfo clientInfo = new ClientInfo();
        clientInfo.setClientName(request.getClientName());
        clientInfo.setVersion(request.getVersion());
        clientInfo.setPort(request.getPort());
        clientInfo.setAnnualFee(request.getAnnualFee());
        clientInfo.setExpiryTime(request.getExpiryTime());
        clientInfo.setDatabaseName(request.getDatabaseName());
        clientInfo.setStatus(ClientInfo.UsageStatus.ENABLED);

        ServerInfo serverInfo = serverInfoRepository.findById(request.getServerId())
                .orElseThrow(() -> new IllegalArgumentException("Server ID not found: " + request.getServerId()));
        clientInfo.setServer(serverInfo);

        return clientInfo;
    }

    public ClientInfo save(ClientInfo clientInfo) {
        return repository.save(clientInfo);
    }

    public ClientInfo findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}