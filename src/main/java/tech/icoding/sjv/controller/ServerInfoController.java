package tech.icoding.sjv.controller;

import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ServerInfo;
import tech.icoding.sjv.service.ServerInfoService;

import java.util.List;

@RestController
@RequestMapping("/api/servers")
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
    public ServerInfo create(@RequestBody ServerInfo serverInfo) {
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
}