package tech.icoding.sjv.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.service.ClientInfoService;
import tech.icoding.sjv.service.ServerInfoService;
import tech.icoding.sjv.util.CustomSqlServerConnector;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientInfoController {

    private final ClientInfoService service;
    private final ServerInfoService serverInfoService;

    public ClientInfoController(ClientInfoService service, ServerInfoService serverInfoService) {
        this.service = service;
        this.serverInfoService = serverInfoService;
    }

    @GetMapping
    public List<ClientInfo> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ClientInfo create(@RequestBody ClientInfo clientInfo) {
        return service.save(clientInfo);
    }

    @GetMapping("/{id}")
    public ClientInfo getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    public ClientInfo update(@PathVariable Long id, @RequestBody ClientInfo clientInfo) {
        clientInfo.setId(id); // 设置更新对象的 ID
        return service.save(clientInfo); // 调用服务层保存更新后的对象
    }

    @PutMapping("/{id}/status")
    public ClientInfo updateStatus(@PathVariable Long id, @RequestBody ClientInfo.UsageStatus usageStatus) {
        ClientInfo clientInfo = service.findById(id);
        clientInfo.setStatus(usageStatus);
        if(ClientInfo.UsageStatus.DISABLED.equals(usageStatus)){
            try {
                serverInfoService.disableDatabase(clientInfo.getServer(), clientInfo.getDatabaseName());
            } catch (Exception e) {
                throw new RuntimeException("禁用数据库失败", e);
            }
        } else if(ClientInfo.UsageStatus.ENABLED.equals(usageStatus)){
            try {
                serverInfoService.enableDatabase(clientInfo.getServer(), clientInfo.getDatabaseName());
            } catch (Exception e) {
                throw new RuntimeException("启用数据库失败", e);
            }
        }
        return service.save(clientInfo); // 调用服务层保存更新后的对象
    }

}