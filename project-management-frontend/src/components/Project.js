import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
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
        paddingTop: "20px",
        paddingLeft: "50px",
    },
    padding: {
        paddingBottom: "10px",
    },
    cardContent: {
        marginLeft: "15px",
    },
    multilineColor2: {
        color: '#FFFFFF',
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


const Project = (props) => {

    const classes = useStyles();
    const [projectData, setProjectData] = useState({});
    const [filter, setFilter] = useState("");
    const [orgList, setOrgList] = useState([])
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [showAddProject, setShowAddProject] = React.useState(false)
    let history = useHistory();
    var ls = new SecureLS();
    let data = ls.get('data');

    React.useEffect(() => {
        Axios.get(`${REACT_APP_HOST_URL}/api/projectList`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                const { data } = response;
                const pData = {}

                const tempArray = []

                data.forEach((project, index) => {
                    pData[project.id] = {
                        id: project.id,
                        title: project.title,
                        manager: project.user.name,
                        date_started: project.start_Date,
                        date_ended: project.end_date,
                        priority: project.priority,
                    }

                    tempArray.push({ id: project.id, name: project.title })
                });


                setOrgList(tempArray)

                setProjectData(pData)
                checkCredentials()
                setIsLoaded(true)
            })
            .catch(error => {
                checkCredentials()
                setIsLoaded(true)
            })


    }, [])
    const checkCredentials = () => {
        if (data.role != "MEMBER") {
            console.log("I was here")
            setShowAddProject(true)
            return
        }
    }
    const getProject = (id) => {

        const { title, manager, date_started, date_ended, priority } = projectData[id];

        return (
            // isLoaded &&
            <Grid item xs={4} key={id}>
                <Card className={classes.root}>
                    <CardActionArea onClick={() => history.push(`/viewProject/${id}`)}>
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
                        <Grid item xs={9}>
                            <Box
                                color="#FFFFFF"
                                fontWeight="fontWeightLight" m={1}
                                fontSize={18}
                            >
                                Dashboard / Projects
                        </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box
                                marginLeft={22}
                                paddingBottom={1}
                            >
                                {showAddProject && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        component={Link}
                                        to="/NewProject"
                                    >
                                        New Project
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            borderRadius={15}
                            p={2}
                            bgcolor="primary.main"
                            marginLeft={1}
                            paddingBottom={10}
                        >
                            <Grid item xs={3}>
                                <form noValidate autoComplete="off">
                                    <Autocomplete
                                        id="combo-box"
                                        options={orgList}
                                        getOptionLabel={(option) => option.name}
                                        classes={{ inputRoot: classes.inputRoot }}
                                        // onChange={handleSearchChange} if you want object
                                        onInputChange={(e, v) => setFilter(v)}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                // label="Search Projects"
                                                placeholder="Search Projects"
                                                variant="outlined"
                                                color="secondary"

                                            />}
                                    />
                                </form>
                            </Grid>
                            <Grid item>
                                <hr />
                            </Grid>
                            <Grid container spacing={10} className={classes.gridContainer}>
                                {Object.keys(projectData).map(id =>
                                    projectData[id].title.includes(filter) &&
                                    getProject(id))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );

}

export default Project;
