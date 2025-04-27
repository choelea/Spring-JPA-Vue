package tech.icoding.sjv.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.model.payload.ServerInfoRequest;
import tech.icoding.sjv.service.ServerInfoService;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/servers")
@Tag(name = "服务器信息 Rest API", description = "维护服务器信息")
public class ServerInfoController {

    private final ServerInfoService service;

    public ServerInfoController(ServerInfoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "获取所有服务列表")
    public List<ServerInfo> getAll() {
        return service.findAll();
    }

    @PostMapping
    @Operation(summary = "创建服务器信息")
    public ServerInfo create(@Valid  @RequestBody ServerInfoRequest serverInfoRequest) throws Exception {
        ServerInfo serverInfo = new ServerInfo();
        copyProperties(serverInfoRequest, serverInfo);
        return service.save(serverInfo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取指定服务器信息")
    public ServerInfo getById(@PathVariable Long id) {
        return service.findById(id);
    }
    @GetMapping("/{id}/_databases")
    @Operation(summary = "获取指定服务器下面所有数据库名字")
    public String[] getDatabases(@PathVariable Long id) throws SQLException {
        return service.getDatabaseNames(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除指定服务器信息")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新指定服务器信息")
    public ServerInfo update(@PathVariable Long id, @Valid @RequestBody ServerInfoRequest serverInfoRequest) throws Exception {
        ServerInfo serverInfo = new ServerInfo();
        copyProperties(serverInfoRequest, serverInfo);
        serverInfo.setId(id); // 确保更新的对象有正确的 ID
        return service.save(serverInfo); // 调用服务层保存更新后的对象
    }

    private void copyProperties(ServerInfoRequest request, ServerInfo serverInfo) {
        serverInfo.setAlias(request.getAlias());
        serverInfo.setAddress(request.getAddress());
        serverInfo.setPort(request.getPort());
        serverInfo.setUsername(request.getUsername());
        serverInfo.setPassword(request.getPassword());
    }

}