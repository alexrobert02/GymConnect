import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExerciseType } from "../Workout/ExerciseTable";
import { securedInstance } from "../../services/api";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseVideos from "./ExerciseVideos";
import SimilarExercises from "./SimilarExercises";

const ExerciseDetails: React.FC = () => {

    const id = useParams<{ id: string }>();
    const [exercise, setExercise] = useState<ExerciseType>();
    const [targetMuscleExercises, setTargetMuscleExercises] = useState<ExerciseType[]>([]);
    const [equipmentExercises, setEquipmentExercises] = useState<ExerciseType[]>([]);
    const [exerciseVideos, setExerciseVideos] = useState([]);

    const headers = {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    };

    const fetchExercise = () => {
        securedInstance.get(`/api/v1/exercises/${id.id}`)
            .then(response => {
                console.log(response)
                setExercise(response.data)
                return response.data;
            })
            .then(exercise => {
                console.log(`https://youtube-search-and-download.p.rapidapi.com/search?query=${exercise.name}`)
                securedInstance.get(`https://youtube-search-and-download.p.rapidapi.com/search?query=${exercise.name}`,
                    {
                        params: { query: exercise.name },
                        headers: headers
                    })
                    .then(response => {
                        console.log('Fetch successful');
                        console.log(response);
                        // Filter out objects with 'video' property
                        const videoContents = response.data.contents.filter((content: any) => content.video && !content.video.title.includes('music'));
                        console.log("Filtered videos:", videoContents);
                        setExerciseVideos(videoContents.map((content: any) => content.video)); // Extract 'video' objects

                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                securedInstance.get(`/api/v1/exercises/target/${exercise.target}`)
                    .then(response => {
                        console.log("Target muscle exercises:", response.data)
                        setTargetMuscleExercises(response.data);
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error)
                    })
                securedInstance.get(`/api/v1/exercises/equipment/${exercise.equipment}`)
                    .then(response => {
                        console.log("Equipment muscle exercises:", response.data)
                        setEquipmentExercises(response.data);
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error)
                    })
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });




    };

    useEffect(() => {
        fetchExercise()
    }, []);

    return (
        <div>
            <ExerciseInfo exercise={exercise}/>
            <ExerciseVideos exerciseVideos={exerciseVideos} name={exercise?.name}/>
            <SimilarExercises title={"Exercises That Target The Same Muscles Group"} exercises={targetMuscleExercises}/>
            <SimilarExercises title={"Exercises That Uses The Same Equipments"} exercises={equipmentExercises}/>
        </div>
    );
};

export default ExerciseDetails;
