package com.gymconnect.workoutservice.repository;

import com.gymconnect.workoutservice.model.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, UUID> {
    void deleteById(UUID id);
//    Optional<WorkoutDay> findByWorkoutIdAndDay(UUID workoutId, Day day);
//
//    List<WorkoutDay> findByWorkoutId(UUID workoutId);
}
