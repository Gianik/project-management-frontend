import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DateFnsUtils from '@date-io/date-fns';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import ProjectData from './ProjectData';
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
    },
    multilineColor: {
        color: '#52399B'
    },
    paper: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
    },
    input: {
        color: "white"
    },
    input2: {
        color: "#6265AF"
    },
    root: {
        maxWidth: 300,
        backgroundColor: '#303049',
        color: '#FFFFFF',
    },
    formRoot: {
        '& > *': {
            margin: theme.spacing(1),
            width: '500px',
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
    paper3: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
    },
    gridContainer: {
        paddingBottom: "5px",
    },
    gridContainer2: {
        paddingTop: "5px",
    },
    cardContent: {
        marginLeft: "15px",
    },
    large: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    tab: {
        color: '#FFFFFF',
    },
    button: {
        marginRight: "15px",
    },
    container: {
        paddingBottom: "10px",
        paddingTop: "5px",
    },
    dialog: {
        marginLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    joined: {
        margin: theme.spacing(1),
    },
    inputRoot: {
        color: '#FFFFFF',
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
        error: {
            main: "#FFFFFF"
        },
    }
});



const priorities = [
    {
        label: "High",
    },
    {
        label: "Medium",
    },
    {
        label: "Low",
    },
    {
        label: "None",
    },
];


