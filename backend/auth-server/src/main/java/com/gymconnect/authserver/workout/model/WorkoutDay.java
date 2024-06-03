package com.gymconnect.authserver.workout.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "workout_days")
public class WorkoutDay {
    @Id
    private UUID id;
    @Column(name = "day", nullable = false)
    private Day day;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workoutDay_id", referencedColumnName = "id")
    private List<UserExercise> userExercises;

    public WorkoutDay(Day day) {
        this.id = UUID.randomUUID();
        this.day = day;
        this.userExercises = new ArrayList<>();
    }

    public void addUserExercise(UserExercise userExercise) {
        userExercises.add(userExercise);
    }
}
