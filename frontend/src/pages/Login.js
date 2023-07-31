/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, Link, Paper, TableFooter } from "@mui/material";


function Login() {

    const BackendURL = 'https://to-do-list-backend-z3hx.onrender.com';

    const navigate = useNavigate();
    const [section, setSection] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate("/");
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get('username');
        const password = data.get('password');
        if (username === '' || password === '') {
            alert('Please fill all fields');
            return;
        }
        const user = {
            mailid: username,
            password
        };
        fetch(`${BackendURL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
                else {
                    throw new Error('Invalid Credentials');
                }
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                alert('Login Successful')
                console.log(data);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                alert('Invalid Credentials');
            });
    }

    const handleSubmit2 = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get('username');
        const password = data.get('password');
        if (username === '' || password === '') {
            alert('Please fill all fields');
            return;
        }
        const user = {
            mailid: username,
            password
        };
        fetch(`${BackendURL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
                else {
                    throw new Error('Invalid Credentials');
                }
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                alert('Login Successful')
                console.log(data);
                navigate('/admin');
            })
            .catch(err => {
                console.log(err);
                alert('Invalid Credentials');
            });
    }

    return (
        <div>
            <Container maxWidth="sm">
                <Box sx={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        <b>Login</b>
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                        <Typography
                            variant={section === 0 ? "h5" : "h6"}
                            style={{
                                cursor: "pointer",
                                color: section === 0 ? "blue" : "black"
                            }}
                            onClick={() => {
                                setSection(0);
                            }}
                        >
                            <b>User</b>
                        </Typography>
                        <Typography
                            variant={section === 1 ? "h5" : "h6"}
                            style={{
                                cursor: "pointer",
                                color: section === 1 ? "blue" : "black",
                                marginLeft: "5.5rem"
                            }}
                            onClick={() => {
                                setSection(1);
                            }}
                        >
                            <b>Admin</b>
                        </Typography>
                    </Box>
                    <Paper sx={{
                        padding: "1rem",
                        width: "100%",
                        border: "1px solid #333", // Custom border style
                        borderRadius: "8px", // Rounded corners
                    }}>
                        {section === 0 ? (
                            <form onSubmit={handleSubmit} className="form">
                                <Typography variant="h5" gutterBottom>
                                    User Login
                                </Typography>
                                <TextField
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginBottom: "1rem" }}
                                />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginBottom: "1rem" }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit2} className="form">
                                <Typography variant="h5" gutterBottom>
                                    Admin Login
                                </Typography>
                                <TextField
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginBottom: "1rem" }}
                                />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginBottom: "1rem" }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </form>
                        )}
                    </Paper>
                </Box>
            </Container>
            <br />
            <br />
            {/* Suggest to Register */}
            <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
                Don't have an account?  <Link href="/register"> Register</Link>
            </Typography>
            <br />
            <br />
            <br />
            <br />
            <br />
            <TableFooter style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                <Typography variant="body2" color="textSecondary" align="center">
                    Made with ❤️ by <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">Rajesh</a>
                </Typography>
            </TableFooter>
            {/* <h1>Login</h1>
            <br />
            <h3
                onClick={() => {
                    setSection(0);
                }}
            >User</h3>
            <h2
                onClick={() => {
                    setSection(1);
                }}
            >Admin</h2>
            {
                section === 0 ?
                    <form onSubmit={handleSubmit} className="form">
                        <h3>User Login</h3>
                        <label htmlFor="username">Username</label>
                        <input name="username" id="usename" />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" />
                        <button type="submit">Login</button>
                    </form>
                    :
                    <form onSubmit={handleSubmit2} className="form">
                        <h3>Admin Login</h3>
                        <label htmlFor="username">Username</label>
                        <input name="username" id="usename" />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" />
                        <button type="submit">Login</button>
                    </form>
            } */}
        </div>
    );
}

export default Login;
