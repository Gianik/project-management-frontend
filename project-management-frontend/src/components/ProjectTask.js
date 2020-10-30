import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Axios from 'axios';
import REACT_APP_HOST_URL from '../config';
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
    },
    paper: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '500px',
        },
    },
    root1: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
            height: '10ch',
        },
    },
    paper2: {

    },
    tab: {
        color: '#FFFFFF',
    },
    gridContainer2: {
        paddingTop: "5px",
        paddingBottom: "5px",
        marginLeft: "10px",
        paddingRight: "5px",
    },
    container: {
        paddingTop: "50px",
    },
    input: {
        color: "white"
    },
    inputRoot: {
        color: '#FFFFFF',
    },
    multilineColor: {
        color: '#52399B'
    },
    paper3: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
        width: '500px',
    },
    button: {
        marginRight: "15px",
    },
    header: {
        color: "#887BA3"
    },
    typography: {
        color: "#FFFFFF",
        marginLeft: theme.spacing(2),
    },
    dialog: {
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
            main: "#52399B"
        },
        error: {
            main: "#FFFFFF"
        },
    }
});

const ProjectTask = props => {
    const classes = useStyles();
    const [value, setValue] = React.useState(1);
    const { id } = useParams();
    const [openCreate, setOpenCreate] = React.useState(false);
    const [memberList, setMemberList] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    //add Task
    const [aTitle, setAtitle] = React.useState("");
    const [aTaskDescription, setATaskDescription] = React.useState("");
    const [aAssignMember, setAAssignMember] = React.useState(0);
    const [adueDate, setADueDate] = React.useState(new Date());
    //edit Task
    const [eTitle, setEtitle] = React.useState("");
    const [eTaskDescription, setETaskDescription] = React.useState("");
    const [eAssignMemberId, setEAssignMemberId] = React.useState(0);
    const [eAssignMemberName, setEAssignMemberName] = React.useState(0);
    const [eRowId, setERowId] = React.useState(0);
    const [edueDate, setEDueDate] = React.useState(new Date());
    //set Task status
    const [ongoingTask, setOngoingTask] = React.useState([]);
    const [comletedTask, setCompltedTask] = React.useState([]);
    //Datepicker
    const [dueDate, setDueDate] = React.useState(new Date());
    //delete Task
    const [delTask, setdelTask] = React.useState(false);
    const [deleteId, setdeleteId] = React.useState(0);
    const [view, setView] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [vdueDate, setVDueDate] = React.useState(new Date());
    // const [dateSet, setDate] = React.useState("");
    // const [dateToday, setDateToday] = React.useState(new Date());
    const [addErrorMsg, setAddErrorMsg] = React.useState("");
    const [EErrorMsg, setEErrorMsg] = React.useState("");
    const [managerId, setManagerId] = React.useState(0);//for the material-table
    const [showAddTask, setShowAddTask] = React.useState(false)
    const [showActions, setShowActions] = React.useState(false)
    var ls = new SecureLS();
    let data = ls.get('data');
    const openDelete = () => {
        setdelTask(true);
    };
    const closeDelete = () => {
        setdelTask(false);
    };


    const confirmDelete = (rowData) => {
        setdeleteId(rowData)
        openDelete()
    };

    const viewTask = (rowData) => {
        setTitle(rowData.title)
        // setMember(rowData.user.name)
        setDesc(rowData.content)
        setVDueDate(rowData.due_date)
        setView(true);
    };
    const closeView = () => {
        setView(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    React.useEffect(() => {
        loadData()
    }, [])
    const loadData = () => {
        Axios.get(`${REACT_APP_HOST_URL}/api/projectTask/${id}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                setMemberList(response.data.list.users)
                setOngoingTask(response.data.ongoing)
                setCompltedTask(response.data.completed)
                setManagerId(response.data.list.user_id)
                checkCredentials(response.data.list.user_id)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const checkCredentials = (managerId) => {
        if (data.userId == managerId || data.role == "ADMIN") {
            setShowAddTask(true)
            setShowActions(true)
            return
        }
        return
    }
    const validateAddTask = (temp) => {
        let tempDate = new Date()
        let dateToday = format(tempDate, 'yyyy/MM/dd')
        if (temp.title == "" || temp.content == "" || temp.projectId == "" || temp.userId == "") {
            setAddErrorMsg("Please fill out all fields")
            return false
        }
        else if (temp.due_date < dateToday) {
            setAddErrorMsg("Invalid Date")
            return false
        }
        setAddErrorMsg("")
        return true

    }
    const addTask = () => {
        let temp = {
            title: aTitle,
            content: aTaskDescription,
            projectId: id,
            userId: aAssignMember,
            due_date: format(adueDate, 'yyyy/MM/dd')
        }
        const isValid = validateAddTask(temp)
        if (isValid) {
            Axios.post(`${REACT_APP_HOST_URL}/api/projectTaskCreate/`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    console.log(response)
                    loadData()
                    closeCreateTask()

                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const validateEditTask = (temp) => {
        let tempDate = new Date()
        let dateToday = format(tempDate, 'yyyy/MM/dd')
        if (temp.title == "" || temp.content == "" || temp.userId == "") {
            setEErrorMsg("Please fill out all fields")
            return false
        }
        else if (temp.due_date < dateToday) {
            setEErrorMsg("Invalid Date")
            return false
        }
        setEErrorMsg("")
        return true
    }
    const editTask = () => {
        let temp = {
            title: eTitle,
            desc: eTaskDescription,
            userId: eAssignMemberId,
            due_date: format(edueDate, 'yyyy/MM/dd')
        }
        console.log(temp)

        const isValid = validateEditTask(temp)
        if (isValid) {
            Axios.put(`${REACT_APP_HOST_URL}/api/editTask/${eRowId}`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    console.log(response);
                    loadData()
                    closeEditTask()
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    const setComplete = (rowId) => {
        //just a dummy body for the put request
        let temp = {
            body: 'dummyData'
        }
        Axios.put(`${REACT_APP_HOST_URL}/api/setComplete/${rowId}`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                console.log(response)
                loadData()
            })
            .catch(error => {
                console.log(error)
            })
    }
    const setIncomplete = (rowId) => {
        //just a dummy body for the put request
        let temp = {
            body: 'dummyData'
        }
        Axios.put(`${REACT_APP_HOST_URL}/api/setIncomplete/${rowId}`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                console.log(response)
                loadData()
            })
            .catch(error => {
                console.log(error)
            })
    }
    const deleteTask = () => {
        Axios.delete(`${REACT_APP_HOST_URL}/api/taskDelete/${deleteId}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                console.log(response)
                loadData()
                closeDelete()
            })
            .catch(error => {
                console.log(error)
            })
    }



    //For Add Task Dialog

    const openCreateTask = () => {
        setOpenCreate(true);
    };
    const closeCreateTask = () => {
        setOpenCreate(false);
    };

    //For Edit Task Dialog

    const openEditTask = (rowData) => {
        setERowId(rowData.id)
        setEAssignMemberId(rowData.user.id)
        setEAssignMemberName(rowData.user.name)
        setEtitle(rowData.title)
        setETaskDescription(rowData.content)
        setEDueDate(new Date(rowData.due_date))

        setOpenEdit(true);
    };
    const closeEditTask = () => {
        setOpenEdit(false);
    };
    //handle change for autocomplete(add Task)
    const handleSearchChange = (e, v) => {
        if (v != null) {

            setAAssignMember(v.id)

        }
        else {
            setAAssignMember(0)
        }
    }
    //handle change for autocomplete(edit Task)
    const handleSearchChange2 = (e, v) => {
        if (v != null) {

            setEAssignMemberId(v.id)
            setEAssignMemberName(v.name)
        }
        else {
            setEAssignMemberId(0)
        }
    }


    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid container spacing={0}>
                        <Grid item xs={4}>
                            <Box color="#FFFFFF"
                                fontWeight="fontWeightLight" m={1}
                                fontSize={18}>
                                Dashboard / Projects / Project Tasks
                        </Box>
                        </Grid>
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
                        <Grid item xs={12}>
                            <hr />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        {showAddTask && (
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={openCreateTask}
                            >
                                Add Task
                            </Button>)}
                        <Dialog open={openCreate} onClose={closeCreateTask} aria-labelledby="form-dialog-title" >
                            <div className={classes.paper}>
                                <Box color="#FFFFFF"
                                    fontWeight="fontWeightLight" m={1}
                                    textAlign="right"
                                    fontSize={18}
                                >
                                    <DialogContent>
                                        <Grid container spacing={0}>
                                            <Grid item xs={5}>
                                                <Box
                                                    className={classes.dialog}
                                                    color="#FFFFFF"
                                                    display="flex"
                                                >
                                                    Add a New Task
                                            </Box>
                                            </Grid>
                                            <Box
                                                color="red"
                                                fontWeight="fontWeightRegular"
                                                fontSize={18}
                                                marginLeft={13}
                                            >
                                                {addErrorMsg}
                                            </Box>
                                        </Grid>
                                        <form className={classes.root} noValidate autoComplete="off">
                                            <Grid item xs={4}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        variant="inline"
                                                        format="yyyy/MM/dd"
                                                        color="secondary"
                                                        margin="normal"
                                                        id="date-picker-inline"
                                                        label="Task Deadline"
                                                        value={adueDate}
                                                        onChange={(date) => setADueDate(date)}
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
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Autocomplete
                                                id="combo-box"
                                                options={memberList}
                                                onChange={handleSearchChange}
                                                getOptionLabel={(option) => option.name}
                                                classes={{ inputRoot: classes.inputRoot }}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        label="Member Assigned"
                                                        variant="outlined"
                                                        color="secondary"
                                                        InputLabelProps={{
                                                            className: classes.multilineColor
                                                        }}
                                                    />}
                                            />
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Task"
                                                color="secondary"
                                                value={aTitle}
                                                onChange={(e) => setAtitle(e.target.value)}
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                            />
                                            <br />
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Task Description"
                                                color="secondary"
                                                value={aTaskDescription}
                                                onChange={(e) => setATaskDescription(e.target.value)}
                                                multiline
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                            />
                                        </form>
                                        <DialogActions>
                                            <Grid item xs={4} >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    value="Submit"
                                                    onClick={addTask}
                                                >
                                                    Add Task
                                                </Button>
                                            </Grid>
                                        </DialogActions>
                                    </DialogContent>
                                </Box>
                            </div>
                        </Dialog>
                    </Grid>
                    {/* //Edit Task Dialog */}
                    <Grid item xs={1} className={classes.gridContainer2}>
                        <Dialog open={openEdit} onClose={closeEditTask} aria-labelledby="form-dialog-title" >
                            <div className={classes.paper}>
                                <Box color="#FFFFFF"
                                    fontWeight="fontWeightLight" m={1}
                                    textAlign="right"
                                    fontSize={18}
                                >
                                    <DialogContent>
                                        <Grid container spacing={0}>
                                            <Grid item xs={5}>
                                                <Box
                                                    className={classes.dialog}
                                                    color="#FFFFFF"
                                                    display="flex"
                                                >
                                                    Edit a Task
                                                </Box>
                                            </Grid>
                                            <Box
                                                color="red"
                                                fontWeight="fontWeightRegular"
                                                fontSize={18}
                                                marginLeft={13}
                                            >
                                                {EErrorMsg}
                                            </Box>
                                        </Grid>
                                        <form className={classes.root} noValidate autoComplete="off">
                                            <Grid item xs={4}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDatePicker
                                                        variant="inline"
                                                        format="yyyy/MM/dd"
                                                        color="secondary"
                                                        margin="normal"
                                                        id="date-picker-inline"
                                                        label="Task Deadline"
                                                        value={edueDate}
                                                        onChange={(date) => setEDueDate(date)}
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
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Autocomplete
                                                id="combo-box"
                                                options={memberList}
                                                defaultValue={{ name: eAssignMemberName, id: eAssignMemberId }}
                                                getOptionLabel={(option) => option.name}
                                                classes={{ inputRoot: classes.inputRoot }}
                                                onChange={handleSearchChange2}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        label="Member Assigned"
                                                        variant="outlined"
                                                        color="secondary"
                                                        defaultValue={eAssignMemberName}
                                                        InputLabelProps={{
                                                            className: classes.multilineColor
                                                        }}
                                                    />}
                                            />
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Task"
                                                color="secondary"
                                                multiline
                                                value={eTitle}
                                                onChange={(e) => setEtitle(e.target.value)}
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                            />
                                            <br />
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Task Description"
                                                color="secondary"
                                                value={eTaskDescription}
                                                onChange={(e) => setETaskDescription(e.target.value)}
                                                multiline
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                            />
                                        </form>
                                        <DialogActions>
                                            <Grid item xs={5} >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    value="Submit"
                                                    onClick={editTask}
                                                >
                                                    Edit Task
                                                </Button>
                                            </Grid>
                                        </DialogActions>
                                    </DialogContent>
                                </Box>
                            </div>
                        </Dialog>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <MaterialTable
                                style={{
                                    backgroundColor: "#1F1F32",
                                    color: "#FFFFFF",
                                }}
                                width="100%"
                                title="Ongoing Tasks"
                                columns={[
                                    {
                                        title: 'Assigned', field: 'user.name',
                                    },
                                    {
                                        title: 'Task Name', field: 'title',
                                    },
                                    {
                                        title: 'Deadline', field: 'due_date',
                                    },
                                    {
                                        field: 'content', hidden: true
                                    },
                                    {
                                        field: 'id', hidden: true
                                    },
                                    {
                                        field: 'user.id', hidden: true
                                    }

                                ]}
                                data={ongoingTask}
                                options={{
                                    pageSizeOptions: [5],
                                    headerStyle: {
                                        backgroundColor: '#1F1F32',
                                        color: '#FFFFFF'
                                    },
                                    tableLayout: "auto",
                                    draggable: false,
                                    actionsColumnIndex: -1,
                                    rowStyle: {
                                        backgroundColor: '#1F1F32'
                                    },
                                    searchFieldStyle: {
                                        color: 'white'
                                    },
                                    // actionsCellStyle: {
                                    //     display: 'flex',
                                    //     justifyContent: 'center',
                                    //     padding: 12,
                                    //     width: '100%'
                                    // }
                                }}
                                actions={[
                                    rowData => (
                                        {
                                            icon: 'check',
                                            iconProps: { style: { color: "white" } },
                                            tooltip: 'Mark as complete',
                                            onClick: (event, rowData) => setComplete(rowData.id),
                                            hidden: (showActions == false)
                                        }),
                                    rowData => (
                                        {
                                            icon: 'edit',
                                            iconProps: { style: { color: "white" } },
                                            tooltip: 'Edit Task',
                                            onClick: (event, rowData) => openEditTask(rowData),
                                            hidden: (showActions == false)
                                        }),
                                    rowData => ({
                                        icon: 'delete',
                                        iconProps: { style: { color: "white" } },
                                        tooltip: 'Delete Task',
                                        onClick: (event, rowData) => confirmDelete(rowData.id),
                                        hidden: (showActions == false)
                                    })
                                ]}
                                localization={{
                                    header: {
                                        actions: ''
                                    },
                                }}

                                onRowClick={(event, rowData) => viewTask(rowData)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.container}>
                        <MaterialTable style={{
                            backgroundColor: "#1F1F32",
                            color: "#FFFFFF",
                        }}
                            width="100%"
                            title="Completed Tasks"
                            columns={[
                                {
                                    title: 'Assigned', field: 'user.name',
                                },
                                {
                                    title: 'Task', field: 'title',
                                },
                                {
                                    title: 'Date Completed', field: 'completion_date',
                                },
                                {
                                    field: 'content', hidden: true
                                },
                                {
                                    field: 'id', hidden: true
                                }
                            ]}
                            data={comletedTask}
                            actions={[
                                rowData => ({
                                    icon: 'clear',
                                    iconProps: { style: { color: "white" } },
                                    tooltip: 'Mark as ongoing',
                                    onClick: (event, rowData) => setIncomplete(rowData.id),
                                    hidden: (showActions == false)
                                }),
                                rowData => ({
                                    icon: 'delete',
                                    iconProps: { style: { color: "white" } },
                                    tooltip: 'Delete Task',
                                    onClick: (event, rowData) => confirmDelete(rowData.id),
                                    hidden: (showActions == false)
                                })
                            ]}
                            // onRowClick={viewTask}
                            options={{
                                pageSizeOptions: [5],
                                headerStyle: {
                                    backgroundColor: '#1F1F32',
                                    color: '#FFF'
                                },
                                tableLayout: "auto",
                                draggable: false,
                                actionsColumnIndex: -1,
                                rowStyle: {
                                    backgroundColor: '#1F1F32'
                                },
                                searchFieldStyle: {
                                    color: 'white'
                                },
                                // actionsCellStyle: {
                                //     display: 'flex',
                                //     justifyContent: 'center',
                                //     padding: 12,
                                //     width: '100%'
                                // }
                            }}
                            localization={{
                                header: {
                                    actions: ''
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridContainer2}>
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
                    <Dialog open={delTask} onClose={closeDelete} aria-labelledby="form-dialog-title" >
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
                                            Delete Task?
                                                </Box>
                                    </Grid>
                                    <Grid container spacing={0} className={classes.container}>
                                        <Box
                                            marginLeft={35}
                                            paddingBottom={1}
                                        >
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={deleteTask}
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
                    <Dialog open={view} onClose={closeView} aria-labelledby="form-dialog-title" >
                        <div className={classes.paper3}>
                            <DialogContent>
                                <DialogContentText>
                                    <Typography
                                        className={classes.header}
                                        variant="h6"
                                    >
                                        Task
                                    </Typography>
                                    <hr />
                                    <Typography
                                        className={classes.typography}
                                        variant="body1"
                                    >
                                        {title}
                                    </Typography>
                                    <br />
                                    <Typography
                                        className={classes.header}
                                        variant="h6"
                                    >
                                        Description
                                    </Typography>
                                    <hr />
                                    <Typography
                                        className={classes.typography}
                                        variant="body1"
                                    >
                                        {desc}
                                    </Typography>
                                    <br />
                                    <Typography
                                        className={classes.header}
                                        variant="h6"
                                    >
                                        Deadline
                                    </Typography>
                                    <hr />
                                    <Typography
                                        className={classes.typography}
                                        variant="h6"
                                    >
                                        {vdueDate}
                                    </Typography>

                                </DialogContentText>
                            </DialogContent>
                        </div>
                    </Dialog>
                </Grid>
            </main>
        </MuiThemeProvider>
    );

}

export default ProjectTask;
