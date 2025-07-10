import Dashboard from "layouts/dashboard";
import Team from "layouts/user";
import Task from "layouts/task";
import Logout from "layouts/logout";
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Team Management",
    key: "team-management",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/team-management",
    component: <Team />,
  },
  {
    type: "collapse",
    name: "Tasks",
    key: "tasks",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/tasks",
    component: <Task />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
  },
];

export default routes;
