package com.example.visitor.repository;

import com.example.visitor.entity.Visit;
import com.example.visitor.entity.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitRepository
        extends JpaRepository<Visit, Long> {

    List<Visit> findByVisitorId(Long visitorId);

    List<Visit> findByStatus(VisitStatus status);
}