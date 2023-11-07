import React from "react";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from "react";
import { useCookies } from 'react-cookie';
import Badge from 'react-bootstrap/Badge';

export default function CaloriesListFilters({ data, setCalorieItems }) {
    const date = new Date(),
        [currentUser] = useCookies(['username']),
        [defaultDate, setDate] = useState(`${date.getFullYear()}-${date.getMonth() + 1}`);

    return (
        <div>
            <Stack direction="horizontal" gap={3}>
                < Form id="calorie-filters-form">
                    <Stack direction="horizontal" gap={3} className="w-70">
                        <p>Filters: </p>
                        <InputGroup >
                            <InputGroup.Text htmlFor="filter-month">By Month</InputGroup.Text >
                            <Form.Control type="month" id="filter-month" value={defaultDate} onChange={(event) => handleDateChange(event.target.value, setDate, currentUser, setCalorieItems)} required />
                        </InputGroup>
                        <InputGroup >
                            <InputGroup.Text htmlFor="filter-food">By food name</InputGroup.Text>
                            <Form.Control type="text" id="filter-food" onChange={(event) => handleFoodFilter(event, currentUser, setCalorieItems)} required />
                        </InputGroup>
                        <InputGroup className="w-25">
                            <Button type="button" size="sm" variant="outline-success" onClick={(event) => clearFilters(setDate, currentUser, setCalorieItems)} >Clear Filters</Button>{' '}
                        </InputGroup>
                    </Stack>
                </Form>
                <Stack direction="horizontal" gap={3} className="w-30">
                    <div className="vr" />
                    <div className="p-2">
                        Limit Per Day: <h5><Badge pill bg="success">{data.calorieLimit} calories</Badge></h5>
                        <br></br>
                        Total for the month: <h5><Badge pill bg="danger" >{data.totalCalories} calories</Badge></h5>
                    </div>
                    <div className="vr" />
                    <div className="p-2">
                        Cost limit per month: <h5><Badge pill bg="success">$ {parseFloat(data.priceLimit).toFixed(2)}</Badge></h5>
                        <br></br>
                        Total spend for the month: <h5><Badge pill bg="danger" >$ {parseFloat(data.totalPrice).toFixed(2)}</Badge></h5>
                    </div>
                </Stack>
            </Stack>
        </div>
    );
}

function handleDateChange(date, setDate, currentUser, setCalorieItems) {
    setDate(date);
    date = date.split("-");
    const payload = {
        user: currentUser.username,
        year: date[0],
        month: date[1],
        filterString: document.getElementById("filter-food").value
    };

    fetchItems(payload, setCalorieItems);
}

function clearFilters(setDate, currentUser, setCalorieItems) {
    const date = new Date();
    document.getElementById("calorie-filters-form").reset();
    handleDateChange(`${date.getFullYear()}-${date.getMonth() + 1}`, setDate, currentUser, setCalorieItems);
}

function handleFoodFilter(event, currentUser, setCalorieItems) {
    let date = document.getElementById("filter-month").value;
    date = date.split("-");
    const payload = {
        user: currentUser.username,
        year: date[0],
        month: date[1],
        filterString: event.target.value
    };

    fetchItems(payload, setCalorieItems);
}

function fetchItems(payload, setCalorieItems) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    };

    fetch("http://localhost:8000/get-items", options).then(result => result.json()).then(result => {
        setCalorieItems(result);
    }).catch(error => console.error(error));
}
