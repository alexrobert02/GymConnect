package com.gymconnect.authserver.workout.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_exercises")
public class UserExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String exerciseId;
    private Integer sets;
    @ElementCollection
    @CollectionTable(name="user_exercise_reps", joinColumns=@JoinColumn(name="user_exercise_id"))
    @Column(name="reps")
    private List<Integer> reps;
    private Double weights;
    private Integer rest;

    public UserExercise(String exerciseId, Integer sets, List<Integer> reps, Double weights, Integer rest) {
        this.id = UUID.randomUUID();
        this.exerciseId = exerciseId;
        this.sets = sets;
        this.reps = reps;
        this.weights = weights;
        this.rest = rest;
    }

    @Override
    public String toString() {
        return "UserExercise{" +
                "id=" + id +
                ", exerciseId='" + exerciseId + '\'' +
                ", sets=" + sets +
                ", reps=" + reps +
                ", weights=" + weights +
                ", rest=" + rest +
                '}';
    }


}
