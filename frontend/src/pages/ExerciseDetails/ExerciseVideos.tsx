import React, { useEffect, useRef } from 'react';
import {Button, Card} from "antd";
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { ExerciseType } from "../Workout/ExerciseTable";

const cardStyle: React.CSSProperties = {
    margin: 80
};

interface ExerciseVideosProps {
    exerciseVideos: { videoId: string } [];
    name: string | undefined ;
}

const ExerciseVideos: React.FC<ExerciseVideosProps> = ({ exerciseVideos, name }) => {
    const ref = useRef<HTMLDivElement>(null);

    const LeftHandler = () => {
        if (ref.current) ref.current.scrollLeft -= 320;
    };

    const RightHandler = () => {
        if (ref.current) ref.current.scrollLeft += 320;
    };

    useEffect(() => {
    }, []);

    console.log("exercise videos inside ExerciseVideos:", exerciseVideos)

    return (
        <Card hoverable style={cardStyle}>
            <h2 style={{textAlign: "center"}}>
                Watch{" "}
                <strong style={{ color: "#1460e5", textTransform: "capitalize" }}>
                    {name}
                </strong>{" "}
                exercise videos
            </h2>
            <div className="box" style={{display: "flex", alignItems: "center"}}>
                <Button onClick={LeftHandler} style={{marginRight: 10}}>
                    <LeftCircleOutlined/>
                </Button>
                <div ref={ref} style={{overflowX: 'auto', whiteSpace: 'nowrap', flex: 1}}>
                    {exerciseVideos.map((item, index) => (
                        <iframe
                            key={index}
                            className="video_responsive"
                            src={`https://www.youtube.com/embed/${item.videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded youtube"
                            loading="lazy"
                            style={{ margin: 10 }} // Added margin-right here
                        />
                    ))}
                </div>
                <Button onClick={RightHandler} style={{marginLeft: 10}}>
                    <RightCircleOutlined/>
                </Button>
            </div>
        </Card>
    );
};

export default ExerciseVideos;
