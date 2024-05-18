package com.gymconnect.authserver.workout.repository;

import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.model.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {
    List<Workout> findWorkoutsByUserId(UUID userId);
    void deleteById(UUID id);
    List<Workout> findByUserIdAndName(UUID userId, String name);
}
