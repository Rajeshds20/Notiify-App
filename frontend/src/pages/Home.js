/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Container, Fab, IconButton, Toolbar, Typography, Paper, TextField } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";
import { Card, CardContent, CardActions } from "@mui/material";
// import { Delete as DeleteIcon } from "@mui/icons-material";
import { BsFillPlusSquareFill, BsPencilSquare, BsFillBookmarkCheckFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

function Login() {

    const BackendURL = 'https://to-do-list-backend-z3hx.onrender.com';

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        else {
            fetch(`${BackendURL}/notes/all`, {
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
                    else {
                        throw new Error('Invalid Credentials');
                    }
                })
                .then(data => {
                    console.log(data);
                    setMyNotes(data.notes);
                })
                .catch(err => {
                    console.log(err);
                    alert('Login Expired');
                    localStorage.removeItem('token');
                    navigate('/login');
                    window.location.reload();
                    return;
                });
        }
    }, []);

    const [myNotes, setMyNotes] = useState([]);
    const [updating, setUpdating] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleDelete = (note) => {
        setMyNotes(myNotes.filter((n) => n._id !== note._id));
        fetch(`${BackendURL}/notes/${note._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    }



    const NoteCard = ({ note, setUpdating }) => {
        return (
            <Card sx={{ marginBottom: "1rem" }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {note.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {note.content}
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
                </CardActions>
            </Card >
        );
    };

    const UpdateNoteCard = ({ note, setMyNotes, myNotes }) => {
        const [title1, setTitle1] = useState(note.title);
        const [content1, setContent1] = useState(note.content);
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
                        onClick={(event) => {
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
                            fetch(`${BackendURL}/notes/${note._id}`, {
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
                        }}>
                        <BsFillBookmarkCheckFill title="Save" color="green" />
                    </IconButton>
                </CardActions>
            </Card >
        );
    };

    return (
        <div>
            <div>
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
                        <Fab color="primary" aria-label="add" onClick={() => {
                            if (title === '' || content === '') {
                                alert('Please fill all fields');
                                return;
                            }
                            const note = {
                                title,
                                content
                            };
                            setMyNotes([...myNotes, { ...note, _id: 123456789 }]);
                            fetch(`${BackendURL}/notes/new`, {
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
                        }}>
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
            </div>
            {/* <h1>Home Page</h1>
            <br />
            <br />
            <h3>Add Notes</h3>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.target);
                    const title = data.get('title');
                    const content = data.get('content');
                    if (title === '' || content === '') {
                        alert('Please fill all fields');
                        return;
                    }
                    const note = {
                        title,
                        content
                    };
                    setMyNotes([...myNotes, note]);
                    fetch('http://localhost:5000/notes/new', {
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
                        })
                        .catch(err => {
                            console.log(err);
                            alert('Invalid Credentials');
                        });
                }}
            >
                <label htmlFor="title">Title</label>
                <input name="title" id="title" />
                <label htmlFor="content">Content</label>
                <input name="content" id="content" />
                <button type="submit">Add Note</button>
            </form>

            <br />
            <h2>Your Notes</h2>
            <br />
            {
                myNotes.map((note, index) => {
                    if (index === updating) {
                        return (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    const data = new FormData(event.target);
                                    const title = data.get('title');
                                    const content = data.get('content');
                                    if (title === '' || content === '') {
                                        alert('Please fill all fields');
                                        return;
                                    }
                                    // Update the previous note with the same id
                                    setMyNotes(myNotes.map((n) => {
                                        if (n._id === note._id) {
                                            return {
                                                ...n,
                                                title,
                                                content
                                            }
                                        }
                                        else return n;
                                    }));
                                    fetch(`http://localhost:5000/notes/${note._id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'Bearer ' + token
                                        },
                                        body: JSON.stringify({ title: title, content: content }),
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
                                }}
                                key={index}
                            >
                                <label htmlFor="title">Title</label>
                                <input name="title" id="title" defaultValue={note.title} />
                                <label htmlFor="content">Content</label>
                                <input name="content" id="content" defaultValue={note.content} />
                                <button type="submit">Update Note</button>
                            </form>
                        )
                    }
                    else {
                        return (
                            <div key={index}>
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                                <button
                                    onClick={() => {
                                        handleDelete(note);
                                    }}
                                >Delete</button>
                                <button
                                    onClick={() => {
                                        setUpdating(index);
                                    }}
                                >Edit</button>
                            </div>
                        )
                    }
                })
            } */}
        </div >
    );
}

export default Login;
