import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Axios from 'axios'
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import REACT_APP_HOST_URL from '../config';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SecureLS from 'secure-ls';
const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: "20px",
    },
    button: {
        marginRight: "15px",
    },
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
        height: 550,
        marginLeft: 200
    },
    paper1: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
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
        color: '#ACACAC',
    },
    box: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
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

function Announcement({ navigation }) {
    var ls = new SecureLS();
    let data = ls.get('data');
    const [desc, setDesc] = useState('')
    const [announceName, setAnnounceName] = useState('')
    const [announceData, setAnnounceData] = useState({})
    const [rowId, setRowId] = React.useState(0);
    const classes = useStyles();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [errorM, seterrorM] = React.useState(false);
    const [showActions,setShowActions]=React.useState(false)

    let history = useHistory();
    useEffect(() => {
        updateData()
        setIsLoaded(true)
    }, [])
    const handleSubmit = (event) => {
        event.preventDefault()
        const valid = validate();
       
        let temp = {
            title: announceName,
            content: desc,
            id: data.userId,
        }
        console.log(temp)
        if (valid) {
            Axios.post(`${REACT_APP_HOST_URL}/api/annoucementAdd`, temp,{
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    updateData()
                    handleClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
       
    }
    const updateData = () => {
        Axios.get(`${REACT_APP_HOST_URL}/api/announceList`,{
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                checkCredentials()
                setAnnounceData(response.data)
                setIsLoaded(true)

            })
            .catch(error => {
                console.log(error)
            })
    }
    const checkCredentials = () =>{
        if(data.role==="ADMIN"||data.role==="CS REP"||data.role==="PUBLIC RELATIONS OFFICER"){
            setShowActions(true)
            return
        }
        return
    }
    const [delAnnounce, setdelAnnounce] = React.useState(false);
    const openDelete = () => {
        setdelAnnounce(true);
    };
    const closeDelete = () => {
        setdelAnnounce(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const deletion = () => {

        Axios.delete(`${REACT_APP_HOST_URL}/api/deleteAnnouncement/${rowId}`,{
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                console.log(response)
                updateData()
                closeDelete()
            })
            .catch(error => {
                console.log(error);
            })
    };

    const confirmDelete = (rowData) => {
        setRowId(rowData)
        openDelete()
    };
    const viewAnnouncement = (data) => {

        history.push({
            pathname: '/ViewAnnouncement',
            data: data,
        })

     
    }
    const validate = () => {
        if (announceName== "" || desc == "") {
            seterrorM("Please fill in all fields")
      
            return false
        } else
        seterrorM("")
        return true
    }
    return (
        isLoaded &&
        < MuiThemeProvider theme={backgroundColor} >
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid item xs={5}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            fontSize={18}>
                            Dashboard / Announcements
                            
                        </Box>
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
                                            <Box
                                                className={classes.box}
                                                color="#FFFFFF"
                                                display="flex"
                                                fontWeight="fontWeightRegular"
                                                fontSize={18}
                                                flexDirection="left"
                                            >
                                                Dashboard / Management / Add Announcement<p></p>
                                            </Box>
                                        </Grid>
                                        <Box
                                            color="red"
                                            display="flex"
                                            fontSize={16}
                                            fontWeight="fontWeightRegular"
                                            marginBottom={1}
                                            marginLeft={1}
                                            flexDirection="column"
                                        >
                                            {errorM}
                                        </Box>
                                        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                                            <TextField variant="filled"
                                                id="outlined-basic"
                                                label="Name"
                                                color="secondary"
                                                variant="filled"
                                                name="announceName"
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.inputRoot
                                                }}
                                                onChange={e => setAnnounceName(e.target.value)}
                                                value={announceName}
                                            />
                                            <br />
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                color="secondary"
                                                multiline
                                                rows={10}
                                                variant="filled"
                                                name="desc"
                                                InputProps={{
                                                    className: classes.input
                                                }}
                                                InputLabelProps={{
                                                    className: classes.inputRoot
                                                }}
                                                onChange={e => setDesc(e.target.value)}
                                                value={desc}
                                            />
                                            <Grid item xs={6} >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    value="Submit"
                                                    onClick={handleSubmit}
                                                >
                                                    Create Announcement
                                                </Button>
                                            </Grid>
                                        </form>
                                    </div>
                                </Fade>
                            </Modal>
                        </Box>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <MaterialTable style={{
                            backgroundColor: "#1F1F32",
                            color: "#FFFFFF",
                        }}
                            width="100%"
                            title="Announcements"
                            columns={[
                                {
                                    field: 'id', hidden: true
                                },
                                {
                                    title: 'Name', field: 'title',

                                },
                                {
                                    title: 'Date Created', field: 'date_updated',

                                },
                                {
                                    title: 'Content', field: 'content',
                                    hidden: true
                                },
                                {
                                    title: 'Created By', field: 'user.name',

                                },

                            ]}
                            data={announceData.data}
                            actions={[
                                {
                                    icon: 'add',
                                    iconProps: { style: { color: "white" } },
                                    tooltip: 'Add Announcement',
                                    isFreeAction: true,
                                    onClick: handleOpen,
                                    hidden:(showActions==false)
                                },
                                rowData => ({
                                    icon: 'delete',
                                    iconProps: { style: { color: "white" } },
                                    tooltip: 'Delete Announcement',
                                    onClick: (event, rowData) => confirmDelete(rowData.id),
                                    hidden:(showActions==false)
                                })
                            ]}
                            options={{
                                pageSizeOptions: [5],
                                headerStyle: {
                                    backgroundColor: '#1F1F32',
                                    color: '#FFF'
                                },
                                searchFieldStyle: {
                                    color: 'white'
                                },
                                tableLayout: "auto",
                                draggable: false,
                                actionsColumnIndex: -1,
                            }}
                            localization={{
                                header: {
                                    actions: ''
                                },
                            }}
                            onRowClick={(event, rowData) => history.push(`viewAnnouncement/${rowData.id}`)}
                            
                        />
                    </Grid>
                </Grid>
                <Dialog open={delAnnounce} onClose={closeDelete} aria-labelledby="form-dialog-title" >
                    <div className={classes.paper1}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            textAlign="right"
                            fontSize={18}
                        >
                            <DialogContent className={classes.dialog}>
                                <Grid item xs={10}>
                                    <br />
                                    <Box className={classes.Left} alignItems="left"
                                        color="#FFFFFF"
                                        display="flex"
                                        flexDirection="left" p={1}
                                    >
                                        Delete Announcement?
                                                </Box>
                                </Grid>
                                <Grid container spacing={0} className={classes.container}><Box
                                    marginLeft={22}
                                    paddingBottom={1}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={deletion}
                                        className={classes.button}
                                    >
                                        Yes
                                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={closeDelete}
                                    >
                                        No
                                                    </Button>
                                </Box>
                                </Grid>
                            </DialogContent>
                        </Box>
                    </div>
                </Dialog>
            </main>
        </MuiThemeProvider >
    );

}

export default Announcement;
