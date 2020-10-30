import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Axios from 'axios';
import REACT_APP_HOST_URL from '../config'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
        color: 'white'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const backgroundColor = createMuiTheme({
    palette: {
        background: {
            default: "#303049"
        },
        primary: {
            main: "#52399B"
        },
        secondary: {
            main: "#6E6484"
        },
        error: {
            main: "#FFFFFF"
        }
    }
});



export class Registration extends Component {
    constructor(props) {
        super(props)

        this.state = {
            newUser: {
                name: "",
                email: "",
                password: "",

            },
            inputError: "",

        }
    }
    changeHandler = (e) => {
        let { newUser } = this.state;
        newUser[e.target.name] = e.target.value;
        this.setState({ newUser });
    }
    validate = () => {

        let inputError = "";
        if ((this.state.newUser.name).length === 0 || (this.state.newUser.email).length === 0 || (this.state.newUser.password).length === 0) {
            inputError = "Please fill out all fields";
            this.setState({ inputError })
            return false
        }
        if (!this.state.newUser.email.includes("@")) {
            inputError = "Invalid Email";
            this.setState({ inputError })
            return false
        }
        if ((this.state.newUser.password).length < 8 || (this.state.newUser.password).length > 15) {
            inputError = "Password should be within 8 to 15 characters";
            this.setState({ inputError })
            return false
        }


        return true
    }

    submitHandler = (e) => {
        e.preventDefault();
        const isValid = this.validate();
        if (isValid) {
            console.log(this.state.newUser);
            Axios.post(`${REACT_APP_HOST_URL}/api/register`, this.state.newUser)
                .then(response => {

                    this.props.history.push('/Login');
                })
                .catch(error => {
                    let inputError = "User already Exists";
                    this.setState({ inputError })
                    console.log(error)
                })
        }
    }

    render() {
        const { newUser } = this.state


        return (
            <MuiThemeProvider theme={backgroundColor}>
                <Container component="main" maxWidth="xs">
                    <Box bgcolor="secondary.main" border={1} borderRadius={16} p={2} mx={-1} my={25} borderColor="#6E6484">
                        <div className={useStyles.paper}>
                            <Typography component="h1" variant="h5" align="center" color="white">
                                COMPUTER STUDIES STUDENTS
                                EXECUTIVE COUNCIL
                                <hr color="white"></hr>
                                <div style={{ color: "red" }}>
                                    {this.state.inputError}
                                </div>
                            </Typography>
                            <form className={useStyles.form} noValidate onSubmit={this.submitHandler}>
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth

                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={newUser.name}
                                    onChange={this.changeHandler}
                                    autoFocus
                                />
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    multiline

                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={newUser.email}
                                    onChange={this.changeHandler}
                                    autoFocus
                                />
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth

                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={newUser.password}
                                    onChange={this.changeHandler}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={useStyles.submit}

                                >
                                    Sign Up
                            </Button>
                                <Grid container>
                                    <Grid item xs>
                                    </Grid>
                                    <Grid item>
                                        <br />
                                        <Link to="/Login" href="#" variant="body2"
                                            style={{
                                                textDecoration: 'none',
                                                fontSize: 20
                                            }}
                                        >
                                            {"Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                        <Box mt={8}>
                        </Box>
                    </Box>
                    <CssBaseline />
                </Container >
            </MuiThemeProvider>
        );
    }
}

export default Registration;

