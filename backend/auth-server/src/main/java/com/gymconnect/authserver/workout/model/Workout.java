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
@Table(name = "workouts")
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(name = "userId", nullable = false)
    private UUID userId;
    @Column(name = "day", nullable = false)
    private Day day;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workout_id", referencedColumnName = "id")
    private List<UserExercise> userExercises;

    public Workout(UUID userId, Day day) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.day = day;
        this.userExercises = new ArrayList<>();
    }

    public void addUserExercise(UserExercise userExercise) {
        userExercises.add(userExercise);
    }
}
