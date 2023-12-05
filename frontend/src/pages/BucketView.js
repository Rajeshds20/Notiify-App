import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, IconButton, Tooltip, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BsClipboard } from 'react-icons/bs';


const BucketViewPage = () => {

    const BackendURL = process.env.REACT_APP_API_URL;
    const [retriveCode, setRetrieveCode] = useState("")
    const navigate = useNavigate();
    const [codeBucket, setCodeBucket] = useState(null);
    let code = window.location.href.split('/')[4];

    useEffect(() => {
        // Get code variable from route

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
    }, []);

    const replaceUrls = (text) => {

        // Split the text into parts: URL and non-URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const emailRegex = /\S+@\S+\.\S+/g;

        // text = ` Hi All,
        // https://github.com/rajeshds20
        // My name is rajesh https://linkedin.com/in/devangamsajjarajesh dsrajesh71@gmail.com
        // `

        // Split the text into parts: URL, email, and non-URL/non-email
        const parts = text?.split(/(\s+|\b)(https?:\/\/[^\s]+|\S+@\S+\.\S+)(\s+|\b)/);

        // Map through the parts and render URLs and emails as anchors
        const renderedText = parts?.map((part, index) => {
            if (part && part.match(urlRegex)) {
                // If it's a URL, render it as an anchor
                // If it is a new line then insert break
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

    const handleCopyCode = (copyText) => {
        navigator.clipboard.writeText(copyText);
        alert('Text Copied');
    };

    const handleCodeChange = (e) => {
        setRetrieveCode(e.target.value);
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

            <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '2rem' }}>
                {/* Code Bucket */}
                {
                    codeBucket ? (
                        <>
                            <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    style={{ marginBottom: '1rem', color: '#1e90ff', fontSize: '2rem', fontWeight: 'bold' }}
                                >
                                    Code
                                </Typography>
                                <Typography
                                    variant="outlined"
                                    fullWidth
                                    style={{ cursor: 'pointer', color: '#1e90ff', fontSize: '2rem', wordBreak: 'break-all' }}
                                    onClick={() => handleCopyCode(codeBucket?.code)}
                                >
                                    {codeBucket?.code}
                                </Typography>
                                <Tooltip title="Copy Code" arrow>
                                    <IconButton onClick={() => handleCopyCode(codeBucket?.code)} color="black" style={{ marginTop: '-15px' }}>
                                        <BsClipboard size={25} />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                            <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e90ff', fontSize: '1.8rem', fontWeight: 'bold' }}>
                                    Bucket Details
                                </Typography>
                                <Typography variant="h3" gutterBottom style={{ marginTop: '1rem' }}>
                                    {codeBucket?.title}
                                </Typography>

                                <div style={{
                                    border: '1px solid #1e90ff',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    marginTop: '1rem',
                                    color: '#1e90ff',
                                    fontSize: '1.5rem',
                                    wordBreak: 'break-all',
                                    backgroundColor: 'rgb(218, 203, 203)',
                                }}>
                                    <Typography variant="h4" gutterBottom style={{ marginTop: '1rem' }}>
                                        {replaceUrls(codeBucket?.content)}
                                    </Typography>
                                </div>

                                <Tooltip title="Copy Content" arrow>
                                    <IconButton
                                        onClick={() => handleCopyCode(codeBucket?.content)}
                                        color="primary"
                                        style={{ marginTop: '0px' }}
                                    >
                                        <BsClipboard size={25} />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </>
                    ) : (
                        <div>
                            <h1>Bucket not found</h1>
                        </div>
                    )
                }
                <br />
                <br />
                <form
                    onSubmit={() => {
                        navigate(`/bucket/${retriveCode}`);
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
                        }}
                    >
                        Retrieve
                    </Button>
                </form>
                <br />
                <br />
            </Container>
        </div >
    );
};

export default BucketViewPage;
