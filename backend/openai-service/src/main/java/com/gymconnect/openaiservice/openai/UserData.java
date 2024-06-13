package com.gymconnect.openaiservice.openai;


import lombok.Data;

@Data
public class UserData {
    private int height;
    private int weight;
    private int age;
    private String gender;
    private String fitnessLevel;
    private String goal;
    private int numberOfDaysPerWeek;

    @Override
    public String toString() {
        return String.format(
                "{ \"height\": %d, \"weight\": %d, \"age\": %d, \"gender\": \"%s\", \"fitnessLevel\": \"%s\", \"goal\": \"%s\", \"numberOfDaysPerWeek\": %d }",
                height, weight, age, gender, fitnessLevel, goal, numberOfDaysPerWeek
        );
    }
}

