import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function SignupForm() {
    const [alerts, setAlert] = useState(null),
        [signInStatus, setSignInStatus] = useState(false),
        [loginStatus] = useCookies(['loginStatus']),
        navigate = useNavigate();

    useEffect(() => {
        if (loginStatus.loginStatus === true) {
            navigate("/home");
        }
    }, [navigate, loginStatus]);

    useEffect(() => {
        if (signInStatus === true) {
            navigate("/login");
        }
    }, [navigate, signInStatus]);

    return (
        <div>
            {alerts}
            <Card className="text-center">
                <Card.Header>Sign Up</Card.Header>
                <Card.Body>
                    <Form className="form user-inputs" id="sign-up-form" autoComplete="off" onSubmit={(event) => handleSignupForm(event, setAlert, setSignInStatus)}>
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
                                pathname: '/login',
                                state: {}
                            }} >Already a user? Login here</Link>
                        </Stack>
                        <br></br>
                        <Stack direction="horizontal" >
                            <Form.Group className="mx-auto">
                                <Button type="submit" variant="primary">Sign up</Button>{' '}
                            </Form.Group>
                        </Stack>
                    </Form >
                </Card.Body>
            </Card>
        </div>
    );
}

function handleSignupForm(event, setAlert, setSignInStatus) {
    event.preventDefault();
    const payload = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    fetch("http://localhost:8000/create-user", options).then(result => result.json()).then(response => {
        console.log(response);
        setAlert(
            <>
                <Alert variant={response.status ? "primary" : "danger"} >
                    {response.message}
                </Alert>
            </>
        );

        setSignInStatus(response.status);
    }).catch(error => console.log(error));
}
