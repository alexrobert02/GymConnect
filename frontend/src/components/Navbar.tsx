import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import {Link, useLocation} from "react-router-dom";
import {useJwt} from "react-jwt";
import logoImg from "../img/logo.png";
import Profile from "../pages/Profile/Profile";

const linkStyles = { color: "white", fontFamily: 'Poppins, sans-serif', fontSize: '20px' };

function Navbar() {
    let location = useLocation();
    const [token, setToken] = useState<string | null>(null);
    const { decodedToken }: any = useJwt(token as string);
    const role = decodedToken?.role;

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    const items = [
        {
            key: "1",
            title: "Home",
            to: "/home",
            label: (
                <Link to="/home" style={{ display: "flex", alignItems: "center" }}>
                    <img src={logoImg} alt="Logo" style={{ height: "50px", marginRight: "5px" }} />
                    <span>GymConnect</span>
                </Link>
            ),
            style: linkStyles
        },
        {
            key: "2",
            title: "Workout",
            to: "/workout",
            label: <Link to="/workout">My Workout Plans</Link>,
            style: { ...linkStyles, cursor: "default" },
        },
        {
            key: "3",
            title: "Exercises",
            to: "/exercises",
            label: <Link to="/exercises">Exercises</Link>,
            style: linkStyles
        },
        {
            key: "4",
            title: "AI Workout Creator",
            to: "/generate-workout",
            label: <Link to="/generate-workout">AI Workout Creator</Link>,
            style: { ...linkStyles, cursor: "default" },
        },
        {
            key: "6",
            title: "Profile",
            label: <Profile/>,
            style: { ...linkStyles, marginLeft: "auto", cursor: "default" },
        },
    ];

    const modifiedItems =
        role === "TEACHER" ? items.filter((item) => item.key !== "5") : items;

    return (
        <Menu
            selectedKeys={[
                items.find(
                    (item) =>
                        item.to && location.pathname.startsWith(item.to)
                )?.key || "3",
            ]}
            mode="horizontal"
            items={modifiedItems}
            className="p-5 bg-transparent text-white text-xl"
            style={{ backgroundColor: "rgb(27,32,38)", fontSize: "25px", height: "60px", display: 'flex', alignItems: 'center' }}
        />
    );
}

export default Navbar;
