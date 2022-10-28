const pageWrapperDiv = document.getElementById('wrapper');
const sidebarContainer = document.createDocumentFragment();

//Sidebar
const sidebar = document.createElement('ul');
sidebar.classList.add("navbar-nav", "bg-gradient-primary", "sidebar", "sidebar-dark", "accordion");
sidebar.setAttribute('id', "accordionSidebar");

//Sidebar Brand
const sidebarBrand = document.createElement('a');
sidebarBrand.classList.add("sidebar-brand", "d-flex", "align-items-center", "justify-content-center");
sidebarBrand.href = "index.html";

const sidebarBrandIconDiv = document.createElement('div');
sidebarBrandIconDiv.classList.add("sidebar-brand-icon", "rotate-n-15");
sidebarBrand.appendChild(sidebarBrandIconDiv);

const sidebarBrandIcon = document.createElement('i');
sidebarBrandIcon.classList.add("fas", "fa-bug");
sidebarBrandIconDiv.appendChild(sidebarBrandIcon);

const sidebarBrandText = document.createElement('div');
sidebarBrandText.classList.add("sidebar-brand-text", "mx-3");
sidebarBrandText.textContent = "I.T.S.";
sidebarBrand.appendChild(sidebarBrandText);

//Top Divider
const topSidebarDivider = document.createElement('hr');
topSidebarDivider.classList.add("sidebar-divider", "my-0");

//Top nav item - Home
const topNavItem = document.createElement('li');
topNavItem.classList.add("nav-item", "active");

const topNavLink = document.createElement('a');
topNavLink.classList.add("nav-link");
topNavLink.href = "index.html";
topNavItem.appendChild(topNavLink);

const topNavIcon = document.createElement('i');
topNavIcon.classList.add("fas", "fa-fw", "fa-home");
topNavLink.appendChild(topNavIcon);

const topNavText = document.createElement('span');
topNavText.textContent = "Home";
topNavLink.appendChild(topNavText);

//Divider
const sidebarDivider = document.createElement('hr');
sidebarDivider.classList.add("sidebar-divider");

//Sidebar heading - Manage users
const sidebarHeadingMU = document.createElement('div');
sidebarHeadingMU.classList.add("sidebar-heading");
sidebarHeadingMU.textContent = "Manage Users";

//Manage users - Role assignments
const navItemRA = document.createElement('li');
navItemRA.classList.add('nav-item');

const navItemRALink = document.createElement('a');
navItemRALink.classList.add('nav-link');
navItemRALink.href = 'roleAssignments.html';
navItemRA.appendChild(navItemRALink);

const navItemRAIcon = document.createElement('i');
navItemRAIcon.classList.add('fas', 'fa-fw', 'fa-users');
navItemRALink.appendChild(navItemRAIcon);

const navItemRAText = document.createElement('span');
navItemRAText.textContent = 'Role Assignments';
navItemRALink.appendChild(navItemRAText);

//Manage users - Project teams
const navItemPT = document.createElement('li');
navItemPT.classList.add('nav-item');

const navItemPTLink = document.createElement('a');
navItemPTLink.classList.add('nav-link');
navItemPTLink.href = 'projectTeams.html';
navItemPT.appendChild(navItemPTLink);

const navItemPTIcon = document.createElement('i');
navItemPTIcon.classList.add('fas', 'fa-fw', 'fa-user-plus');
navItemPTLink.appendChild(navItemPTIcon);

const navItemPTText = document.createElement('span');
navItemPTText.textContent = 'Project Teams';
navItemPTLink.appendChild(navItemPTText);

//Divider
//Already created

//Sidebar heading - Manage projects
const sidebarHeadingMP = document.createElement('div');
sidebarHeadingMP.classList.add("sidebar-heading");
sidebarHeadingMP.textContent = "Manage Projects";

//Manage projects - Projects
const navItemProjects = document.createElement('li');
navItemProjects.classList.add('nav-item');

const navItemProjectsLink = document.createElement('a');
navItemProjectsLink.classList.add('nav-link');
navItemProjectsLink.href = 'projects.html';
navItemProjects.appendChild(navItemProjectsLink);

const navItemProjectsIcon = document.createElement('i');
navItemProjectsIcon.classList.add('fas', 'fa-fw', 'fa-briefcase');
navItemProjectsLink.appendChild(navItemProjectsIcon);

const navItemProjectsText = document.createElement('span');
navItemProjectsText.textContent = 'Projects';
navItemProjectsLink.appendChild(navItemProjectsText);

//Manage projects - Epics
const navItemEpics = document.createElement('li');
navItemEpics.classList.add('nav-item');

const navItemEpicsLink = document.createElement('a');
navItemEpicsLink.classList.add('nav-link');
navItemEpicsLink.href = 'epics.html';
navItemEpics.appendChild(navItemEpicsLink);

const navItemEpicsIcon = document.createElement('i');
navItemEpicsIcon.classList.add('fas', 'fa-fw', 'fa-folder-open');
navItemEpicsLink.appendChild(navItemEpicsIcon);

const navItemEpicsText = document.createElement('span');
navItemEpicsText.textContent = 'Epics';
navItemEpicsLink.appendChild(navItemEpicsText);

//Manage projects - Tasks
const navItemTasks = document.createElement('li');
navItemTasks.classList.add('nav-item');

const navItemTasksLink = document.createElement('a');
navItemTasksLink.classList.add('nav-link');
navItemTasksLink.href = 'tasks.html';
navItemTasks.appendChild(navItemTasksLink);

const navItemTasksIcon = document.createElement('i');
navItemTasksIcon.classList.add('fas', 'fa-fw', 'fa-file');
navItemTasksLink.appendChild(navItemTasksIcon);

const navItemTasksText = document.createElement('span');
navItemTasksText.textContent = 'Tasks';
navItemTasksLink.appendChild(navItemTasksText);

//Botton divider
const bottomDivider = document.createElement('hr');
bottomDivider.classList.add('sidebar-divider', 'd-none', 'd-md-block');

//Sidebar toggler
const sidebarToggler = document.createElement('div');
sidebarToggler.classList.add('text-center', 'd-none', 'd-md-inline');

const sidebarTogglerButton = document.createElement('button');
sidebarTogglerButton.classList.add('rounded-circle', 'border-0');
sidebarTogglerButton.setAttribute('id', 'sidebarToggle');
sidebarToggler.appendChild(sidebarTogglerButton);

sidebar.appendChild(sidebarBrand);
sidebar.appendChild(topSidebarDivider);
sidebar.appendChild(topNavItem);
sidebar.appendChild(sidebarDivider);
sidebar.appendChild(sidebarHeadingMU);
sidebar.appendChild(navItemRA);
sidebar.appendChild(navItemPT);
sidebar.appendChild(sidebarDivider);
sidebar.appendChild(sidebarHeadingMP);
sidebar.appendChild(navItemProjects);
sidebar.appendChild(navItemEpics);
sidebar.appendChild(navItemTasks);
sidebar.appendChild(bottomDivider);
sidebar.appendChild(sidebarToggler);

sidebarContainer.appendChild(sidebar);

pageWrapperDiv.prepend(sidebarContainer);