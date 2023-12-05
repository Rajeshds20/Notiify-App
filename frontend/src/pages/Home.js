/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Container, Fab, IconButton, Toolbar, Typography, Paper, TextField, TableFooter, Button } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
import { Card, CardContent, CardActions } from "@mui/material";
// import { Delete as DeleteIcon } from "@mui/icons-material";
import { BsFillPlusSquareFill, BsPencilSquare, BsFillBookmarkCheckFill, BsClipboard2, BsFillClipboard2CheckFill, BsFillClipboard2Fill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

function Login() {

    const API_URL = process.env.REACT_APP_API_URL;

    const [loggedIn, setLoggedIn] = useState(false);
    const [myNotes, setMyNotes] = useState([]);
    const [updating, setUpdating] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [copiedText, setCopiedText] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setLoggedIn(false);
        }
        else {
            setLoggedIn(true);
            fetch(`${API_URL}/notes/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    else if (res.status === 401) {
                        // alert(res);
                        alert('Login Expired');
                        localStorage.removeItem('token');
                        navigate('/login');
                        window.location.reload();
                    }
                })
                .then(data => {
                    console.log(data);
                    setMyNotes(data.notes);
                })
                .catch(err => {
                    // alert(err);
                    console.log(err);
                    alert('Log In Failed');
                    localStorage.removeItem('token');
                    navigate('/login');
                    window.location.reload();
                    return;
                });
        }
    }, []);

    const handleDelete = (note) => {
        setMyNotes(myNotes.filter((n) => n._id !== note._id));
        fetch(`${API_URL}/notes/${note._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    }

    const handleCreation = () => {
        if (title === '' || content === '') {
            alert('Please fill all fields');
            return;
        }
        const note = {
            title,
            content
        };
        setMyNotes([...myNotes, { ...note, _id: 123456789 }]);
        fetch(`${API_URL}/notes/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(note),
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
                console.log(data);
                myNotes.forEach((n) => {
                    if (n._id === 123456789) {
                        n._id = data.newNote._id;
                    }
                });
            })
            .catch(err => {
                console.log(err);
                alert('Invalid Credentials');
            });
        setTitle('');
        setContent('');
    }

    const replaceUrls = (text) => {

        // Split the text into parts: URL and non-URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const emailRegex = /\S+@\S+\.\S+/g;

        // Split the text into parts: URL, email, and non-URL/non-email
        const parts = text?.split(/(\s+|\b)(https?:\/\/[^\s]+|\S+@\S+\.\S+)(\s+|\b)/);

        // Map through the parts and render URLs and emails as anchors
        const renderedText = parts?.map((part, index) => {
            if (part && part.match(urlRegex)) {
                // If it's a URL, render it as an anchor
                // If it is a new line then insert break
                return (
                    <a key={index} href={part} style={{ fontSize: '18px', textAlign: 'center' }} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            } else if (part && part.match(emailRegex)) {
                // If it's an email, render it as a mailto link
                return (
                    <a key={index} href={`mailto:${part}`} style={{ fontSize: '18px', textAlign: 'center' }}>
                        {part}
                    </a>
                );
            } else {
                // If it's neither a URL nor an email, render it as plain text
                return part;
            }
        });
        return renderedText;
    }

    const NoteCard = ({ note, setUpdating }) => {
        return (
            <Card sx={{ marginBottom: "1rem" }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {note.title}
                    </Typography>
                    <Typography variant="head2" color="textSecondary">
                        {/* {note.content} */}
                        {replaceUrls(note.content)}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton
                        title="Delete"
                        onClick={() => {
                            handleDelete(note);
                        }} color="error">
                        <AiFillDelete />
                    </IconButton>
                    <IconButton
                        title="Update"
                        onClick={() => {
                            setUpdating(note._id);
                        }} color="primary">
                        <BsPencilSquare />
                    </IconButton>
                    <IconButton
                        title="Copy"
                        onClick={() => {
                            navigator.clipboard.writeText(note.content);
                            setCopiedText(note);
                            setTimeout(() => {
                                setCopiedText(false);
                            }, 1500);
                            // alert('Text Copied');
                        }} color="primary">
                        {
                            copiedText._id === note._id ? <BsFillClipboard2CheckFill /> : <BsClipboard2 />
                        }
                    </IconButton>
                </CardActions>
            </Card >
        );
    };

    const UpdateNoteCard = ({ note, setMyNotes, myNotes }) => {
        const [title1, setTitle1] = useState(note.title);
        const [content1, setContent1] = useState(note.content);

        const handleUpdate = (event) => {
            event.preventDefault();
            if (title1 === '' || content1 === '') {
                alert('Please fill all fields');
                return;
            }
            // Update the previous note with the same id
            setMyNotes(myNotes => myNotes.map((n) => {
                if (n._id === updating) {
                    return {
                        ...n,
                        title: title1,
                        content: content1
                    }
                }
                else return n;
            }));
            fetch(`${API_URL}/notes/${note._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ title: title1, content: content1 }),
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
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                    alert('Invalid Credentials');
                });
            setUpdating(null);
        }

        return (
            <Card sx={{ marginBottom: "1rem" }}>
                <CardContent>
                    {/* Editable Title and Content */}
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title1}
                        onChange={(e) => setTitle1(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={content1}
                        onChange={(e) => setContent1(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                    />
                </CardContent>
                <CardActions>
                    <IconButton
                        title="Save"
                        onClick={handleUpdate}>
                        <BsFillBookmarkCheckFill title="Save" color="green" />
                    </IconButton>
                </CardActions>
            </Card >
        );
    };

    return (
        <div>
            {loggedIn ?
                (<div>
                    <AppBar position="static">
                        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h4"><b>Notiify</b> App</Typography>
                            <div>
                                <button
                                    style={{
                                        marginRight: "1rem",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "white",
                                        fontSize: "1.2rem",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        navigate('/bucket');
                                    }}
                                >Buckets</button>
                                <button
                                    style={{
                                        marginRight: "1rem",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "white",
                                        fontSize: "1.2rem",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                        window.location.reload();
                                    }}
                                >Logout</button>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Container maxWidth="sm" sx={{ marginTop: "2rem", paddingBottom: "5rem" }}>
                        <Paper sx={{ padding: "1rem" }}>
                            <Typography variant="h5" gutterBottom>
                                Create a Note
                            </Typography>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ marginBottom: "1rem" }}
                            />
                            <TextField
                                label="Content"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                sx={{ marginBottom: "1rem" }}
                            />
                            <Fab color="primary" aria-label="add" onClick={handleCreation}>
                                <BsFillPlusSquareFill size={34} />
                            </Fab>
                        </Paper>
                        <div sx={{ marginTop: "2rem" }}>
                            {myNotes.map((note, index) => {
                                if (note._id === updating) {
                                    return (<UpdateNoteCard key={index} note={note} setMyNotes={setMyNotes} setUpdating={setUpdating} myNotes={myNotes} />);
                                }
                                else {
                                    return (<NoteCard key={index} note={note} setUpdating={setUpdating} />);
                                }
                            }
                            )}
                        </div>
                    </Container>
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
                </div>)
                :
                (<div>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6">Notify App</Typography>
                            {/* Add any additional header elements or navigation here */}
                        </Toolbar>
                    </AppBar>

                    {/* Main Content */}
                    <Container style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            Welcome to Notify App
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Notify App allows you to store notes securely and access them anywhere. Simply register or log in to get started!
                        </Typography>

                        {/* Login and Signup Buttons */}
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{ marginLeft: '10px' }}
                                onClick={() => {
                                    navigate('/register');
                                }}
                            >
                                Signup
                            </Button>
                        </div>

                        {/* Buckets Section */}
                        <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>
                            Buckets
                        </Typography>
                        <Card style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
                            <CardContent>
                                <Typography variant="body1" paragraph>
                                    Buckets feature allows you to store text or links. Use the provided code to retrieve your data.
                                </Typography>
                                {/* Add more details about Buckets if needed */}
                            </CardContent>
                        </Card>

                        {/* Button to Navigate to Buckets Section */}
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: '30px' }}
                            onClick={() => {
                                navigate('/bucket');
                            }}
                        >
                            Go to Buckets
                        </Button>
                    </Container>

                    {/* Footer */}
                    <Container style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Typography variant="caption">
                            Contact : <Link href="mailto:darajesh71@gmail.com">dsrajesh71@gmail.com</Link>
                        </Typography>
                        {/* Add more contact links or information */}
                        <TableFooter style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Made with ❤️ by <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">Rajesh</a>
                            </Typography>
                        </TableFooter>
                    </Container>
                </div>
                )}
        </div >
    );
}

export default Login;
