package tech.icoding.sjv.service;

import org.springframework.stereotype.Service;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.repository.ServerInfoRepository;

import java.util.List;

@Service
public class ServerInfoService {

    private final ServerInfoRepository repository;

    public ServerInfoService(ServerInfoRepository repository) {
        this.repository = repository;
    }

    public List<ServerInfo> findAll() {
        return repository.findAll();
    }

    public ServerInfo save(ServerInfo serverInfo) {
        return repository.save(serverInfo);
    }

    public ServerInfo findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}