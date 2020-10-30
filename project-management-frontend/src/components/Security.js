import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
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
    input: {
        color: '#ACACAC',
    },
    form: {
        width: '37ch',
        marginTop: theme.spacing(1),
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
            main: "#52399B"
        },
        error: {
            main: "#FFFFFF"
        },
    }
});


export default function Security() {
    const classes = useStyles();
    var ls = new SecureLS();
    let data = ls.get('data');
    const [value, setValue] = React.useState(1);
    const [pass1, setPass1] = React.useState("");
    const [pass2, setPass2] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    let history = useHistory();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleSubmit = (e) => {
        e.preventDefault()


        const isValid = validate();
        let submit = {
            password: pass1
        }
        console.log(submit);
        if (isValid) {
            Axios.post(`${REACT_APP_HOST_URL}/api/user/updatepassword/${data.userId}`, submit, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    setPass1("")
                    setPass2("")
                    setErrorMsg("Password Updated")
                })
                .catch(error => {
                    console.log(error);
                })
        }

    }
    const validate = () => {
        if ((pass1).length < 8 || (pass1).length > 15) {
            setErrorMsg("Password should be within 8 to 15 characters*")
            return false
        }
        else if (pass1 != pass2) {
            setErrorMsg("Password does not match*");
            return false
        }
        setErrorMsg("");
        return true

    }

    return (
        <MuiThemeProvider theme={backgroundColor}>

            <div className={classes.root}>
                <main className={classes.content}>
                    <form onSubmit={handleSubmit}>
                        <Toolbar>
                            <Grid container spacing={12}>
                                <Grid item xs={3}>
                                    <Box
                                        color="#FFFFFF"
                                        fontWeight="fontWeightLight" m={1}
                                        fontSize={18}
                                    >
                                        Dashboard / Account
                                </Box>
                                </Grid>
                                <Grid item xs={12} />
                                <Grid item xs={3}>
                                    <Typography>
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightBold" m={1}
                                            fontSize={20}
                                        >
                                            Settings
                                    </Box>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} />
                                <Grid item xs={12}>
                                    <Tabs
                                        value={value}
                                        indicatorColor="secondary"
                                        textColor="primary2"
                                        onChange={handleChange}
                                        className={classes.tab}
                                    >
                                        <Tab
                                            label="GENERAL"
                                            component={Link}
                                            to="/Profile"
                                        />
                                        <Tab
                                            label="SECURITY"
                                            component={Link}
                                            to="/Security"
                                        />
                                    </Tabs>
                                    <hr />
                                    <br />
                                </Grid>
                                <Grid item xs={12} />
                                <Grid item xs={8}>
                                    <Box

                                        display="flex"
                                        flexDirection="column"
                                        border={1}
                                        borderRadius={16}
                                        p={2}
                                        borderColor="#1F1F32"
                                        bgcolor="primary.main"
                                        marginLeft={2}
                                    >
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}>
                                                <Box
                                                    paddingLeft={2}
                                                    color="#FFFFFF"
                                                    fontSize={18}
                                                    fontWeight="fontWeightRegular"
                                                >
                                                    Change Password
                                            </Box>
                                            </Grid>
                                            <Box
                                                color="#D12929"
                                                fontSize={16}
                                                paddingLeft={40}
                                                fontWeight="fontWeightLight"
                                            >
                                                {errorMsg}
                                            </Box>
                                        </Grid>
                                        <Box paddingLeft={2}>
                                            <hr />
                                        </Box>

                                        <div>
                                            <Box
                                                marginRight={10}
                                            >
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    color="secondary"
                                                    label="New Password"
                                                    type="password"
                                                    defaultValue=" "
                                                    inputProps={{
                                                        className: classes.multilineColor,
                                                    }}
                                                    InputLabelProps={{
                                                        className: classes.input
                                                    }}
                                                    className={classes.form}
                                                    onChange={e => setPass1(e.target.value)}
                                                    value={pass1}
                                                />
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    color="secondary"
                                                    type="password"
                                                    label="Confirm New Password"
                                                    defaultValue=" "
                                                    inputProps={{
                                                        className: classes.multilineColor
                                                    }}
                                                    InputLabelProps={{
                                                        className: classes.input
                                                    }}
                                                    className={classes.form}
                                                    onChange={e => setPass2(e.target.value)}
                                                    value={pass2}
                                                />
                                            </Box>
                                            <Box paddingLeft={2}>
                                                <hr />
                                            </Box>
                                            <Box
                                                paddingLeft={2}
                                                color="#FFFFFF"
                                                fontSize={18}
                                                fontWeight="fontWeightRegular"
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    type="submit"
                                                >
                                                    Save Changes
                                                    </Button>
                                            </Box>
                                        </div>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </form>
                </main>
            </div>

        </MuiThemeProvider >
    );

}
