import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useCookies } from 'react-cookie';
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';

export default function AppNavbar() {
    const [currentUser] = useCookies(['username']),
        [, setLoginStatus] = useCookies(['loginStatus']);

    return (
        <Navbar bg="success" data-bs-theme="dark" className='sticky-top'>
            <Container>
                <Navbar.Brand href="/home">CALORIE TRACKER</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Stack direction="horizontal" gap={3}>
                        <Navbar.Text>
                            Signed in as:
                            <Link to={{
                                pathname: '/home',
                                state: {}
                            }} >  {currentUser.username}</Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button type="button" variant="light" size='sm' onClick={(event) => handleLogout(event, setLoginStatus)}>Logout</Button>{' '}
                        </Navbar.Text>
                    </Stack>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function handleLogout(event, setLoginStatus) {
    if (window.confirm("Do you really want to logout?")) {
        setLoginStatus("loginStatus", false, { path: '/' });
    }
}
