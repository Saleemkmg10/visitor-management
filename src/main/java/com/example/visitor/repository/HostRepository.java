package com.example.visitor.repository;

import com.example.visitor.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostRepository
        extends JpaRepository<Host, Long> {
}