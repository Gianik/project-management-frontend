import React from "react";
import {
    Drawer as MUIDrawer,
    ListItem,
    List,
    ListItemIcon,
    ListItemText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import GroupIcon from '@material-ui/icons/Group';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import { useHistory } from "react-router-dom";
import SecureLS from 'secure-ls';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        background: "#1F1F32"
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(20),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItemText: {
        fontSize: '1.em',
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    listItemText2: {
        color: '#FFFFFF',
    },
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    button: {
        margin: theme.spacing(1),
    },
    tab: {
        color: '#FFFFFF',
    },
    multilineColor: {
        color: '#FFFFFF',
    },
    form: {
        width: '37ch',
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
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
        inherit: {
            main: "#52399B"
        },
    },
    overrides: {
        MuiSvgIcon: {
            colorSecondary: {
                color: "#52399B"
            }

        }

    }
});
const Navbar = props => {
    var ls = new SecureLS();

    const classes = useStyles();
    const { location } = props;
    const [url, setUrl] = React.useState("")
    const [sName, setSName] = React.useState("")
    const [sRole, setSRole] = React.useState("")
    let history = useHistory();
    React.useEffect(() => {
        if (location.pathname.match('/Login')) {
            return
        }
        if (location.pathname.match('/Registration')) {
            return
        }
        if (ls.get('data') != null) {
            loadData()
        }
    })
    const loadData = () => {
        let data = ls.get('data');
        Axios.get(`${REACT_APP_HOST_URL}/api/user/${data.userId}/detail`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                setSName(response.data.name)
                setSRole(response.data.role)
                setUrl(`${REACT_APP_HOST_URL}/storage/images/${response.data.avatar}`)
            })

    }
    if (location.pathname.match('/Login')) {
        return null;
    }
    if (location.pathname.match('/Registration')) {
        return null;
    }


    const itemsList = [
        {
            text: "Dashboard",
            icon: <HomeIcon color="secondary" />,
            onClick: () => history.push('/Dashboard')

        },
        {
            text: "Account",
            icon: <AccountBoxIcon color="secondary" />,
            onClick: () => history.push("/Profile")
        },
        {
            text: "Member",
            icon: <GroupIcon from color="secondary" />,
            onClick: () => history.push("/Member")
        },
        {
            text: "Budget",
            icon: <AccountBalanceWalletIcon color="secondary" />,
            onClick: () => history.push("/Budget")
        },
        {
            text: "Announcement",
            icon: <AnnouncementIcon color="secondary" />,
            onClick: () => history.push("/Announcement")
        },
        {
            text: "Project",
            icon: < AccountTreeIcon color="secondary" />,
            onClick: () => history.push("/Project")
        },


    ];
    const logout = event => {
        event.preventDefault();
        localStorage.clear();
        history.push('/Login');
    }


    return (

        < MuiThemeProvider theme={backgroundColor} >
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Avatar
                            className={classes.large}
                            alt="CSSEC Logo" src={`${REACT_APP_HOST_URL}/storage/images/csseclogo.png`}
                        />
                        <Typography variant="h5">
                            <Box fontWeight="fontWeightBold" m={1}>
                                COMPUTER STUDIES STUDENTS
                                EXECUTIVE COUNCIL
                            </Box>
                        </Typography>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={logout}

                                >
                                    Logout
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <MUIDrawer
                    variant="permanent" className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <br />
                        <br />
                        <br />
                        <Box
                            alignItems="center"
                            display="flex"
                            flexDirection="column"
                        >
                            <Avatar alt="" src={url} className={classes.large} />
                        </Box>
                        <Typography variant="h6">
                            <Box
                                color="#FFFFFF"
                                fontWeight="fontWeightBold" m={1}
                                textAlign="center"
                            >
                                {sName}
                            </Box>
                        </Typography>
                        <Typography component="h6">
                            <Box
                                color="#ACACAC"
                                fontWeight="fontWeightLight" m={1}
                                textAlign="center"
                            >
                                {sRole}
                            </Box>
                        </Typography>
                        <hr />
                        <List>
                            {itemsList.map((item, index) => {
                                const { text, icon, onClick } = item;
                                return (
                                    <ListItem button key={text} onClick={onClick}>
                                        {icon && <ListItemIcon >{icon}</ListItemIcon>}
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary={text} />
                                    </ListItem>
                                );
                            })}
                        </List>   </div>
                </MUIDrawer>
            </div></MuiThemeProvider >
    );
};

export default withRouter(Navbar);
