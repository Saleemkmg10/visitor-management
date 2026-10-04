package com.example.visitor.service;

import com.example.visitor.entity.Visitor;
import com.example.visitor.repository.VisitorRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public VisitorService(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    public Optional<Visitor> findByPhone(String phone) {
        return visitorRepository.findByPhone(phone);
    }

    public Visitor createVisitor(Visitor visitor) {
        return visitorRepository.save(visitor);
    }
}