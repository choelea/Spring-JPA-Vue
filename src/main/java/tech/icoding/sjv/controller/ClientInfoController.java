package tech.icoding.sjv.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.model.payload.ClientInfoRequest;
import tech.icoding.sjv.service.ClientInfoService;
import tech.icoding.sjv.service.ServerInfoService;
import tech.icoding.sjv.util.CustomSqlServerConnector;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@Tag(name = "客户信息维护 Rest API", description = "维护客户信息")
public class ClientInfoController {

    private final ClientInfoService service;
    private final ServerInfoService serverInfoService;

    public ClientInfoController(ClientInfoService service, ServerInfoService serverInfoService) {
        this.service = service;
        this.serverInfoService = serverInfoService;
    }

    @GetMapping
    @Operation(summary = "获取所有客户列表")
    public List<ClientInfo> getAll(@RequestParam(required = false) String clientName) {
        return service.findByClientName(clientName);
    }

    @PostMapping
    @Operation(summary = "创建客户信息")
    public ClientInfo create(@RequestBody ClientInfoRequest clientInfoRequest) {
        ClientInfo clientInfo = service.convert(clientInfoRequest);
        return service.save(clientInfo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取单个客户信息")
    public ClientInfo getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除单个客户信息")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改单个客户信息")
    public ClientInfo update(@PathVariable Long id, @RequestBody ClientInfoRequest clientInfoRequest) {
        ClientInfo clientInfo = service.convert(clientInfoRequest); // 将请求转换为 ClientInfo 对象
        clientInfo.setId(id); // 设置更新对象的 ID
        return service.save(clientInfo); // 调用服务层保存更新后的对象
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "禁用和启用客户：ENABLED / DISABLED")
    public ClientInfo updateStatus(@PathVariable Long id, @RequestParam ClientInfo.UsageStatus usageStatus) {
        ClientInfo clientInfo = service.findById(id);
        clientInfo.setStatus(usageStatus);
//        if(ClientInfo.UsageStatus.DISABLED.equals(usageStatus)){
//            try {
//                serverInfoService.disableDatabase(clientInfo.getServer(), clientInfo.getDatabaseName());
//            } catch (Exception e) {
//                throw new RuntimeException("禁用数据库失败", e);
//            }
//        } else if(ClientInfo.UsageStatus.ENABLED.equals(usageStatus)){
//            try {
//                serverInfoService.enableDatabase(clientInfo.getServer(), clientInfo.getDatabaseName());
//            } catch (Exception e) {
//                throw new RuntimeException("启用数据库失败", e);
//            }
//        }
        return service.save(clientInfo); // 调用服务层保存更新后的对象
    }

}