import React, {useEffect, useRef} from 'react';
import {Button, Card} from "antd";
import {LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons';
import {useMediaQuery} from "react-responsive";

const cardStyle: React.CSSProperties = {
    margin: '5%',
    padding: '20px'
};

const iframeStyle: React.CSSProperties = {
    margin: 10,
    maxWidth: '100%',
    height: 'auto'
};

interface ExerciseVideosProps {
    exerciseVideos: { videoId: string }[];
    name: string | undefined;
}

const ExerciseVideos: React.FC<ExerciseVideosProps> = ({ exerciseVideos, name }) => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollAmount = () => {
        return window.innerWidth < 768 ? window.innerWidth - 80 : 320;
    };

    const LeftHandler = () => {
        if (ref.current) ref.current.scrollLeft -= scrollAmount();
    };

    const RightHandler = () => {
        if (ref.current) ref.current.scrollLeft += scrollAmount();
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        // Recalculate scroll amount on window resize
        const handleResize = () => {
            if (ref.current) ref.current.scrollLeft = 0;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Card hoverable className={"border-shadow"} style={cardStyle}>
            <h2 style={{ textAlign: "center" }}>
                Watch{" "}
                <strong style={{ color: "#1460e5", textTransform: "capitalize" }}>
                    {name}
                </strong>{" "}
                exercise videos
            </h2>
            <div className="box" style={{ display: "flex", alignItems: "center" }}>
                {!isMobile && (
                    <Button onClick={LeftHandler} style={{ marginRight: 10 }}>
                        <LeftCircleOutlined />
                    </Button>
                )}
                <div ref={ref} style={{ overflowX: 'auto', whiteSpace: 'nowrap', flex: 1 }}>
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
                            style={iframeStyle}
                        />
                    ))}
                </div>
                {!isMobile && (
                    <Button onClick={RightHandler} style={{ marginLeft: 10 }}>
                        <RightCircleOutlined />
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default ExerciseVideos;
