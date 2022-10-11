const pageWrapperDiv = document.getElementById('wrapper');
const sidebarContainer = document.createDocumentFragment();

const sidebar = document.createElement('ul');
sidebar.classList.add("navbar-nav", "bg-gradient-primary", "sidebar", "sidebar-dark", "accordion");
sidebar.setAttribute('id', "accordionSidebar");

const sidebarBrand = document.createElement('a');







sidebarContainer.appendChild(sidebar);









pageWrapperDiv.appendChild(sidebarContainer);