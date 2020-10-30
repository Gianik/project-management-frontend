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
import REACT_APP_HOST_URL from '../config';
import Axios from 'axios';
import SecureLS from 'secure-ls';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
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
        },
    }
});


export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                email: "",
                password: "",
            },
            inputError: "",

        }
    }

    changeHandler = (e) => {
        let { user } = this.state;
        user[e.target.name] = e.target.value;
        this.setState({ user });
    }

    validate = () => {
        let inputError = "";

        if ((this.state.user.email).length === 0 || (this.state.user.password).length === 0) {
            inputError = "Please fill out all fields"
            this.setState({ inputError })
            return false
        }
        if (!this.state.user.email.includes("@")) {
            inputError = "Invalid Email";
            this.setState({ inputError })
            return false
        }

        return true
    }


    submitHandler = (e) => {
        e.preventDefault();
        const isValid = this.validate();
        // console.log(this.state.user)

        if (isValid) {
            Axios.post(`${REACT_APP_HOST_URL}/api/login`, this.state.user)
                .then(response => {


                    let userData = {
                        name: response.data.name,
                        email: response.data.email,
                        avatar: response.data.avatar,
                        token: response.data.token,
                        userId: response.data.userId,
                        role: response.data.role
                    };
                    var ls = new SecureLS();
                    ls.set('data', userData)

                    // localStorage['userData'] = JSON.stringify(userData);
                    this.props.history.push('/Dashboard');

                })
                .catch(error => {
                    let inputError = "Wrong Username or Password";
                    this.setState({ inputError })
                    console.log(error)
                })
        }
    }
    render() {
        const { user } = this.state
        return (
            <MuiThemeProvider theme={backgroundColor}>
                <Container component="main" maxWidth="xs">
                    <Box bgcolor="secondary.main" border={1} borderRadius={16} p={2} mx={-1} my={25} borderColor="#6E6484">
                        <div className={useStyles.paper}>
                            <Typography component="h1" variant="h5" align="center" color="error">
                                COMPUTER STUDIES STUDENTS
                                EXECUTIVE COUNCIL
                                <hr color="white"></hr>

                            </Typography>
                            <div style={{ color: "#D12929" }}>
                                {this.state.inputError}
                            </div>
                            <form className={useStyles.form} onSubmit={this.submitHandler}>
                                <TextField

                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth

                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoFocus
                                    value={user.email}
                                    onChange={this.changeHandler}
                                // style={{
                                //     backgroundColor: "white"
                                // }}
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
                                    value={user.password}
                                    onChange={this.changeHandler}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"

                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                    </Grid>
                                    <Grid item>
                                        <br />
                                        <Link to="/Registration" href="#" variant="body2"
                                            style={{
                                                textDecoration: 'none',
                                                fontSize: 20
                                            }}
                                        >

                                            {"Sign Up"}
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

export default Login;

