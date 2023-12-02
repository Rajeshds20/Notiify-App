import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, AppBar, Toolbar, IconButton, TextField, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { BsClipboard } from 'react-icons/bs';

const BucketsPage = () => {

    const BackendURL = process.env.REACT_APP_API_URL;
    const [retriveCode, setRetrieveCode] = useState("")
    const navigate = useNavigate();
    const [codeBucket, setCodeBucket] = useState(null);
    const [newBucket, setNewBucket] = useState({ title: "", data: "" });
    const code = new URLSearchParams(window.location.search).get('code');

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
                });
        }
    }, []);


    const handleInputChange = (e) => {
        setNewBucket({ ...newBucket, [e.target.name]: e.target.value })
    }

    const handleCopyCode = (copyText) => {
        navigator.clipboard.writeText(copyText);
        alert('Code Copied');
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
                navigate(`/bucket?code=${data.bucket.code}`);
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
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        {/* Add menu icon or any other icon */}
                    </IconButton>
                    <Typography variant="h6">Buckets</Typography>
                    {/* Add any additional header elements or navigation here */}
                </Toolbar>
            </AppBar>


            {/* Add 2 features, creating a bucket and generating code, and retriving a bucket based on code */}
            {codeBucket ? (
                <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Typography
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '1rem',
                            cursor: 'pointer',
                            color: 'blue',
                            fontSize: '2rem',
                        }}
                        onClick={() => { handleCopyCode(codeBucket?.code) }}
                    >
                        {codeBucket?.code}
                    </Typography>
                    <Tooltip title="Copy Code" arrow>
                        <IconButton onClick={() => { handleCopyCode(codeBucket?.code) }} color="primary">
                            <BsClipboard size={30} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h4" gutterBottom>
                        Bucket
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {codeBucket?.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {codeBucket?.content}
                    </Typography>
                    <Tooltip title="Copy Content" arrow>
                        <IconButton onClick={() => { handleCopyCode(codeBucket?.content) }} color="primary">
                            <BsClipboard size={30} />
                        </IconButton>
                    </Tooltip>

                </Container>
            ) : (
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

                    <div>
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
                                navigate(`/bucket?code=${retriveCode}`);
                                window.location.reload();
                            }}
                        >
                            Retrieve
                        </Button>
                    </div>
                </Container>
            )}

        </div>
    );
};

export default BucketsPage;
