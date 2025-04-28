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
     * 根据客户名模糊查询所有客户列表；根据过期时间倒序排序
     * @param clientName
     * @return
     */
    public List<ClientInfo> findByClientName(String clientName) {
        List<ClientInfo> clientInfos = null;
        if(clientName == null || clientName.isEmpty()) {
            clientInfos = findAll();
        }else{
            clientInfos = repository.findByClientNameLike("%"+clientName.trim()+"%");
        }
        clientInfos.sort((o1, o2) -> o2.getExpiryTime().compareTo(o1.getExpiryTime()));
        return clientInfos;
    }

    public ClientInfo convert(ClientInfoRequest request) {
        ClientInfo clientInfo = new ClientInfo();
        clientInfo.setClientName(request.getClientName());
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