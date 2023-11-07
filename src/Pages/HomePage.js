import React from 'react';
import { useState } from "react";
import AppNavbar from "../Components/Navbar";
import CaloriesList from "../Components/CaloriesList";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function Home() {
    let [calorieItems, setCalorieItems] = useState([]);
    const [loginStatus] = useCookies(['loginStatus']),
        navigate = useNavigate();

    useEffect(() => {
        if (!loginStatus.loginStatus) {
            navigate("/login");
        }
    }, [navigate, loginStatus]);

    return (
        <>
            < AppNavbar />
            <div className="home-page-wrapper">
                < CaloriesList calorieItems={calorieItems} setCalorieItems={setCalorieItems} />
            </div>
        </>
    );
}
