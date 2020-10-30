import React from 'react';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table'
import Axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import REACT_APP_HOST_URL from '../config';
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { TablePagination } from '@material-ui/core';
import SecureLS from 'secure-ls';

export default function Member() {
    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(20),
        },
        paper: {
            backgroundColor: '#1F1F32',
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            height: 250,
            marginLeft: 200
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '100ch',
            },
        },
        root1: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100ch',
                height: '10ch',
            },
        },
        input: {
            color: "white"
        },
        inputRoot: {
            color: '#FFFFFF',
        },
        button: {
            display: 'block',
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        dialog: {
            marginLeft: theme.spacing(1),
        },
        multilineColor: {
            color: "#FFFFFF"
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
    var ls = new SecureLS();
    let data = ls.get('data');
    const [members, setMembers] = React.useState({});
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [role, setRole] = React.useState()
    const [userId, setUserId] = React.useState(0)
    const [errorMsg, setErrorMsg] = React.useState("")
    const [showActions, setShowActions] = React.useState("")
    const [roles, setRoles] = React.useState([])
    let history = useHistory();
    const classes = useStyles();

    React.useEffect(() => {
        loadData()
    }, [])
    const loadData = () => {
        Axios.get(`${REACT_APP_HOST_URL}/api/userList`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                // const members = response.data.data;
                setMembers(response.data)
                checkCredentials()
                setIsLoaded(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const checkCredentials = () => {
        if (data.role === "ADMIN" || data.role === "CS REP") {
            setShowActions(true)
            if (data.role === "ADMIN") {
                setRoles(rolesA)
            }
            else if (data.role === "CS REP") {
                setRoles(rolesC)
            }
            return
        }
        return
    }
    const handleOpen = (rowData) => {
        setRole(rowData.role)
        setUserId(rowData.id);
        setOpen(true);
    };

    const handleClose = () => {
        setErrorMsg("")
        setOpen(false);
    };
    const handleSubmit = e => {
        e.preventDefault()

        let temp = {
            role: role,
        }

        Axios.put(`${REACT_APP_HOST_URL}/api/user/updateRole/${userId}`, temp, {
            headers: {
                'Authorization': "Bearer " + data.token,
            }
        })
            .then(response => {
                loadData()
                handleClose()
            })
            .catch(error => {
                console.log(error.response);
                setErrorMsg(error.response.data.message)
            })

    }
    const rolesC = [
        { role: 'EXECUTIVE SECRETARY' },
        { role: 'EXTERNAL VP' },
        { role: 'INTERNAL VP' },
        { role: 'SECRETARY' },
        { role: 'TREASURER' },
        { role: 'AUDITOR' },
        { role: 'PUBLIC RELATIONS OFFICER' },
        { role: 'YEAR REP' },
        { role: 'COMMITTEE HEAD' },
        { role: 'MEMBER' },

    ];
    const rolesA = [
        { role: 'CSSEC MODERATOR' },
        { role: 'CS REP' },
        { role: 'EXECUTIVE SECRETARY' },
        { role: 'EXTERNAL VP' },
        { role: 'INTERNAL VP' },
        { role: 'SECRETARY' },
        { role: 'TREASURER' },
        { role: 'AUDITOR' },
        { role: 'PUBLIC RELATIONS OFFICER' },
        { role: 'YEAR REP' },
        { role: 'COMMITTEE HEAD' },
        { role: 'MEMBER' },

    ];

    return (
        isLoaded &&
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid item xs={4}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            fontSize={18}>
                            Dashboard / Members
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            title="Members"
                            style={{
                                backgroundColor: "#1F1F32",
                                color: "#FFFFFF",
                            }}
                            columns={[
                                {
                                    field: 'id', hidden: true
                                },
                                // {
                                //     title: 'Avatar', field: 'avatar', render: rowData => (
                                //         <Avatar alt="" src={`${REACT_APP_HOST_URL}/storage/images/${rowData.avatar}`} style={{ width: 50, borderRadius: '50%', height: 50 }} />)
                                // },
                                {
                                    title: 'Name', field: 'name',
                                },
                                {
                                    title: 'Email', field: 'email',
                                },
                                {
                                    title: 'Position', field: 'role',
                                },
                                {
                                    title: 'Phone Number', field: 'phone_number',
                                },
                            ]}
                            data={members.data}
                            options={{
                                pageSizeOptions: [5],
                                headerStyle: {
                                    backgroundColor: '#1F1F32',
                                    color: '#FFFFFF',

                                },
                                tableLayout: "auto",
                                draggable: false,
                                actionsColumnIndex: -1,
                                rowStyle: {
                                    color: 'white'
                                },
                                searchFieldStyle: {
                                    color: 'white'
                                },

                            }}
                            actions={[
                                rowData => ({
                                    icon: 'edit',
                                    iconProps: { style: { color: "white" } },
                                    tooltip: 'Edit User',
                                    onClick: (event, rowData) => handleOpen(rowData),
                                    hidden: (showActions == false)
                                }),
                            ]}
                            localization={{
                                header: {
                                    actions: ''
                                },
                            }}


                        />
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Box color="#FFFFFF"
                        fontWeight="fontWeightLight" m={1}
                        textAlign="right"
                        fontSize={18}>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                                <div className={classes.paper}>
                                    <Grid item xs={9}>
                                        <br />
                                        <Box
                                            color="#FFFFFF"
                                            display="flex"
                                            fontWeight="fontWeightRegular"
                                            fontSize={18}
                                            className={classes.dialog}
                                        >
                                            Update Role
                                                </Box>
                                    </Grid>
                                    <div>
                                        <Box
                                            color="red"
                                            fontWeight="fontWeightRegular"
                                            marginBottom={2}
                                            marginLeft={1}
                                        >
                                            {errorMsg}
                                        </Box>
                                    </div>
                                    <form>
                                        <Autocomplete
                                            id="combo-box-demo"
                                            options={roles}
                                            getOptionLabel={(option) => option.role}
                                            defaultValue={{ role: role }}
                                            onInputChange={(e, v) => setRole(v)}
                                            classes={{ inputRoot: classes.inputRoot }}
                                            style={{ width: 300 }}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    label="Position"
                                                    color="secondary"
                                                    value={role}
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        className: classes.multilineColor
                                                    }}
                                                />
                                            }
                                        />
                                        <br />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            // type="submit"
                                            // value="Submit"
                                            onClick={handleSubmit}
                                        >
                                            Update Role
                                            </Button>
                                    </form>
                                </div>
                            </Fade>
                        </Modal>
                    </Box>
                </Grid>
            </main>
        </MuiThemeProvider >
    );


}




