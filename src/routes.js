import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// Organization
const ListOrganization = React.lazy(() => import('./views/organization/ListOrganization'));
const NewOrganization = React.lazy(() => import('./views/organization/NewOrganization'));

// Classes

// Transcript

// Major

// Subject

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/organizations", name: "Organizations", component: ListOrganization, exact: true },
  { path: "/organizations/list", name: "Organizations", component: ListOrganization, exact: true },
  { path: "/organizations/new", name: "New Organizations", component: NewOrganization, exact: true},

];

export default routes;
