package tech.icoding.sjv.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.service.ServerInfoService;

import javax.validation.Valid;
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
    public List<ServerInfo> getAll() {
        return service.findAll();
    }

    @PostMapping
    @Operation(summary = "创建服务器信息")
    public ServerInfo create(@Valid  @RequestBody ServerInfo serverInfo) throws Exception {
        return service.save(serverInfo);
    }

    @GetMapping("/{id}")
    public ServerInfo getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新服务器信息")
    public ServerInfo update(@PathVariable Long id, @Valid @RequestBody ServerInfo serverInfo) throws Exception {
        serverInfo.setId(id); // 确保更新的对象有正确的 ID
        return service.save(serverInfo); // 调用服务层保存更新后的对象
    }


}