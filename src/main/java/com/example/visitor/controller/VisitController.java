package com.example.visitor.controller;

import com.example.visitor.entity.*;
import com.example.visitor.repository.HostRepository;
import com.example.visitor.repository.VisitRepository;
import com.example.visitor.repository.VisitorRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin
public class VisitController {

    private final VisitRepository visitRepository;
    private final VisitorRepository visitorRepository;
    private final HostRepository hostRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public VisitController(
            VisitRepository visitRepository,
            VisitorRepository visitorRepository,
            HostRepository hostRepository,
            SimpMessagingTemplate messagingTemplate) {

        this.visitRepository = visitRepository;
        this.visitorRepository = visitorRepository;
        this.hostRepository = hostRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public Visit createVisit(
            @RequestParam Long visitorId,
            @RequestParam Long hostId,
            @RequestParam String purpose) {

        Visitor visitor = visitorRepository
                .findById(visitorId)
                .orElseThrow();

        Host host = hostRepository
                .findById(hostId)
                .orElseThrow();

        Visit visit = new Visit();

        visit.setVisitor(visitor);
        visit.setHost(host);
        visit.setPurpose(purpose);

        // Automatic current time
        visit.setEntryTime(LocalDateTime.now());

        visit.setStatus(VisitStatus.WAITING);

        Visit savedVisit = visitRepository.save(visit);

        // Send notification to host
        String message =
                "Visitor " + visitor.getName()
                        + " is waiting to meet you.";

        messagingTemplate.convertAndSend(
                "/topic/host/" + hostId,
                message
        );

        return savedVisit;
    }

    @GetMapping
    public List<Visit> getAllVisits() {

        return visitRepository.findAll();
    }

    @PutMapping("/{id}/start")
    public Visit startMeeting(
            @PathVariable Long id) {

        Visit visit = visitRepository
                .findById(id)
                .orElseThrow();

        visit.setStatus(VisitStatus.MEETING);

        return visitRepository.save(visit);
    }

    @PutMapping("/{id}/complete")
    public Visit completeMeeting(
            @PathVariable Long id) {

        Visit visit = visitRepository
                .findById(id)
                .orElseThrow();

        visit.setStatus(VisitStatus.COMPLETED);

        return visitRepository.save(visit);
    }

    @PutMapping("/{id}/exit")
    public Visit exitVisitor(
            @PathVariable Long id) {

        Visit visit = visitRepository
                .findById(id)
                .orElseThrow();

        visit.setExitTime(LocalDateTime.now());

        visit.setStatus(VisitStatus.EXITED);

        return visitRepository.save(visit);
    }
}