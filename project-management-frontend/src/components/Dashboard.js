
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MaterialTable from 'material-table'
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import { TrainRounded } from '@material-ui/icons';
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(15),
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
    media: {
        height: 80,
        backgroundColor: '#6265AF',
    },
    gridContainer: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    cardContent: {
        marginLeft: "15px",
    },
    table: {
        paddingTop: theme.spacing(2),
    },
    paper: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
        width: '500px',
    },
    header: {
        color: "#887BA3"
    },
    typography: {
        color: "#FFFFFF",
        marginLeft: theme.spacing(2),
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

const Dashboard = (props) => {
    const classes = useStyles();
    // const [projectData] = useState(ProjectData);
    const [filter, setFilter] = useState("");
    const [projectData, setProjectData] = useState({});
    var ls = new SecureLS();
    let data = ls.get('data');
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [taskList, setTaskList] = React.useState([])
    const handleSearchChange = (e) => {
        setFilter(e.target.value);
    }

    const [view, setView] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [vdueDate, setVDueDate] = React.useState(new Date());

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

    React.useEffect(() => {
        Axios.get(`${REACT_APP_HOST_URL}/api/userProject/${data.userId}`, {
            headers: {
                'Authorization': "Bearer " + data.token

            }
        })
            .then(response => {
                console.log(response)
                console.log(response.data.project)
                setTaskList(response.data[1])
                const { project } = response.data[0];
                const pData = {}
                project.forEach((project, index) => {
                    pData[project.id] = {
                        id: project.id,
                        title: project.title,
                        manager: project.user.name,
                        date_started: project.start_Date,
                        date_ended: project.end_date,
                        priority: project.priority,
                    }

                })
                setProjectData(pData)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const getProject = (id) => {
        const { title, manager, date_started, date_ended, priority } = projectData[id];
        return (
            <Grid item xs={4} key={id}>
                <Card className={classes.root}>
                    <CardActionArea button component={Link} to={`/ViewProject/${id}`}>
                        <CardMedia className={classes.media} />
                        <CardContent >
                            <Typography variant="h6">{`${title}`}</Typography>
                            <Typography variant="body2" className={classes.cardContent}>
                                Manager: {`${manager}`}
                                <br />
                                Start Date:{`${date_started}`}
                                <br />
                                End Date:{`${date_ended}`}
                                <br />
                                Priority:{`${priority}`}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid container spacing={12}>
                    </Grid>
                    <Grid item xs={9}>

                        <Box
                            display="flex"
                            flexDirection="column"
                            borderRadius={10}
                            p={2}
                            bgcolor="primary.main"
                            paddingBottom={5}
                        >
                            <Grid item xs={9}>
                                <Box
                                    color="#FFFFFF"
                                    fontWeight="fontWeightLight" m={1}
                                    fontSize={24}
                                >
                                    Projects
                                </Box>
                            </Grid>
                            <Grid container spacing={10} className={classes.gridContainer}>
                                {Object.keys(projectData).map(id =>
                                    projectData[id].title.includes(filter) &&
                                    getProject(id))}
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container spacing={0} className={classes.table}>
                        <Grid item xs={9}>
                            <MaterialTable style={{
                                backgroundColor: "#1F1F32",
                                color: "#FFFFFF",
                            }}
                                width="100%"
                                title="Upcoming Deadlines"
                                columns={[
                                    {
                                        title: 'Project Name', field: 'project.title',

                                    },
                                    {
                                        title: 'Project Task', field: 'title',

                                    },
                                    {
                                        field: 'content', hidden: true

                                    },
                                    {
                                        title: 'Deadline', field: 'due_date',

                                    },

                                ]}
                                data={taskList}
                                options={{
                                    pageSizeOptions: [5],
                                    actionsColumnIndex: -1,
                                    headerStyle: {
                                        backgroundColor: '#1F1F32',
                                        color: '#FFF'
                                    },
                                    draggable: false,
                                    rowStyle: {
                                        backgroundColor: '#1F1F32',


                                    },
                                    searchFieldStyle: {
                                        color: 'white'
                                    },
                                    actionsCellStyle: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: 12,
                                        width: '100%'
                                    }
                                }}
                                onRowClick={(event, rowData) => viewTask(rowData)}
                            />
                        </Grid>
                        <Dialog open={view} onClose={closeView} aria-labelledby="form-dialog-title" >
                            <div className={classes.paper}>
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
                                            variant="body1"
                                        >
                                            {vdueDate}
                                        </Typography>

                                    </DialogContentText>
                                </DialogContent>
                            </div>
                        </Dialog>
                    </Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );
}
export default Dashboard
