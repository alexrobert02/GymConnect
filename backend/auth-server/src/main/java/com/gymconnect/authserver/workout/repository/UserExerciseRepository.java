package com.gymconnect.authserver.workout.repository;

import com.gymconnect.authserver.workout.model.UserExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserExerciseRepository extends JpaRepository<UserExercise, UUID> {

}
