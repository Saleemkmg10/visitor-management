package com.example.visitor.repository;

import com.example.visitor.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitorRepository
        extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findByPhone(String phone);
}