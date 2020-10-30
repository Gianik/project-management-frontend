import React from 'react';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
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
    input2: {
        color: "#6265AF"
    },
    root: {
        maxWidth: 300,
        backgroundColor: '#303049',
        color: '#FFFFFF',
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
        paddingTop: "8px",

    },
    cardContent: {
        marginLeft: "15px",
    },
    large: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    text: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
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
    const [title, setTitle] = React.useState('');
    const [sDate, setSDate] = React.useState(new Date());
    const [fDate, setFDate] = React.useState(new Date());
    const [priority, setPriority] = React.useState('High');
    const [desc, setDesc] = React.useState('');
    const [errorMsg, setErrorMSG] = React.useState('')
    var ls = new SecureLS();
    let data = ls.get('data');
    let history = useHistory()
    const submitHandler = (e) => {
        e.preventDefault()
        const valid = isValid()
        let temp = {
            title: title,
            sDate: format(sDate, 'yyyy/MM/dd'),
            fDate: format(fDate, 'yyyy/MM/dd'),
            priority: priority,
            desc: desc,
            id: data.userId
        }

        if (valid) {
            Axios.post(`${REACT_APP_HOST_URL}/api/createProject`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    console.log(response)
                    history.push('/Project')
                }
                )
                .catch(error => {
                    console.log(error)
                })
        }

    }
    const isValid = () => {
        if (title == "" || sDate == "" || fDate == "" || priority == "" || desc == "" || data.userId == "") {
            setErrorMSG("Please fill out all fields")
            return false
        }
        else if (sDate >= fDate) {
            setErrorMSG("Invalid Dates")
            return false
        }
        setErrorMSG("")
        return true
    }



    return (
        <MuiThemeProvider theme={backgroundColor}>

            <main className={classes.content}>
                <form onSubmit={submitHandler}>


                    <Grid container spacing={12}>
                        <Grid item xs={9}>
                            <Box
                                color="#FFFFFF"
                                fontWeight="fontWeightLight" m={1}
                                fontSize={18}
                            >
                                Dashboard / Projects / Create Project
                        </Box>
                        </Grid>
                        <Grid item xs={4} className={classes.gridContainer}>
                            <Box
                                color="#FFFFFF"
                                fontWeight="fontWeightLight" m={1}
                                fontSize={18}
                            >
                                <Typography variant="h6">Create a new project</Typography>
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
                                <Grid container spacing={0}>
                                    <Grid item xs={5}>
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightRegular"
                                            fontSize={16}
                                            paddingBottom={1}
                                        >
                                            Project Name
                                    </Box>
                                    </Grid>
                                    <Box
                                        color="red"
                                        fontWeight="fontWeightRegular"
                                        fontSize={18}
                                        marginLeft={47}
                                    >
                                        {errorMsg}
                                    </Box>

                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        id="outlined-full-width"
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        value={title}
                                        name="title"
                                        onChange={e => setTitle(e.target.value)}
                                        InputLabelProps={{
                                            className: classes.multilineColor
                                        }}
                                        InputProps={{
                                            className: classes.input
                                        }}
                                    />
                                </Grid>
                                <Grid container spacing={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid item xs={3}>
                                            <KeyboardDatePicker

                                                variant="inline"
                                                color="secondary"
                                                format="yyyy/MM/dd"
                                                margin="normal"
                                                id="start-date"
                                                label="Start Date"
                                                value={sDate}
                                                name="sDate"
                                                // onChange={handleDateChange1}
                                                onChange={(date) => setSDate(date)}
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
                                        <Grid item xs={3}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                color="secondary"
                                                format="yyyy/MM/dd"
                                                margin="normal"
                                                id="end-date"
                                                label="End Date"
                                                name="fDate"
                                                value={fDate}
                                                onChange={date => setFDate(date)}
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
                                        <Grid item xs={2} className={classes.gridContainer2}>
                                            <form noValidate autoComplete="off">
                                                <TextField

                                                    select
                                                    fullWidth
                                                    className={classes.gridContainer2}
                                                    color="secondary"
                                                    label="Project Priority"
                                                    defaultValue="None"
                                                    name="priority"
                                                    value={priority}
                                                    onChange={e => setPriority(e.target.value)}
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
                                            </form>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Box
                                    color="#FFFFFF"
                                    fontWeight="fontWeightRegular"
                                    fontSize={16}
                                    paddingBottom={1}
                                    paddingTop={2}
                                >
                                    Description
                            </Box>
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    color="secondary"
                                    rows={15}
                                    fullWidth
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    name="desc"
                                    variant="outlined"
                                    InputLabelProps={{
                                        className: classes.multilineColor
                                    }}
                                    InputProps={{
                                        className: classes.input
                                    }}
                                />
                                <Grid container spacing={12}>
                                    <Grid item xs={8} className={classes.gridContainer2}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            component={Link}
                                            to="/Project"
                                        >
                                            Cancel
                                    </Button>
                                    </Grid>
                                    <Grid item xs={4} className={classes.gridContainer2}>
                                        <Box
                                            marginLeft={23}
                                            paddingBottom={1}
                                        >
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                type="submit"
                                            >
                                                Create Project
                                    </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </main>
        </MuiThemeProvider>
    );
}