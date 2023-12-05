import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, IconButton, TextField, Tooltip, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { BsClipboard } from 'react-icons/bs';


const BucketsPage = () => {

    const BackendURL = process.env.REACT_APP_API_URL;
    const [retriveCode, setRetrieveCode] = useState("")
    const navigate = useNavigate();
    const [codeBucket, setCodeBucket] = useState(null);
    const [newBucket, setNewBucket] = useState({ title: "", data: "" });
    let code = new URLSearchParams(window.location.search).get('code');
    const [notexist, setNotExist] = useState(false);

    useEffect(() => {
        // Get code variable from route

        if (code) {
            fetch(`${BackendURL}/bucket/${code}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    else {
                        setNotExist(true);
                        throw new Error('Invalid Credentials');
                    }
                })
                .then(data => {
                    console.log(data);
                    setCodeBucket(data.bucket);
                })
                .catch(err => {
                    console.log(err);
                    // alert('Couldnot Get the data');
                    alert('Bucket not found');
                });
        }
    }, []);


    // function isUrlOrEmail(input) {
    //     const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)\S*$/;
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (urlRegex.test(input)) {
    //         return 'url';
    //     } else if (emailRegex.test(input)) {
    //         return 'email';
    //     } else {
    //         return 'text';
    //     }
    // }

    // function replaceUrlsAndEmails(text) {
    //     // Regular expression to match URLs
    //     const urlRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/g;

    //     // Regular expression to match email addresses
    //     const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    //     console.log(text);

    //     return text.replace(urlRegex, (url) => (
    //         `<Link style={{
    //             textDecoration: 'none',
    //             color: '#1e90ff',
    //             fontSize: '1.5rem',
    //             wordBreak: 'break-all',
    //         }} key=${url} href=${url} target="_blank" rel="noopener noreferrer">
    //             ${url}
    //         </Link>`
    //     )).replace(emailRegex, (email) => (
    //         `<a style={{
    //             textDecoration: 'none',
    //             color: '#1e90ff',
    //             fontSize: '1.5rem',
    //             wordBreak: 'break-all',
    //         }} key=${email} href={mailto:${email}}>
    //             ${email}
    //         </a>`
    //     ));
    // }

    const replaceUrls = (text) => {

        // Split the text into parts: URL and non-URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const emailRegex = /\S+@\S+\.\S+/g;

        // text = ` Hi All,
        // https://github.com/rajeshds20
        // My name is rajesh https://linkedin.com/in/devangamsajjarajesh dsrajesh71@gmail.com
        // `

        // Split the text into parts: URL, email, and non-URL/non-email
        const parts = text.split(/(\s+|\b)(https?:\/\/[^\s]+|\S+@\S+\.\S+)(\s+|\b)/);

        // Map through the parts and render URLs and emails as anchors
        const renderedText = parts.map((part, index) => {
            if (part && part.match(urlRegex)) {
                // If it's a URL, render it as an anchor
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            } else if (part && part.match(emailRegex)) {
                // If it's an email, render it as a mailto link
                return (
                    <a key={index} href={`mailto:${part}`}>
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


    const handleInputChange = (e) => {
        setNewBucket({ ...newBucket, [e.target.name]: e.target.value })
    }

    const handleCopyCode = (copyText) => {
        navigator.clipboard.writeText(copyText);
        alert('Text Copied');
    };

    const handleCodeChange = (e) => {
        setRetrieveCode(e.target.value);
    }

    const handleCreation = () => {

        const title = newBucket.title;
        const data = newBucket.data;

        if (title === '' || data === '') {
            alert('Please fill all fields');
            return;
        }
        const bucket = {
            title,
            data
        };
        fetch(`${BackendURL}/bucket/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bucket),
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
                alert('Bucket Created')
                console.log(data);
                navigate(`/bucket/${data.bucket.code}`);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert('Invalid Credentials');
            });
    }

    return (
        <div>
            {/* Header */}
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        {/* Add menu icon or any other icon */}
                    </IconButton>
                    <Typography variant="h6">Buckets</Typography>
                    {/* Add any additional header elements or navigation here */}
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
                            navigate('/');
                        }}
                    >Home</button>
                </Toolbar>
            </AppBar>

            {/* Add 2 features, creating a bucket and generating code, and retriving a bucket based on code */}

            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    Create a Bucket
                </Typography>
                <div className="form">
                    <TextField
                        name="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "1rem" }}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="data"
                        label="Data"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ marginBottom: "1rem" }}
                        onChange={handleInputChange}
                    />
                    <Button type="submit" variant="contained" color="primary"
                        onClick={handleCreation}
                    >
                        {/* Create Bucket */}
                        <AddIcon />
                        Create
                    </Button>
                </div>
                <br />
                <br />

                <form
                    onSubmit={() => {
                        navigate(`/bucket/${retriveCode}`);
                        window.location.reload();
                    }}>
                    {/* Add Input box for entering code and go to bucket details from code */}
                    <Typography variant="h4" gutterBottom>
                        Retrieve a Bucket
                    </Typography>
                    <TextField
                        name="code"
                        label="Code"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "1rem" }}
                        onChange={handleCodeChange}
                    />
                    <Button type="submit" variant="contained" color="primary"
                        onClick={() => {
                            navigate(`/bucket/${retriveCode}`);
                            window.location.reload();
                        }}
                    >
                        Retrieve
                    </Button>
                </form>
            </Container>
        </div >
    );
};

export default BucketsPage;
