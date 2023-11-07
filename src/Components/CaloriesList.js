import React, { useState } from 'react';
import { useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { useCookies } from 'react-cookie';
import CaloriesListFilters from './CaloriesListFilters';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import CalorieAddForm from "../Components/CalorieAddForm";

export default function CaloriesList({ calorieItems, setCalorieItems }) {
    const [currentUser] = useCookies(['username']);

    useEffect(() => {
        fetchItems(setCalorieItems, currentUser);
    }, [currentUser, setCalorieItems]);

    let monthlyCalories = 0, monthlyCost = 0;
    const formattedData = {},
        dailyCaloriesTotal = {},
        dailyPriceTotal = {};

    for (const index in calorieItems.items) {
        const items = calorieItems.items[index],
            date = items.date.split(" ")[0];

        monthlyCalories += items.calories;
        monthlyCost += items.price;
        if (formattedData.hasOwnProperty(date)) {
            formattedData[date].push(items);
        } else {
            formattedData[date] = [];
            formattedData[date].push(items);
        }

        if (dailyCaloriesTotal.hasOwnProperty(date)) {
            dailyCaloriesTotal[date] += items.calories;
        } else {
            dailyCaloriesTotal[date] = items.calories;
        }

        if (dailyPriceTotal.hasOwnProperty(date)) {
            dailyPriceTotal[date] += items.price;
        } else {
            dailyPriceTotal[date] = items.price;
        }
    }

    let sno = 1,
        tableData = Object.keys(formattedData).map((index) => {
            return (
                <div className='col-sm-4' key={index}>
                    <Card className='mt-3 shadow p-3 mb-5 bg-white rounded' style={{ minHeight: "300px" }}>
                        <Card.Header>
                            <h6>{index}</h6>
                            {(dailyCaloriesTotal[index] > calorieItems.calorieLimit) && <span className='text-danger'> Calorie Limit exceed for the Day!</span>}
                        </Card.Header>
                        <Card.Body>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Food</th>
                                        <th>Calories</th>
                                        <th>$Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formattedData[index].map(data => {
                                        sno++;
                                        return (
                                            <tr key={sno}>
                                                <td>{data.foodName}</td>
                                                <td>{data.calories}</td>
                                                <td>{data.price}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                        <Card.Footer>
                            <Stack direction="horizontal" gap={3} className='justify-content-end'>
                                Total:
                                <h5><Badge pill bg={(dailyCaloriesTotal[index] < calorieItems.calorieLimit) ? "success" : "danger"}>{dailyCaloriesTotal[index]} calories</Badge></h5>
                                <h5><Badge pill bg="success">${parseFloat(dailyPriceTotal[index]).toFixed(2)}</Badge></h5>
                            </Stack>
                        </Card.Footer>
                    </Card>
                </div >
            );
        });

    const calorieFiltersData = {
        totalCalories: monthlyCalories,
        totalPrice: parseFloat(monthlyCost).toFixed(2),
        calorieLimit: calorieItems.calorieLimit,
        priceLimit: calorieItems.priceLimit
    };

    return (
        <>
            {(calorieFiltersData.totalPrice > calorieFiltersData.priceLimit) && <Alert variant='danger'>Price limit exceeded for the month !</Alert>}
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                < CaloriesListFilters data={calorieFiltersData} setCalorieItems={setCalorieItems} />
                            </th>
                        </tr>
                    </thead>
                </Table>
                < CalorieAddForm setCalorieItems={setCalorieItems} />
                <div className='row'>
                    {tableData}
                    {tableData == "" && <div className='mt-5'><p className='text-center'>No Results Found!</p></div>}
                </div>
            </div>
        </>
    );
}

function fetchItems(setCalorieItems, currentUser) {
    let date = document.getElementById("filter-month").value;
    date = date.split("-");
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: currentUser.username,
            filterString: document.getElementById("filter-food").value,
            year: date[0],
            month: date[1],
        }),
    };

    fetch("http://localhost:8000/get-items", options).then(result => result.json()).then(result => {
        setCalorieItems(result);
    }).catch(error => console.error(error));
}
