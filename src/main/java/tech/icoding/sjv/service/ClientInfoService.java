package tech.icoding.sjv.service;

import org.springframework.stereotype.Service;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.repository.ClientInfoRepository;

import java.util.List;

@Service
public class ClientInfoService {

    private final ClientInfoRepository repository;

    public ClientInfoService(ClientInfoRepository repository) {
        this.repository = repository;
    }

    public List<ClientInfo> findAll() {
        return repository.findAll();
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