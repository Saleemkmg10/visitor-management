package com.example.visitor.controller;

import com.example.visitor.entity.Host;
import com.example.visitor.repository.HostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hosts")
@CrossOrigin
public class HostController {

    private final HostRepository hostRepository;

    public HostController(
            HostRepository hostRepository) {

        this.hostRepository = hostRepository;
    }

    @GetMapping
    public List<Host> getHosts() {

        return hostRepository.findAll();
    }

    @PostMapping
    public Host createHost(@RequestBody Host host) {

        return hostRepository.save(host);
    }
}