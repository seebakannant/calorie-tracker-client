import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function LoginForm() {
    const [alerts, setAlert] = useState(null),
        [loginStatus, setLoginStatus] = useCookies(['loginStatus']),
        [, setCurrentUser] = useCookies(['username']),
        navigate = useNavigate();

    useEffect(() => {
        if (loginStatus.loginStatus === true) {
            navigate("/home");
        }
    }, [navigate, loginStatus]);

    return (
        <div>
            {alerts}
            <Card className="text-center">
                <Card.Header>User Login</Card.Header>
                <Card.Body>
                    <Form className="form user-inputs" id="login-form" autoComplete="off" onSubmit={(event) => handleLoginForm(event, setAlert, setLoginStatus, setCurrentUser)}>
                        <Stack direction="vertical" gap={3}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                                <Form.Control type="text" id="username" required />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                                <Form.Control type="password" id="password" required />
                            </InputGroup>
                        </Stack>
                        <br></br>
                        <Stack direction="vertical" >
                            <Link to={{
                                pathname: '/sign-up',
                                state: {}
                            }} >New User? Sign Up!</Link>
                        </Stack>
                        <br></br>
                        <Stack direction="horizontal" >
                            <Form.Group className="mx-auto">
                                <Button type="submit" variant="primary">Log in</Button>{' '}
                            </Form.Group>
                        </Stack>
                    </Form >
                </Card.Body>
            </Card>
        </div>
    );
}

function handleLoginForm(event, setAlert, setLoginStatus, setCurrentUser) {
    event.preventDefault();
    const payload = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    },
        options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

    fetch("http://localhost:8000/auth", options).then(result => result.json()).then(response => {
        setAlert(
            <>
                <Alert variant={response.status ? "primary" : "danger"}>
                    {response.message}
                </Alert>
            </>
        );

        setLoginStatus("loginStatus", response.status, { path: '/', maxAge: 3600 });
        setCurrentUser("username", payload.username, { path: '/', maxAge: 3600 });
    }).catch(error => console.log(error));
}
