package com.example.visitor.config;

import com.example.visitor.entity.Host;
import com.example.visitor.repository.HostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeHosts(
            HostRepository hostRepository) {

        return args -> {

            if (hostRepository.count() == 0) {

                hostRepository.save(
                        new Host(
                                "Azeem",
                                "azeem@example.com"
                        )
                );

                hostRepository.save(
                        new Host(
                                "Rahul",
                                "rahul@example.com"
                        )
                );

                hostRepository.save(
                        new Host(
                                "Vijay",
                                "vijay@example.com"
                        )
                );
            }
        };
    }
}