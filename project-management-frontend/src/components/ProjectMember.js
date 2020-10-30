import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link, useParams } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
    },
    tab: {
        color: '#FFFFFF',
    },
    gridContainer2: {
        paddingTop: "5px",
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

const ProjectMember = () => {
    const classes = useStyles();
    var ls = new SecureLS();
    let data = ls.get('data');
    const [value, setValue] = React.useState(2);
    const { id } = useParams();
    const [memberList, setMemberList] = React.useState([])
    const [isLoaded, setIsLoaded] = React.useState(false);
    //handle change for tabs
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    React.useEffect(() => {
        Axios.get(`${REACT_APP_HOST_URL}/api/projectMembers/${id}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                setMemberList(response.data.users)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])

    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>

                    <Grid item xs={4}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            fontSize={18}>
                            Dashboard / Projects / Project Members
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
                        <Grid item xs={9}>
                            <hr />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={9}>
                        <MaterialTable style={{
                            backgroundColor: "#1F1F32",
                            color: "#FFFFFF",
                        }}
                            width="100%"
                            title="Project Members"
                            columns={[
                                {
                                    title: 'Name', field: 'name',
                                    cellStyle: {
                                        backgroundColor: '#1F1F32',
                                        color: '#FFF'
                                    },
                                    headerStyle: {
                                        backgroundColor: '#1F1F32',
                                    }
                                },
                                {
                                    title: 'Role', field: 'role',
                                    cellStyle: {
                                        backgroundColor: '#1F1F32',
                                        color: '#FFF'
                                    },
                                    headerStyle: {
                                        backgroundColor: '#1F1F32',
                                    }
                                },
                            ]}

                            data={memberList}
                            options={{
                                pageSizeOptions: [5],
                                headerStyle: {
                                    backgroundColor: '#1F1F32',
                                    color: '#FFF'
                                },
                                draggable: false,
                                rowStyle: {
                                    backgroundColor: '#1F1F32'
                                }
                            }}
                        />
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
            </main>
        </MuiThemeProvider>
    );

}

export default ProjectMember;
