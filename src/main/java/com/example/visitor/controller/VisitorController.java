package com.example.visitor.controller;

import com.example.visitor.entity.Visitor;
import com.example.visitor.service.VisitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(
            VisitorService visitorService) {

        this.visitorService = visitorService;
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> findByPhone(
            @PathVariable String phone) {

        return visitorService.findByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Visitor createVisitor(
            @RequestBody Visitor visitor) {

        return visitorService.createVisitor(visitor);
    }
}