export default function ViewProject(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const { id } = useParams();
    const [projectDetails, setProjectDetails] = React.useState({});
    const [orgList, setOrgList] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [newManagerId, setNewManagerId] = React.useState(0);
    const [newTitle, setNewTitle] = React.useState("");
    const [newSDate, setNSDate] = React.useState(new Date());
    const [newFDate, setNFDate] = React.useState(new Date());
    const [newPriority, setNewPriority] = React.useState("");
    const [newDescription, setNewDescription] = React.useState("");
    const [delProject, setdelProject] = React.useState(false);
    // const [isInProject, setIsInProject] = React.useState(false);
    const [showJoinButton, setShowJoinButton] = React.useState(false);
    const [showLeaveButton, setShowLeaveButton] = React.useState(false);
    const [showEditButton, setShowEditButton] = React.useState(false);
    const [showDeleteButton, setShowDeleteButton] = React.useState(false);
    const [showChangeManagerButton, setShowChangeManagerButton] = React.useState(false);
    const [editErrorMsg, setEditErrorMsg] = React.useState("")
    var ls = new SecureLS();
    let data = ls.get('data');
    let history = useHistory()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //For delete task
    const openDelete = () => {
        setdelProject(true);
    };
    const closeDelete = () => {
        setdelProject(false);
    };

    //For Edit Project
    const [editProject, setEditProject] = React.useState(false);
    React.useEffect(() => {
        loadData()
    }, [])
    const loadData = () => {
        Axios.get(`${REACT_APP_HOST_URL}/api/projectDetail/${id}/${data.userId}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {


                setProjectDetails(response.data[0])
                setOrgList(response.data[1])
                checkCredentials(response.data[2], response.data[0].user_id)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error)
            })


    }
    const checkCredentials = (isInProject, managerId) => {

        if (isInProject == false) {
            setShowJoinButton(true)
            if (data.role === "ADMIN") {

                setShowEditButton(true)
                setShowDeleteButton(true)

            }
            if (data.userId == managerId) {
                setShowEditButton(true)
                setShowDeleteButton(true)
                setShowJoinButton(false)
                setShowLeaveButton(false)
            }
            if (data.role === "CS REP" || data.role === "ADMIN") {
                setShowChangeManagerButton(true)
            }

        }
        else if (isInProject == true) {


            setShowLeaveButton(true)
            if (data.role === "ADMIN") {

                setShowEditButton(true)
                setShowDeleteButton(true)

            }
            if (data.userId == managerId) {
                setShowEditButton(true)
                setShowDeleteButton(true)
                setShowJoinButton(false)
                setShowLeaveButton(false)
            }

            if (data.role === "CSREP" || data.role === "ADMIN") {
                setShowChangeManagerButton(true)
            }
        }
    }





    const openEditProject = () => {
        setNewTitle(projectDetails.title)
        setNSDate(new Date(projectDetails.start_Date))
        setNFDate(new Date(projectDetails.end_date))
        setNewPriority(projectDetails.priority)
        setNewDescription(projectDetails.content)
        setEditProject(true);
    };
    const closeEditProject = () => {
        setEditProject(false);
    };

    //Modal For Changing the Manager
    const [newManager, setNewManager] = React.useState(false);
    const openNewManager = () => {
        setNewManager(true);
    };
    const closeNewManager = () => {
        setNewManager(false);
    };

    //Dialog for Join Project
    const [openJoin, setOpenJoin] = React.useState(false);

    const clickOpenJoin = () => {
        setOpenJoin(true);
    };

    const closeJoin = () => {
        setOpenJoin(false);
    };

    //Dialog for Leave Project
    const [openLeave, setOpenLeave] = React.useState(false);

    const clickOpenLeave = () => {
        setOpenLeave(true);
    };

    const closeLeave = () => {
        setOpenLeave(false);
    };

    const handleSearchChange = (e, v) => {
        if (v != null) {

            setNewManagerId(v.id)

        }
        else {
            setNewManagerId(0)
        }
    }
    const changeManager = () => {
        let temp = {
            managerId: newManagerId
        }
        Axios.put(`${REACT_APP_HOST_URL}/api/changeManager/${id}`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                loadData()
                closeNewManager()
            })
            .catch(error => {
                console.log(error)
            })
    }
    const editProjectValidation = () => {
        if (newTitle === "" || newPriority === "" || newDescription === "") {
            setEditErrorMsg("Please fill out all fields")
            return false
        } else if (newSDate > newFDate) {
            setEditErrorMsg("Invalid Dates")
            return false
        }
        setEditErrorMsg("")
        return true
    }
    const editProjectHandler = () => {
        let temp = {
            title: newTitle,
            sDate: format(newSDate, 'yyyy/MM/dd'),
            fDate: format(newFDate, 'yyyy/MM/dd'),
            priority: newPriority,
            desc: newDescription,
        }
        const isValid = editProjectValidation()
        if (isValid) {
            Axios.put(`${REACT_APP_HOST_URL}/api/editProject/${id}`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {

                    loadData()
                    closeEditProject()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const deleteProject = () => {
        Axios.delete(`${REACT_APP_HOST_URL}/api/deleteProject/${id}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                history.push('/Project')
            })
            .catch(error => {
                console.log(error)
            })
    }
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    const joinProject = () => {
        let temp = {
            projectId: id,
            userId: data.userId
        }
        Axios.post(`${REACT_APP_HOST_URL}/api/joinProject/`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                clickOpenJoin()
                sleep(2000).then(() => {
                    setOpenJoin(false)
                    loadData()
                    setShowLeaveButton(true)
                    setShowJoinButton(false)
                })



            })
            .catch(error => {
                console.log(error)
            })
    }
    const leaveProject = () => {
        let temp = {
            projectId: id,
            userId: data.userId
        }
        Axios.post(`${REACT_APP_HOST_URL}/api/leaveProject/`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                setShowLeaveButton(false)
                setShowJoinButton(true)
                loadData()
                closeLeave()
            })
            .catch(error => {
                console.log(error)
            })
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
                            Dashboard / Projects / Project Overview
                        </Box>
                    </Grid>
                    <Grid item xs={6} />
                    <Grid item xs={12}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            className={classes.tab}
                        >
                            <Tab
                                label="Project Overview"
                                component={Link}
                                to={`/ViewProject/${id}`}
                            />
                            <Tab
                                label="Project Tasks"
                                component={Link}
                                to={`/ProjectTask/${id}`}
                            />
                            <Tab
                                label="Project Members"
                                component={Link}
                                to={`/ProjectMember/${id}`}
                            />
                        </Tabs>
                        <hr />
                    </Grid>
                    <Grid container spacing={0} className={classes.container}>
                        <Grid item xs={12}>
                            <Box
                            >
                                {showJoinButton && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        className={classes.button}
                                        onClick={joinProject}
                                    >
                                        Join Project
                                    </Button>)}
                                <Dialog open={openJoin} onClose={closeJoin} aria-labelledby="form-dialog-title" >
                                    <div className={classes.paper}>
                                        <DialogContent className={classes.joined}>
                                            <Box
                                                color="#FFFFFF"
                                                fontWeight="fontWeightLight"
                                                textAlign="center"
                                                fontSize={22}
                                            >
                                                You have joined the project.
                                            </Box>
                                        </DialogContent>
                                    </div>
                                </Dialog>
                                {showLeaveButton && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        className={classes.button}
                                        onClick={clickOpenLeave}
                                    >
                                        Leave Project
                                    </Button>)}
                                <Dialog open={openLeave} onClose={closeLeave} aria-labelledby="form-dialog-title" >
                                    <div className={classes.paper3}>
                                        <Box color="#FFFFFF"
                                            fontWeight="fontWeightLight" m={1}
                                            textAlign="right"
                                            fontSize={18}
                                        >
                                            <DialogContent className={classes.dialog}>
                                                <Grid item xs={12}>
                                                    <br />
                                                    <Box className={classes.Left} alignItems="left"
                                                        color="#FFFFFF"
                                                        display="flex"
                                                        flexDirection="left" p={1}
                                                    >
                                                        Are you sure you want to leave project?
                                                    </Box>
                                                </Grid>
                                                <Grid container spacing={0} className={classes.container}>
                                                    <Box
                                                        marginLeft={23}
                                                        paddingBottom={1}
                                                        paddingTop={1}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            className={classes.button}
                                                            onClick={leaveProject}
                                                        >
                                                            Yes
                                                    </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={closeLeave}
                                                        >
                                                            No
                                                    </Button>
                                                    </Box>
                                                </Grid>
                                            </DialogContent>
                                        </Box>
                                    </div>

                                </Dialog>
                                {showEditButton && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        className={classes.button}
                                        onClick={openEditProject}
                                    >
                                        Edit Project
                                    </Button>)}
                                <Dialog open={editProject} onClose={closeEditProject} aria-labelledby="form-dialog-title" >
                                    <Grid container spacing={0}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <div className={classes.paper}>
                                                <Box color="#FFFFFF"
                                                    fontWeight="fontWeightLight" m={1}
                                                    textAlign="right"
                                                    fontSize={18}
                                                >
                                                    <DialogContent>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={3}>
                                                                <Box
                                                                    className={classes.dialog}
                                                                    color="#FFFFFF"
                                                                    display="flex"

                                                                >
                                                                    Edit Project
                                                                </Box>
                                                            </Grid>
                                                            <Box
                                                                color="red"
                                                                fontWeight="fontWeightRegular"
                                                                fontSize={18}
                                                                marginLeft={24}
                                                            >
                                                                {editErrorMsg}
                                                            </Box>
                                                        </Grid>
                                                        <form className={classes.formRoot} noValidate autoComplete="off">

                                                            <TextField

                                                                label="Project Name"
                                                                variant="outlined"
                                                                color="secondary"
                                                                value={newTitle}
                                                                onChange={(e) => setNewTitle(e.target.value)}
                                                                InputLabelProps={{
                                                                    className: classes.multilineColor
                                                                }}
                                                                InputProps={{
                                                                    className: classes.input
                                                                }}


                                                            />

                                                            <Grid container spacing={0}>
                                                                <Grid item xs={4}>
                                                                    <KeyboardDatePicker

                                                                        variant="inline"
                                                                        color="secondary"
                                                                        format="yyyy/MM/dd"
                                                                        margin="normal"
                                                                        id="start-date"
                                                                        label="Start Date"
                                                                        value={newSDate}
                                                                        onChange={(date) => setNSDate(date)}
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                        InputLabelProps={{
                                                                            className: classes.multilineColor
                                                                        }}
                                                                        InputProps={{
                                                                            className: classes.input
                                                                        }}

                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <KeyboardDatePicker
                                                                        disableToolbar
                                                                        variant="inline"
                                                                        color="secondary"
                                                                        format="yyyy/MM/dd"
                                                                        margin="normal"
                                                                        id="end-date"
                                                                        label="End Date"
                                                                        value={newFDate}
                                                                        onChange={(date) => setNFDate(date)}
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                        InputLabelProps={{
                                                                            className: classes.multilineColor
                                                                        }}
                                                                        InputProps={{
                                                                            className: classes.input
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    id="project-priority"
                                                                    select
                                                                    fullWidth
                                                                    className={classes.gridContainer2}
                                                                    color="secondary"
                                                                    label="Project Priority"
                                                                    value={newPriority}
                                                                    onChange={(e) => setNewPriority(e.target.value)}
                                                                    SelectProps={{
                                                                        native: true,
                                                                    }}
                                                                    InputLabelProps={{
                                                                        className: classes.multilineColor
                                                                    }}
                                                                    InputProps={{
                                                                        className: classes.input2
                                                                    }}
                                                                >
                                                                    {priorities.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))}
                                                                </TextField>
                                                            </Grid>
                                                            <TextField
                                                                id="outlined-multiline-static"
                                                                label="Project Description"
                                                                multiline
                                                                color="secondary"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={newDescription}
                                                                onChange={(e) => setNewDescription(e.target.value)}
                                                                InputLabelProps={{
                                                                    className: classes.multilineColor
                                                                }}
                                                                InputProps={{
                                                                    className: classes.input
                                                                }}
                                                            />
                                                            <Box
                                                                marginLeft={22}
                                                                paddingBottom={1}
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={editProjectHandler}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Box>
                                                        </form>
                                                    </DialogContent>
                                                </Box>
                                            </div>
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                </Dialog>
                                {showDeleteButton && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={openDelete}
                                    >
                                        Delete Project
                                    </Button>)}
                            </Box>
                        </Grid>
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
                                    Project Name
                                </Box>
                                <Box
                                    color="#FFFFFF"
                                    marginLeft={1}
                                    fontWeight="fontWeightLight"
                                >
                                    {projectDetails.title}
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
                                            Start Date
                                        </Box>
                                        <Box
                                            color="#FFFFFF"
                                            marginLeft={1}
                                            fontWeight="fontWeightLight"
                                        >
                                            {projectDetails.start_Date}
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Typography >
                                    <Box
                                        color="#A0A0A0"
                                        marginLeft={1}
                                        fontWeight="fontWeightRegular"
                                        paddingTop={2}
                                    >
                                        Deadline
                                    </Box>
                                    <Box
                                        color="#FFFFFF"
                                        marginLeft={1}
                                        fontWeight="fontWeightLight"
                                    >
                                        {projectDetails.end_date}
                                    </Box>
                                </Typography>
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
                                    paddingTop={2}
                                    fontWeight="fontWeightLight"
                                >
                                    {projectDetails.content}
                                </Box>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box

                            display="flex"
                            flexDirection="column"
                            border={1}
                            borderRadius={10}
                            p={2}
                            borderColor="#1F1F32"
                            bgcolor="primary.main"
                            marginLeft={2}
                        >
                            <Typography variant="caption">
                                <Box
                                    color="#A0A0A0"
                                    marginLeft={1}
                                    fontWeight="fontWeightBold"
                                >
                                    PROJECT MANAGER
                                    <Grid container spacing={2}>
                                        <List className={classes.list}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar alt="" src={`${REACT_APP_HOST_URL}/storage/images/${projectDetails.user.avatar}`} className={classes.large} />
                                                </ListItemAvatar>
                                                <ListItemText>
                                                    <Typography>
                                                        <Box
                                                            color="#FFFFFF"
                                                            marginLeft={1}
                                                            fontWeight="fontWeightLight"
                                                        >
                                                            {projectDetails.user.name}
                                                        </Box>
                                                    </Typography>
                                                    <Typography>
                                                        <Box
                                                            color="#A0A0A0"
                                                            marginLeft={1}
                                                            fontWeight="fontWeightLight"
                                                        >
                                                            {projectDetails.user.role}
                                                        </Box>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </Box>
                            </Typography>
                            {showChangeManagerButton && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={openNewManager}
                                >
                                    Change Manager
                                </Button>)}
                            <Dialog open={newManager} onClose={closeNewManager} aria-labelledby="form-dialog-title" >
                                <div className={classes.paper}>
                                    <Box color="#FFFFFF"
                                        fontWeight="fontWeightLight" m={1}
                                        textAlign="right"
                                        fontSize={18}
                                    >
                                        <DialogContent className={classes.dialog}>
                                            <Grid item xs={12}>
                                                <br />
                                                <Box className={classes.Left} alignItems="left"
                                                    color="#FFFFFF"
                                                    display="flex"
                                                    flexDirection="left" p={1}
                                                >
                                                    Change Manager
                                                </Box>
                                            </Grid>
                                            <form className={classes.formRoot} noValidate autoComplete="off">
                                                <Autocomplete
                                                    id="combo-box"
                                                    options={orgList}
                                                    onChange={handleSearchChange}
                                                    getOptionLabel={(option) => option.name}
                                                    classes={{ inputRoot: classes.inputRoot }}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Change Assigned Manager"
                                                            variant="outlined"
                                                            color="secondary"
                                                            InputLabelProps={{
                                                                className: classes.multilineColor
                                                            }}
                                                        />}
                                                />
                                                <Box
                                                    marginLeft={22}
                                                    paddingBottom={1}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={changeManager}
                                                    >
                                                        Change
                                                    </Button>
                                                </Box>
                                            </form>
                                        </DialogContent>
                                    </Box>
                                </div>
                            </Dialog>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className={classes.gridContainer2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            component={Link}
                            to="/Project"
                        >
                            Back to Projects
                        </Button>
                    </Grid>
                </Grid>
                <Dialog open={delProject} onClose={closeDelete} aria-labelledby="form-dialog-title" >
                    <div className={classes.paper3}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            textAlign="right"
                            fontSize={18}
                        >
                            <DialogContent className={classes.dialog}>
                                <Grid item xs={10}>
                                    <br />
                                    <Box className={classes.Left} alignItems="left"
                                        color="#FFFFFF"
                                        display="flex"
                                        flexDirection="left" p={1}
                                    >
                                        Delete Project?
                                                </Box>
                                </Grid>
                                <Grid container spacing={0} className={classes.container}><Box
                                    marginLeft={22}
                                    paddingBottom={1}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={deleteProject}
                                        className={classes.button}
                                    >
                                        Yes
                                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={closeDelete}
                                    >
                                        No
                                                </Button>
                                </Box>
                                </Grid>
                            </DialogContent>
                        </Box>
                    </div>
                </Dialog>
            </main>
        </MuiThemeProvider>
    );
}