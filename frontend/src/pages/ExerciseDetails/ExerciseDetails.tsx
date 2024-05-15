import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Typography } from 'antd';
import { ExerciseType } from "../Workout/ExerciseTable";
import { securedInstance } from "../../services/api";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseVideos from "./ExerciseVideos";
import exerciseInfo from "./ExerciseInfo";

const ExerciseDetails: React.FC = () => {

    const id = useParams<{ id: string }>();
    const [exercise, setExercise] = useState<ExerciseType>()
    const [exerciseVideos, setExerciseVideos] = useState([]);

    const params = {
        query: exercise?.name,
    };

    const headers = {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    };

    const fetchExercise = () => {
        securedInstance.get(`http://localhost:8082/api/v1/exercises/${id.id}`)
            .then(response => {
                console.log(response)
                setExercise(response.data)
                return response.data.name;
            })
            .then(name => {
                console.log(`https://youtube-search-and-download.p.rapidapi.com/search?query=${name}`)
                securedInstance.get(`https://youtube-search-and-download.p.rapidapi.com/search?query=${name}`,
                    {
                        params: { query: name },
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
        </div>
    );
};

export default ExerciseDetails;
