import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { useJwt } from "react-jwt";
import { useLocation } from "react-router-dom";
import logoImg from "../img/logo.png"; // Import the image directly

const linkStyles = { color: "white", fontFamily: 'Poppins, sans-serif' };

function Navbar() {
  let location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken }: any = useJwt(token as string);
  const studentName = decodedToken?.sub;
  const [id, setId] = useState<string>("");
  const role = decodedToken?.role;

  async function fetchUserInfo(email: string) {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/v1/users?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setId(data[0].id);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (studentName) {
      fetchUserInfo(studentName);
    }
  }, [studentName]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const items = [
    {
      key: "2",
      title: "Home",
      label: (
        <Link to="/home" style={{ display: "flex", alignItems: "center"}}>
          <img src={logoImg} alt="Logo" style={{ height: "50px", marginRight: "5px" }} />
          <span>GymConnect</span>
        </Link>
      ),
      style: linkStyles
    },
    {
      key: "6",
      title: "Profile",
      label: <Link to="/profile">Profile</Link>,
      style: { ...linkStyles, marginLeft: "auto", cursor: "default" },
    },
  ];

  const modifiedItems =
    role === "TEACHER" ? items.filter((item) => item.key !== "4") : items;

  return (
    <Menu
      selectedKeys={[
        items.find(
          (item) =>
            item.title &&
            location.pathname.includes(item.title.toLowerCase())
        )?.key || "Home",
      ]}
      mode="horizontal"
      items={modifiedItems}
      className="p-5 bg-transparent text-white text-xl"
      style={{ backgroundColor: "rgb(27,32,38)", fontSize: "25px", height: "60px", display: 'flex', alignItems: 'center' }}
    />
  );
}

export default Navbar;
