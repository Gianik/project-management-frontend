import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
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
import { Input } from '@material-ui/core';
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
        width: '34ch',
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


export default function Profile() {
    var ls = new SecureLS();
    let data = ls.get('data');
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [file, setFile] = React.useState("");
    const [url, setURL] = React.useState("");
    const [sName, setSName] = React.useState("")
    const [sRole, setSRole] = React.useState("")
    const [isLoaded, setIsLoaded] = React.useState(false);
    let history = useHistory();

    React.useEffect(() => {

        Axios.get(`${REACT_APP_HOST_URL}/api/user/${data.userId}/detail`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                setSName(response.data.name)
                setName(response.data.name)
                setEmail(response.data.email)
                setNumber(response.data.phone_number)
                setSRole(response.data.role)
                setURL(`${REACT_APP_HOST_URL}/storage/images/${response.data.avatar}`)
                setIsLoaded(true)
            })
            .catch(error => {

            })

    }, [])
    const imageHanlder = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setURL(reader.result)

            }
        }
        reader.readAsDataURL(e.target.files[0])
        setFile(e.target.files[0])

    }
    const submitHandler = e => {

        e.preventDefault()

        const fd = new FormData();
        fd.append('name', name)
        fd.append('email', email)
        fd.append('number', number)
        fd.append('file', file)
        fd.append('id', data.userId)


        Axios.post(`${REACT_APP_HOST_URL}/api/user/edit`, fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': "Bearer " + data.token,
            }
        })
            .then(response => {
                setSName(name)

                history.push('/Profile')

            })
            .catch(error => {
                console.log(error);

            })
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <div className={classes.root}>
                <main className={classes.content}>
                    <form onSubmit={submitHandler} enctype='multipart/form-data'>
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
                                <Grid item xs={6}>
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
                                <Grid item xs={3}>
                                    <Box
                                        alignItems="center"
                                        display="flex"
                                        flexDirection="column"
                                        border={1}
                                        borderRadius={16}
                                        p={2}
                                        borderColor="#1F1F32"
                                        bgcolor="primary.main"
                                    >
                                        <Avatar alt="" src={url} className={classes.large} />
                                        <Typography variant="h6">
                                            <Box
                                                color="#FFFFFF"
                                                fontWeight="fontWeightBold"
                                                textAlign="center"
                                            >
                                                {sName}
                                            </Box>
                                        </Typography>
                                        <Typography variant="h6">
                                            <Box
                                                color="#ACACAC"
                                                fontWeight="fontWeightLight"
                                                textAlign="center"
                                                fontSize={18}
                                            >
                                                {sRole}
                                            </Box>
                                        </Typography>

                                        <Button>
                                            <Box
                                                color="#FFFFFF"
                                                fontWeight="fontWeightBold"
                                                fontSize={12}
                                                textAlign="center"
                                            >
                                                <label htmlFor="upload-photo">
                                                    <input
                                                        id="upload-photo"
                                                        type="file"
                                                        accept="image/*"
                                                        name="image"

                                                        style={{ display: 'none' }}
                                                        onChange={imageHanlder}
                                                    // onChange={e => setURL(URL.createObjectURL(e.target.files[0]), setFile(e.target.files[0]))}
                                                    />
                                                    <Button color="secondary" variant="contained" component="span">
                                                        Change Picture
                                            </Button>
                                                </label>
                                            </Box>
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={9}>
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
                                        <Box
                                            paddingLeft={2}
                                            color="#FFFFFF"
                                            fontSize={18}
                                            fontWeight="fontWeightRegular"
                                        >
                                            Profile
                                        <hr />
                                        </Box>
                                        <div>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                color="secondary"
                                                label="Full Name"
                                                inputProps={{
                                                    className: classes.multilineColor,
                                                }}
                                                InputLabelProps={{
                                                    className: classes.input
                                                }}
                                                className={classes.form}
                                                defaultValue={name}
                                                onChange={e => setName(e.target.value)}
                                                value={name}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                color="secondary"
                                                label="Email"
                                                inputProps={{
                                                    className: classes.multilineColor
                                                }}
                                                InputLabelProps={{
                                                    className: classes.input
                                                }}
                                                className={classes.form}
                                                defaultValue={email}
                                                onChange={e => setEmail(e.target.value)}
                                                value={email}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                color="secondary"
                                                label="Phone Number"
                                                inputProps={{
                                                    className: classes.multilineColor
                                                }}
                                                InputLabelProps={{
                                                    className: classes.input
                                                }}
                                                className={classes.form}
                                                onChange={e => setNumber(e.target.value)}
                                                value={number}
                                            />
                                            <Box
                                                paddingLeft={2}
                                                color="#FFFFFF"
                                                fontSize={18}
                                                fontWeight="fontWeightRegular"
                                            >
                                                <hr />
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
