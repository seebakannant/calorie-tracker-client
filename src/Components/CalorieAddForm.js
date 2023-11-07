import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import { useCookies } from 'react-cookie';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

export default function CalorieAddForm({ setCalorieItems }) {
    const [currentUser] = useCookies(['username']),
        [showCalorieAddModal, setShowCalorieAddModal] = useState(false),
        [showAlert, setShowAlert] = useState(false),
        handleModalClose = () => setShowCalorieAddModal(false),
        handleModalShow = () => setShowCalorieAddModal(true);

    return (
        <div>
            {showAlert && <div>
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    <p>New Item added successfully !</p>
                </Alert>
            </div>}
            <div className="text-center">
                <Button variant="outline-success" onClick={handleModalShow} >
                    Add New food
                </Button>
            </div>
            <Modal show={showCalorieAddModal} onHide={handleModalClose} id="add-food-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Enter new item to track calories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="form user-inputs" onSubmit={(event) => handleFormSubmit(event, setCalorieItems, currentUser, setShowCalorieAddModal, setShowAlert)} id="calorie-form" autoComplete="off" >
                        <Stack direction="vertical" gap={3}>
                            <Form.Group>
                                <Form.Label htmlFor="food-name">Food Name: </Form.Label>
                                <Form.Control type="text" id="food-name" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="date">Date: </Form.Label>
                                <Form.Control type="datetime-local" id="date" required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="calories">Calories: </Form.Label>
                                <Form.Control type="number" id="calories" min={0} required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="price">Price: </Form.Label>
                                <Form.Control type="number" id="price" min={0} step={0.01} required />
                            </Form.Group>
                        </Stack>
                        <br></br>
                        <Stack direction="horizontal" >
                            <Form.Group className="mx-auto">
                                <Button type="submit" size="sm" variant="outline-success">Add Food Item</Button>{' '}
                            </Form.Group>
                        </Stack>
                    </Form >
                </Modal.Body>
            </Modal>
        </div>
    );
}

function handleFormSubmit(event, setCalorieItems, currentUser, setShowCalorieAddModal, setShowAlert) {
    event.preventDefault();
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: currentUser.username,
            food_name: document.getElementById("food-name").value,
            date: document.getElementById("date").value,
            calories: document.getElementById("calories").value,
            price: document.getElementById("price").value
        }),
    };

    fetch("http://localhost:8000/save", options).then(result => result.json()).then(result => {
        document.getElementById("calorie-form").reset();
        fetchItems(currentUser, setCalorieItems);
        setShowCalorieAddModal(false);
        setShowAlert(true);
    }).catch(error => console.log(error));
}

function fetchItems(currentUser, setCalorieItems) {
    let date = document.getElementById("filter-month").value;
    date = date.split("-");

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: currentUser.username,
            year: date[0],
            month: date[1],
            filterString: document.getElementById("filter-food").value
        })
    };

    fetch("http://localhost:8000/get-items", options).then(result => result.json()).then(result => {
        setCalorieItems(result);
    }).catch(error => console.error(error));
}
