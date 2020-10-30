import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useParams, useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import { AssignmentReturnOutlined } from '@material-ui/icons';
import SecureLS from 'secure-ls';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    root: {
        display: 'flex',
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

    multilineColor: {
        color: '#52399B',
    },
    form: {
        width: '37ch',
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
    },
    grid: {
        marginTop: theme.spacing(2),
    },
    gridContainer2: {
        paddingTop: "5px",
    },
    root1: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
            height: '10ch',
        },
    },
    root2: {
        '& > *': {
            margin: theme.spacing(1),
            width: '500px',
        },
    },
    dialog: {
        backgroundColor: '#1F1F32',
    },
    paper1: {
        backgroundColor: '#1F1F32',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height: 300,
        marginLeft: 200
    },
    paper2: {
        backgroundColor: '#1F1F32',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height: 400,
        marginLeft: 200,
        border: '2px solid #303049',
    },
    paper3: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
    },
    paper: {
        backgroundColor: '#1F1F32',
        border: '2px solid #303049',
    },
    input: {
        color: "white"
    },
    inputRoot: {
        color: '#FFFFFF',
    },
    box: {
        marginBottom: theme.spacing(1),
    },
    expenseBox: {
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




export default function Budget() {
    const classes = useStyles();
    const { id } = useParams();
    //update budget
    const [newBudget, setNewBudget] = React.useState(0);
    //add Exponse
    const [eName, setEName] = React.useState("");
    const [ePrice, setEPrice] = React.useState(0);
    const [eMemberId, setEMemberId] = React.useState(0)
    //edit expense
    const [nEName, setNEName] = React.useState("");
    const [nEPrice, setNEPrice] = React.useState(0);
    const [nEMemberName, setNEMemberName] = React.useState("")
    const [nEMemberId, setNEMemberId] = React.useState(0)
    const [rowId, setRowId] = React.useState(0);
    const [tempNEPrice, setTempNEPrice] = React.useState(0)
    var ls = new SecureLS();
    let data = ls.get('data');
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [budgetData, setBudgetData] = React.useState({});
    const [delAnnounce, setdelAnnounce] = React.useState(false);
    const [budgetError, setbudgetError] = React.useState("");
    const [expenseError, setexpenseError] = React.useState("");
    const [expenseErrorEdit, setexpenseErrorEdit] = React.useState("");
    const [memberList, setMemberList] = React.useState([])
    const [showUpdateBudgetButton, setshowUpdateBudgetButton] = React.useState(false)
    const [showAddExpenseButton, setshowAddExpenseButton] = React.useState(false)
    const [showActions, setShowActions] = React.useState(false)

    // const [managerId, setManagerId] = React.useState("")
    const openDelete = () => {
        setdelAnnounce(true);
    };
    const closeDelete = () => {
        setdelAnnounce(false);
    };
    React.useEffect(() => {
        loadData();

    }, [])
    const loadData = () => {
        Axios.get(`${REACT_APP_HOST_URL}/api/budgetDetail/${id}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                setBudgetData(response.data[0])

                setMemberList(response.data[0].project.users)




                checkCredentials(response.data[0].project.user_id)
                setIsLoaded(true)

            })
            .catch(error => {
                console.log(error)
            })



    }
    const checkCredentials = (managerId) => {
        if (data.role == "MEMBER") {
            return
        }
        if (data.role === "TREASURER" || data.role === "ADMIN") {
            setshowUpdateBudgetButton(true)
            // setshowAddExpenseButton(true)
            setShowActions(true)
            if (data.role === "ADMIN") {
                setshowAddExpenseButton(true)
            }
            return
        }

        else if (data.userId = managerId || data.role === "ADMIN") {
            setshowAddExpenseButton(true)
            setShowActions(true)
            return
        }
        return

    }
    const editBudget = (e) => {
        e.preventDefault();
        let temp = {
            budget: newBudget
        }
        const validate = validateBudget();
        if (validate) {
            Axios.put(`${REACT_APP_HOST_URL}/api/budgetDetail/editBudget/${id}`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    console.log(response)
                    loadData();
                    updateBudgetClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const addExpenses = (e) => {
        e.preventDefault();
        let temp = {
            name: eName,
            price: ePrice,
            id: id,
            userId: eMemberId
        }
        const validate1 = validateExpense();
        if (validate1) {
            Axios.post(`${REACT_APP_HOST_URL}/api/expenses/createExpenses`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {

                    loadData();
                    setexpenseError("")
                    addExpenseClose();
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    const editExpenses = () => {
        let temp = {
            name: nEName,
            price: nEPrice,
            id: id,
            userId: nEMemberId
        }
        const isValid = validateEditExpense()
        if (isValid) {
            Axios.put(`${REACT_APP_HOST_URL}/api/expenses/editExpenses/${rowId}`, temp, {
                headers: {
                    'Authorization': "Bearer " + data.token
                }
            })
                .then(response => {
                    loadData();
                    editExpenseClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }


    }
    const deleteExpenses = (expensesId) => {
        let budgetId = id;
        Axios.delete(`${REACT_APP_HOST_URL}/api/deleteExpenses/${rowId}/${budgetId}`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {
                loadData()
                closeDelete()
            })
            .catch(error => {
                console.log(error);
            })
    }
    //handle change for autocomplete in add Expense
    const handleSearchChange = (e, v) => {
        if (v != null) {

            setEMemberId(v.id)

        }
        else {
            setEMemberId(0)
        }
    }
    //handle change for autocomplete in edit expense
    const handleSearchChange2 = (e, v) => {
        if (v != null) {

            setNEMemberId(v.id)
            setNEMemberId(v.name)
        }
        else {
            setNEMemberId(0)
        }
    }
    const confirmDelete = (rowData) => {
        setRowId(rowData)

        openDelete()
    };
    //handle Open
    const editExpenseOpen = (rowData) => {
        setRowId(rowData.id);
        setNEName(rowData.name)
        setNEPrice(rowData.expenses_price)
        setTempNEPrice(rowData.expense_price)
        setNEMemberId(rowData.user.id)
        setNEMemberName(rowData.user.name)
        setOpen2(true);
    };
    const addExpenseOpen = () => {
        setOpen(true);
    };
    const addExpenseClose = () => {
        setOpen(false);
    };

    const updateBudgetOpen = () => {
        setOpen1(true);
    };

    const updateBudgetClose = () => {
        setOpen1(false);
    };
    const editExpenseClose = () => {
        setOpen2(false);
    };
    const validateBudget = () => {
        if (newBudget === 0) {
            setbudgetError("Budget cannot be 0")
            return false

        } else if ((budgetData.remaining_budget - (budgetData.current_budget - newBudget)) < 0) {
            setbudgetError("New budget cannot be less than expenses")
            return false
        }
        setbudgetError("")
        return true
    };
    //add expense
    const validateExpense = () => {
        if (eName === "") {
            setexpenseError("Expense name cannot be empty")
            return false
        } else if (ePrice <= 0) {
            setexpenseError("Expense cannot be 0 or less")
            return false
        }
        else if (ePrice > budgetData.remaining_budget) {
            setexpenseError("Expense cannot be greater than remaining budget")
            return false
        }
        setexpenseError("")
        return true
    };
    const validateEditExpense = () => {
        if (nEName === "" || nEPrice === "" || nEMemberId === 0) {
            setexpenseErrorEdit("Please fill out all fields")
            return false
        } else if (nEPrice <= 0) {
            setexpenseErrorEdit("Expense cannot be 0 or less")
            return false
        }
        else if (nEPrice > (tempNEPrice + budgetData.remaining_budget)) {
            setexpenseErrorEdit("Expense cannot be greater than remaining budget")
            return false
        }
        setexpenseErrorEdit("")
        return true
    };

    return (
        isLoaded &&

        <MuiThemeProvider theme={backgroundColor}>
            <div className={classes.root}>
                <CssBaseline />
                <main className={classes.content}>
                    <Toolbar>
                        <Grid container spacing={12}>
                            <Grid item xs={9}>
                                <Box
                                    color="#FFFFFF"
                                    fontWeight="fontWeightLight" m={1}
                                    fontSize={18}
                                >
                                    Dashboard / Project Budget / View Budget
                                </Box>
                            </Grid>
                            <Grid item xs={4} className={classes.gridContainer}>
                                <Box
                                    color="#FFFFFF"
                                    fontWeight="fontWeightLight" m={1}
                                    fontSize={18}
                                >
                                    <Typography variant="h4">{budgetData.project.title} </Typography>

                                </Box>
                            </Grid>
                            <Grid item xs={12} />
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    border={1}
                                    borderRadius={16}
                                    p={2}
                                    borderColor="#1F1F32"
                                    bgcolor="primary.main"
                                >
                                    <Typography variant="h6">
                                        <Box
                                            color="#ACACAC"
                                            fontWeight="fontWeightLight"
                                        >
                                            Original Budget
                                        </Box>
                                    </Typography>
                                    <Typography variant="h6">
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightRegular"
                                            fontSize={32}
                                        >
                                            ₱{budgetData.original_budget.toLocaleString()}
                                        </Box>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
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
                                    <Typography variant="h6">
                                        <Box
                                            color="#ACACAC"
                                            fontWeight="fontWeightLight"
                                        >
                                            Current Budget
                                        </Box>
                                    </Typography>
                                    <Typography variant="h6">
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightLight"
                                            fontSize={32}
                                        >
                                            ₱{budgetData.current_budget.toLocaleString()}
                                        </Box>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
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
                                    <Typography variant="h6">
                                        <Box
                                            color="#ACACAC"
                                            fontWeight="fontWeightLight"
                                        >
                                            Remaining Budget
                                        </Box>
                                    </Typography>
                                    <Typography variant="h6">
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightRegular"
                                            fontSize={32}
                                        >
                                            ₱{budgetData.remaining_budget.toLocaleString()}
                                        </Box>
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        borderRadius={10}
                                        borderColor="#1F1F32"
                                        bgcolor="secondary.main"
                                    >
                                        {showUpdateBudgetButton && (
                                            <Button onClick={updateBudgetOpen}>
                                                <Typography>
                                                    <Box
                                                        color="#FFFFFF"
                                                        fontWeight="fontWeightBold"
                                                    >
                                                        Update Budget
                                                </Box>
                                                </Typography>
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
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
                                    <Typography variant="h6">
                                        <Box
                                            color="#ACACAC"
                                            fontWeight="fontWeightLight"
                                        >
                                            Number of Expenses
                                        </Box>
                                    </Typography>
                                    <Typography variant="h6">
                                        <Box
                                            color="#FFFFFF"
                                            fontWeight="fontWeightLight"
                                            fontSize={32}
                                        >
                                            {budgetData.expenses_count}
                                        </Box>
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        borderRadius={10}
                                        borderColor="#1F1F32"
                                        bgcolor="secondary.main"
                                    >
                                        {showAddExpenseButton && (
                                            <Button onClick={addExpenseOpen}>
                                                <Typography>
                                                    <Box
                                                        color="#FFFFFF"
                                                        fontWeight="fontWeightBold"
                                                    >
                                                        Add Expenses
                                                </Box>
                                                </Typography>
                                            </Button>)}
                                        <Grid item xs={3}>
                                            <Dialog open={open} onClose={addExpenseClose} aria-labelledby="form-dialog-title" >
                                                <div className={classes.paper}>
                                                    <Box color="#FFFFFF"
                                                        fontWeight="fontWeightLight" m={1}
                                                        textAlign="right"
                                                        fontSize={18}
                                                    >
                                                        <DialogContent className={classes.dialog}>
                                                            <Grid item xs={12}>
                                                                <br />
                                                                <Box
                                                                    className={classes.expenseBox}
                                                                    color="#FFFFFF"
                                                                    display="flex"
                                                                    fontWeight="fontWeightRegular"
                                                                    fontSize={18}
                                                                    flexDirection="left"
                                                                >
                                                                    Add Expense
                                                                </Box>
                                                            </Grid>
                                                            <Box
                                                                textAlign="left"
                                                                color="red"
                                                                display="flex"
                                                                fontSize={16}
                                                                fontWeight="fontWeightRegular"
                                                                marginBottom={1}
                                                                marginLeft={1}
                                                                flexDirection="column"
                                                            >
                                                                {expenseError}
                                                            </Box>
                                                            <form className={classes.root2} noValidate autoComplete="off">
                                                                <Autocomplete
                                                                    id="combo-box-demo"
                                                                    options={memberList}
                                                                    getOptionLabel={(option) => option.name}
                                                                    onChange={handleSearchChange}
                                                                    classes={{ inputRoot: classes.inputRoot }}
                                                                    style={{ width: 500 }}
                                                                    renderInput={(params) =>
                                                                        <TextField {...params}
                                                                            label="Name"
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            InputLabelProps={{
                                                                                className: classes.multilineColor
                                                                            }}
                                                                        />
                                                                    }
                                                                />
                                                                <TextField
                                                                    variant="outlined"
                                                                    id="outlined-basic"
                                                                    label="Expense Name"
                                                                    color="secondary"
                                                                    fullWidth
                                                                    InputProps={{
                                                                        className: classes.input
                                                                    }}
                                                                    InputLabelProps={{
                                                                        className: classes.multilineColor
                                                                    }}
                                                                    value={eName}
                                                                    onChange={e => setEName(e.target.value)}
                                                                />
                                                                <br />
                                                                <TextField
                                                                    variant="outlined"
                                                                    id="outlined-basic"
                                                                    label="Amount"
                                                                    color="secondary"
                                                                    type="number"
                                                                    fullWidth
                                                                    InputProps={{
                                                                        className: classes.input,
                                                                        startAdornment: <InputAdornment position="start" color="secondary">
                                                                            <Box color="FFFFF">
                                                                                ₱
                                                                            </Box>
                                                                        </InputAdornment>,
                                                                    }}
                                                                    InputLabelProps={{
                                                                        className: classes.multilineColor
                                                                    }}
                                                                    value={ePrice}
                                                                    onChange={e => setEPrice(e.target.value)}
                                                                />
                                                            </form>
                                                            <DialogActions>
                                                                <Grid item xs={4} >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        type="submit"
                                                                        value="Submit"
                                                                        onClick={addExpenses}
                                                                    >
                                                                        Add Expense
                                                                    </Button>
                                                                </Grid>
                                                            </DialogActions>
                                                        </DialogContent>
                                                    </Box>
                                                </div>
                                            </Dialog>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className={classes.grid}>
                                <MaterialTable style={{
                                    backgroundColor: "#1F1F32",
                                    color: "#FFFFFF",
                                }}
                                    width="100%"
                                    title="Project Expenses"
                                    columns={[
                                        {
                                            title: 'Expenses', field: 'name',

                                        },
                                        {
                                            title: 'Amount', field: 'expenses_price', render: rowData => (<div>{rowData.expenses_price.toLocaleString()}</div>)

                                        },
                                        // {
                                        //     title: 'Avatar', field: 'avatar', render: rowData => (
                                        //         <Avatar alt="" src={`${REACT_APP_HOST_URL}/storage/images/${rowData.avatar}`} style={{ width: 50, borderRadius: '50%', height: 50 }} />)
                                        // },
                                        {
                                            title: 'Added By', field: 'user.name',

                                        },
                                        {
                                            title: 'Date Added', field: 'expenses_date',

                                        },
                                        {
                                            field: 'user.id', hidden: true
                                        }
                                    ]}
                                    actions={[
                                        rowData => ({
                                            icon: 'edit',
                                            iconProps: { style: { color: "white" } },
                                            tooltip: 'Edit Expense',
                                            onClick: (event, rowData) => editExpenseOpen(rowData),
                                            hidden: (showActions == false)
                                        }),
                                        rowData => ({
                                            icon: 'delete',
                                            iconProps: { style: { color: "white" } },
                                            tooltip: 'Delete Expense',
                                            onClick: (event, rowData) => confirmDelete(rowData.id),
                                            hidden: (showActions == false)
                                        }),
                                    ]}
                                    data={budgetData.expenses}
                                    options={{
                                        pageSizeOptions: [5],
                                        actionsColumnIndex: -1,
                                        headerStyle: {
                                            backgroundColor: '#1F1F32',
                                            color: '#FFF'
                                        },
                                        draggable: false,
                                        rowStyle: {
                                            backgroundColor: '#1F1F32'
                                        },
                                        searchFieldStyle: {
                                            color: 'white'
                                        },
                                        actionsCellStyle: {
                                            // display: 'flex',
                                            justifyContent: 'center',
                                            padding: 12,
                                            // width: '100%'
                                        },


                                    }}
                                    localization={{
                                        header: {
                                            actions: ''
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.gridContainer2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    component={Link}
                                    to="/Budget"
                                >
                                    Back to Project Budget
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <Grid item xs={5}>
                        <Box color="#FFFFFF"
                            fontWeight="fontWeightLight" m={1}
                            textAlign="right"
                            fontSize={18}>
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                className={classes.modal}
                                open={open1}
                                onClose={updateBudgetClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={open1}>
                                    <div className={classes.paper1}>
                                        <form>
                                            <Grid item xs={12}>
                                                <Box
                                                    className={classes.box}
                                                    alignItems="left"
                                                    color="#FFFFFF"
                                                    display="flex"
                                                    fontWeight="fontWeightRegular"
                                                    fontSize={18}
                                                    flexDirection="column"
                                                >
                                                    Update Budget from ₱{budgetData.current_budget}
                                                </Box>
                                            </Grid>
                                            <Box
                                                color="red"
                                                display="flex"
                                                fontSize={16}
                                                fontWeight="fontWeightRegular"
                                                marginBottom={1}
                                                flexDirection="column"
                                            >
                                                {budgetError}
                                            </Box>
                                            <br />
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Amount"
                                                color="secondary"
                                                type="number"
                                                fullWidth
                                                InputProps={{
                                                    className: classes.input,
                                                    startAdornment: <InputAdornment position="start" color="secondary">
                                                        <Box color="FFFFF">
                                                            ₱
                                                        </Box>
                                                    </InputAdornment>,
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                                value={newBudget}
                                                onChange={e => setNewBudget(e.target.value)}
                                            />
                                            <Grid container spacing={0} className={classes.grid}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    value="Submit"
                                                    onClick={editBudget}
                                                >
                                                    Edit Budget
                                                </Button>
                                            </Grid>
                                        </form>
                                    </div>
                                </Fade>
                            </Modal>
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
                                open={open2}
                                onClose={editExpenseClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={open2}>
                                    <div className={classes.paper2}>
                                        <Grid item xs={9}>
                                            <br />
                                            <Box className={classes.Left} alignItems="left"
                                                color="#FFFFFF"
                                                display="flex"
                                                flexDirection="column" p={1}
                                                fontSize={18}
                                            >
                                                Edit Expense
                                            </Box>
                                            <Box color="red"
                                                display="flex"
                                                fontSize={16}
                                                fontWeight="fontWeightRegular"
                                                marginBottom={1}
                                                marginLeft={1}
                                                flexDirection="column">
                                                {expenseErrorEdit}
                                            </Box>
                                        </Grid>



                                        <Autocomplete
                                            id="combo-box-demo"
                                            options={memberList}
                                            getOptionLabel={(option) => option.name}
                                            defaultValue={{ name: nEMemberName, id: nEMemberId }}
                                            onChange={handleSearchChange2}
                                            classes={{ inputRoot: classes.inputRoot }}
                                            style={{ width: 300 }}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    label="Name"
                                                    variant="outlined"
                                                    color="secondary"
                                                    defaultValue={nEMemberName}
                                                    InputLabelProps={{
                                                        className: classes.multilineColor
                                                    }}
                                                />
                                            }
                                        />
                                        <br />
                                        <TextField
                                            variant="outlined"
                                            id="outlined-basic"
                                            label="Expense Name"
                                            color="secondary"
                                            fullWidth
                                            InputProps={{
                                                className: classes.input
                                            }}
                                            InputLabelProps={{
                                                className: classes.multilineColor
                                            }}
                                            value={nEName}
                                            onChange={e => setNEName(e.target.value)}
                                        />
                                        <Grid container spacing={0} className={classes.grid}>
                                            <TextField
                                                variant="outlined"
                                                id="outlined-basic"
                                                label="Amount"
                                                color="secondary"
                                                type="number"
                                                fullWidth
                                                InputProps={{
                                                    className: classes.input,
                                                    startAdornment: <InputAdornment position="start" color="secondary">
                                                        <Box color="FFFFF">
                                                            ₱
                                                    </Box>
                                                    </InputAdornment>,
                                                }}
                                                InputLabelProps={{
                                                    className: classes.multilineColor
                                                }}
                                                value={nEPrice}
                                                onChange={e => setNEPrice(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid container spacing={0} className={classes.grid}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                type="submit"
                                                value="Submit"
                                                onClick={editExpenses}
                                            // updateBudgetClose
                                            >
                                                Update Expense
                                            </Button>
                                        </Grid>
                                    </div>
                                </Fade>
                            </Modal>
                        </Box>
                    </Grid>
                    <Dialog open={delAnnounce} onClose={closeDelete} aria-labelledby="form-dialog-title" >
                        <div className={classes.paper3}>
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
                                            Delete Expense?
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
                                            onClick={deleteExpenses}
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
            </div>
        </MuiThemeProvider >
    );
}
