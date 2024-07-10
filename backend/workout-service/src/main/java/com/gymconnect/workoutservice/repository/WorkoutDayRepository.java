package com.gymconnect.workoutservice.repository;

import com.gymconnect.workoutservice.model.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, UUID> {
    void deleteById(UUID id);
}
