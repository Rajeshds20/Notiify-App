import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, Paper, Link } from "@mui/material";


function Register(props) {

    const BackendURL = 'https://to-do-list-backend-z3hx.onrender.com';

    const navigate = useNavigate();

    // console.log(props.user);
    const user = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        if (data.get('username') === '' || data.get('password1') === '' || data.get('password2') === '') {
            alert("Please fill out all fields");
            return;
        }
        if (data.get('password1') !== data.get('password2')) {
            alert("Passwords do not match");
            return;
        }
        const content = {
            mailid: data.get("username"),
            password: data.get("password1"),
        }
        console.log(content);
        // Post Request to http://localhost:5000/user/register
        fetch(`${BackendURL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        })
            .then(res => {
                if (res.status === 403) {
                    return alert('Username already exists, try changng it')
                }
                else return res.json();
            })
            .then(out => {
                console.log(out, out.token);
                alert('Registration successful');
                localStorage.setItem('token', out.token);
                props.setUser(out.token);
                return navigate('/');
            })
            .catch(err => {
                console.log(err);
                return alert('Registration Failed !!!')
            })
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Box sx={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h4" gutterBottom className="head">
                        <b>User Registration</b>
                    </Typography>
                    <Paper sx={{ padding: "1rem", width: "100%", border: "2px solid #333", borderRadius: "8px" }}>
                        <form onSubmit={handleSubmit} className="form">
                            <TextField
                                name="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                className="input"
                                sx={{ marginBottom: "1rem" }}
                            />
                            <TextField
                                name="password1"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                className="input"
                                sx={{ marginBottom: "1rem" }}
                            />
                            <TextField
                                name="password2"
                                label="Confirm Password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                className="input"
                                sx={{ marginBottom: "1rem" }}
                            />
                            <Button type="submit" variant="contained" color="primary" className="button">
                                Register
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Container>
            <br />
            <br />
            {/* Suggest to login if already have account */}
            <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
                Already have an account?  <Link href="/login"> Login</Link>
            </Typography>
        </div>

        // <div>
        //     <h1 className="head">Register</h1>
        //     <form onSubmit={handleSubmit} className="form">
        //         <label className="label">Username</label>
        //         <input name="username" className="input" type="text" />
        //         <label className="label">Password</label>
        //         <input name="password1" className="input" type="password" />
        //         <label className="label">Confirm Password</label>
        //         <input name="password2" className="input" type="password" />
        //         <button type="submit" className="button">Register</button>
        //     </form>
        // </div>
    );
}

export default Register;
