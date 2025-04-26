package tech.icoding.sjv.controller;

import org.springframework.web.bind.annotation.*;
import tech.icoding.sjv.model.ClientInfo;
import tech.icoding.sjv.service.ClientInfoService;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientInfoController {

    private final ClientInfoService service;

    public ClientInfoController(ClientInfoService service) {
        this.service = service;
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
}