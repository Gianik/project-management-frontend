import React from "react";
import Member from "./Member";
import Budget from "./Budget";
import Announcement from "./Announcement";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile";
import { Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from './ProtectedRoute';
import { makeStyles } from "@material-ui/core/styles";
import Dashboard from './Dashboard';
import Security from './Security';
import Project from './Project'
import ViewProject from './ViewProject'
import NewProject from './NewProject'
import ViewBudget from './ViewBudget'
import ProjectTask from './ProjectTask'
import ProjectMember from './ProjectMember'
import ViewAnnouncement from './ViewAnnouncement'
const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});

export default function App() {
  const classes = useStyles();
  return (
    <>
      <div>
        <Switch>
          <Route path="/Login" exact component={Login} />
          <Route path="/Registration" exact component={Registration} />
        </Switch>
      </div>
      <div className={classes.container}>
        <Navbar />
        <Switch>
          <ProtectedRoute exact={true} path="/" component={Dashboard} />
          <ProtectedRoute exact path="/Member" exact component={Member} />
          <ProtectedRoute exact path="/Profile" exact component={Profile} />
          <ProtectedRoute exact path="/Dashboard" exact component={Dashboard} />
          <ProtectedRoute exact path="/Security" exact component={Security} />
          <ProtectedRoute exact path="/Budget" exact component={Budget} />
          <ProtectedRoute exact path="/Announcement" exact component={Announcement} />
          <ProtectedRoute path="/Project" exact component={Project} />
          <ProtectedRoute path="/NewProject" exact component={NewProject} />
          <Route path="/ViewProject/:id" exact component={ViewProject} />
          <Route path="/ViewBudget/:id" exact component={ViewBudget} />
          <Route path="/ProjectTask/:id" exact component={ProjectTask} />
          <Route path="/ProjectMember/:id" exact component={ProjectMember} />
          <Route path="/viewAnnouncement/:id" exact component={ViewAnnouncement} />
        </Switch>
      </div></>
  );
}


