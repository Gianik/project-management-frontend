import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import REACT_APP_HOST_URL from '../config';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Axios from 'axios'
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    multilineColor: {
        color: '#52399B'
    },
    input: {
        color: "white"
    },
    root: {
        maxWidth: 300,
        backgroundColor: '#303049',
        color: '#FFFFFF',
    },
    root1: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100ch',
        },
    },
    root2: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
            height: '10ch',
        },
    },
    list: {
        width: '100%',
        maxWidth: 360,

    },
    media: {
        height: 140,
        backgroundColor: '#6265AF',
    },
    gridContainer: {
        paddingBottom: "5px",
    },
    gridContainer2: {
        paddingTop: "5px",
    },
    gridContainer3: {
        paddingTop: "5px",
    },
    cardContent: {
        marginLeft: "15px",
    },
    large: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    paper: {
        backgroundColor: '#1F1F32',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height: 500,
        marginLeft: 200
    },
    input: {
        color: "white"
    },
    inputRoot: {
        color: '#ACACAC',
    },
    box: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));
const backgroundColor = createMuiTheme({
    palette: {
        background: {
            default: "#303049"
        },
        primary: {
            main: "#1F1F32",
        },
        secondary: {
            main: "#52399B",
        },
    }
});

export default function ViewAnnouncement() {
    const { id } = useParams();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [date_updated, setDate] = useState("");
    const [name, setName] = useState("");
    const [iTitle, setITitle] = useState("")
    const [iContent, setIContent] = useState("")
    const [updateError, setupdateError] = useState("");
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [showUpdate, setShowUpdate] = React.useState(false)
    var ls = new SecureLS();
    let data = ls.get('data');
    let history = useHistory();


    React.useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {


        Axios.get(`${REACT_APP_HOST_URL}/api/announcement/${id}/detail`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                // console.log(response)
                setTitle(response.data.title)
                setContent(response.data.content)
                setDate(response.data.date_updated)
                setName(response.data.name)
                checkCredential(response.data.user_id)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error)
            })

    }
    const checkCredential = (creatorId) => {
        console.log(creatorId)
        console.log(data.userId)
        if (data.userId == creatorId) {
            setShowUpdate(true)
            console.log("i was here 1")
            return
        }
        setShowUpdate(false)
        console.log("i was here 2")
        return
        // 
        // return
    }

    const handleOpen = () => {
        setITitle(title)
        setIContent(content)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = e => {
        e.preventDefault()
        let temp = {
            title: iTitle,
            content: iContent,
            id: id,
        }
        const validate = validateUpdate()

        if (validate) {
            Axios.post(`${REACT_APP_HOST_URL}/api/announcement/edit`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token,
                }
            })
                .then(response => {
                    console.log(response)
                    setTitle("")
                    setContent("")
                    updateData()
                    handleClose()

                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    const validateUpdate = () => {
        if (iTitle === "" || iContent === "") {
            setupdateError("Please fill in all fields.")
            return false
        } else
            setupdateError("")
        return true
    }
    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid item xs={9}>
                        <Box
                            color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            fontSize={18}
                        >
                            Dashboard / Announcements / View Announcement
                        </Box>
                    </Grid>
                    <Grid item xs={4} className={classes.gridContainer}>
                        <Box
                            color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            fontSize={18}
                        >
                            <Typography variant="h6">Announcement Overview</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box

                            display="flex"
                            flexDirection="column"
                            border={1}
                            borderRadius={10}
                            p={2}
                            borderColor="#1F1F32"
                            bgcolor="primary.main"
                        >
                            <Typography>
                                <Box
                                    color="#A0A0A0"
                                    marginLeft={1}
                                    fontWeight="fontWeightRegular"
                                >
                                    Announcement Name
                                </Box>
                                <Box
                                    color="#FFFFFF"
                                    marginLeft={1}
                                    fontWeight="fontWeightLight"
                                >
                                    {title}
                                </Box>
                            </Typography>
                            <Grid container spacing={12}>
                                <Grid item xs={2}>
                                    <Typography >
                                        <Box
                                            color="#A0A0A0"
                                            marginLeft={1}
                                            fontWeight="fontWeightRegular"
                                            paddingTop={2}
                                        >
                                            Date
                                        </Box>
                                        <Box
                                            color="#FFFFFF"
                                            marginLeft={1}
                                            fontWeight="fontWeightLight"
                                        >
                                            {date_updated}
                                        </Box>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography align="justify">
                                <Box
                                    color="#A0A0A0"
                                    marginLeft={1}
                                    fontWeight="fontWeightRegular"
                                    paddingTop={2}
                                >
                                    Description
                                </Box>
                                <Box
                                    color="#FFFFFF"
                                    marginLeft={1}
                                    fontWeight="fontWeightLight"
                                >
                                    {content}
                                </Box>
                            </Typography>
                            <p></p>
                            <Grid item xs={5}>
                                {showUpdate && (
                                    <Button

                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        type="button"
                                        onClick={handleOpen}
                                    >
                                        Update Announcement
                                    </Button>)}
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="caption">

                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                className={classes.modal}
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={open}>
                                    <div className={classes.paper}>
                                        <Grid item xs={9}>
                                            <Box
                                                className={classes.box}
                                                color="#FFFFFF"
                                                display="flex"
                                                fontWeight="fontWeightRegular"
                                                fontSize={18}
                                                flexDirection="left"
                                            >
                                                Dashboard / Management / Announcement
                                            </Box>
                                        </Grid>
                                        <Box
                                            color="red"
                                            display="flex"
                                            fontSize={16}
                                            fontWeight="fontWeightRegular"
                                            marginBottom={1}
                                            marginLeft={1}
                                            flexDirection="column"
                                        >
                                            {updateError}
                                        </Box>
                                        <form className={classes.root1} noValidate autoComplete="off" onSubmit={handleSubmit} >
                                            <TextField
                                                variant="filled"
                                                id="outlined-basic"
                                                label="Name"
                                                color="secondary"
                                                name="announceName"
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.inputRoot
                                                }}
                                                onChange={e => setITitle(e.target.value)}
                                                value={iTitle}
                                            />
                                            <br />
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                color="secondary"
                                                multiline
                                                rows={10}
                                                variant="filled"
                                                name="desc"
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.inputRoot
                                                }}
                                                onChange={e => setIContent(e.target.value)}
                                                value={iContent}
                                            />
                                            <Grid item xs={4} >

                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    value="Submit"
                                                >
                                                    Update Announcement
                                                    </Button>
                                            </Grid>
                                        </form>
                                    </div>
                                </Fade>
                            </Modal>

                        </Typography>

                    </Grid>

                    <Grid item xs={3} className={classes.gridContainer2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            component={Link}
                            to="/Announcement"
                        >
                            Back to Announcements
                        </Button>
                    </Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );
}