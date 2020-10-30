import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Axios from 'axios';
import REACT_APP_HOST_URL from "../config";
import SecureLS from 'secure-ls';
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
        border: '2px solid #303049',
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '500px',
        },
    },
    dialog: {
        backgroundColor: '#1F1F32',
    },
    root1: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100ch',
            height: '10ch',
        },
    },
    tab: {
        color: '#FFFFFF',
    },
    gridContainer2: {
        paddingTop: "5px",
    },
    input: {
        color: "white"
    },
    multilineColor: {
        color: '#52399B'
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

const Budget = props => {
    const classes = useStyles();
    var ls = new SecureLS();
    let data = ls.get('data');
    const [budgetData, setBudgetData] = React.useState({});
    let history = useHistory();
    const Budget = (data) => {
        history.push('/ViewBudget');
    }
    React.useEffect(() => {
        Axios.get(`${REACT_APP_HOST_URL}/api/budgetList`, {
            headers: {
                'Authorization': "Bearer " + data.token
            }
        })
            .then(response => {

                const budget = response.data

                setBudgetData(budget)
            })
            .catch(error => {
                console.log(error)
            })
    })

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MuiThemeProvider theme={backgroundColor}>
            <main className={classes.content}>
                <Grid container spacing={12}>
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <Box color="#FFFFFF"
                                fontWeight="fontWeightLight" m={1}
                                fontSize={18}>
                                Dashboard / Budget
                            </Box>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={9}>
                        <MaterialTable style={{
                            backgroundColor: "#1F1F32",
                            color: "#FFFFFF",
                        }}
                            width="100%"
                            title="Project Budget"
                            columns={[
                                {
                                    field: 'id', hidden: true
                                },
                                {
                                    title: 'Project Name', field: 'project.title',
                                },
                                {
                                    title: 'Original Budget', field: 'original_budget', render: rowData => (<div>{rowData.original_budget.toLocaleString()}</div>)
                                },
                                {
                                    title: 'Current Budget', field: 'current_budget', render: rowData => (<div>{rowData.current_budget.toLocaleString()}</div>)

                                },
                                {
                                    title: 'Remaining Budget', field: 'remaining_budget', render: rowData => (<div>{rowData.remaining_budget.toLocaleString()}</div>)

                                },
                            ]}
                            data={
                                budgetData.data
                            }
                            options={{
                                pageSizeOptions: [5],
                                headerStyle: {
                                    backgroundColor: '#1F1F32',
                                    color: '#FFF'
                                },
                                draggable: false,
                                actionsColumnIndex: -1,
                                rowStyle: {
                                    backgroundColor: '#1F1F32'
                                },
                                actionsCellStyle: {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: 16,
                                    width: '100%'
                                }
                            }}
                            onRowClick={(event, rowData) => history.push(`viewBudget/${rowData.id}`)}
                        />
                    </Grid>
                </Grid>
            </main>
        </MuiThemeProvider>
    );

}

export default Budget;
