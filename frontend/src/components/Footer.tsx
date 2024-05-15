import React from "react";
import logo from "../img/logo.svg"

const AppFooter: React.FC = () => {
    return (
        <div style={styles.div}>
            <div className="footer" style={styles.footer}>
                <img src={logo} alt="logo" style={styles.logo} />
                <h2 style={styles.h2}>GymConnect</h2>
            </div>
            <div className="creator" style={styles.creator}>
                {" "}
                Created by Robert-Alexandru Zaharia
            </div>
        </div>
    );
};

const styles = {
    div: {
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
        background: "#191f2a",
        display: "flex",
        padding: "1.5rem",
        gap: "1rem",
        justifyContent: "space-around",
        alignItems: "center",
    },
    footer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
    },
    logo: {
        width: "40px",
        height: "40px",
    },
    h2: {
        color: "#fff",
        fontSize: "1.2rem",
    },
    creator: {
        color: "#fff",
        fontSize: "1.2rem",
    },
    link: {
        textDecoration: "none",
        color: "#1460e5",
    },
};

export default AppFooter;
