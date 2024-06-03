import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Space } from "antd";
import { Link } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import { useJwt } from "react-jwt";
import { useLocation } from "react-router-dom";
import logoImg from "../img/logo.png";
import { securedInstance } from '../services/api';

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

    const handleLogout = () => {
        securedInstance.post('/api/v1/auth/logout')
            .then(() => {
                window.location.href = "/login";
                localStorage.removeItem("token");
                setToken(null);
            })
    };

    const profileMenuItems = [
      {
        key: 'logout',
        label: (
            <a onClick={handleLogout}>
              Logout
            </a>
        ),
        // style: linkStyles
      },
    ];

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
        label: <Link to="/workout">Your Workout Split</Link>,
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
        to: "/profile",
        label: (
            <Dropdown menu={{ items: profileMenuItems }} >
              <a onClick={(e) =>
                {
                    e.preventDefault()
                    window.location.href = "/profile"}
              }>
                <Space >
                  Profile
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
        ),
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
              )?.key || "1",
            ]}
            mode="horizontal"
            items={modifiedItems}
            className="p-5 bg-transparent text-white text-xl"
            style={{ backgroundColor: "rgb(27,32,38)", fontSize: "25px", height: "60px", display: 'flex', alignItems: 'center' }}
        />
    );
}

export default Navbar;
