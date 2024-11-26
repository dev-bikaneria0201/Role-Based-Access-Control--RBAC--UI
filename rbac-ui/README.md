# Role-Based Access Control (RBAC) UI

This is a React-based application that allows administrators to manage users, roles, and permissions. The goal of this project is to implement an intuitive interface for managing roles and permissions within an RBAC system, which is a critical part of ensuring proper access control in applications.

## Features

- **Role Management**: Admins can create, edit, and delete roles.
- **Dynamic Permissions**: Admins can assign and modify permissions (e.g., Read, Write, Delete) for each role.
- **User Management**: Admins can manage users, assign roles, and modify user statuses.
- **RESTful API Integration**: The app uses a mock API (via `json-server`) to persist role and user data.

## Technologies Used

- **React**: The frontend framework used to build the user interface.
- **Material-UI**: A popular React UI library for building responsive, modern user interfaces.
- **Axios**: A promise-based HTTP client for making API requests.
- **json-server**: A mock REST API server to simulate CRUD operations for roles and users.

## Prerequisites

Before you can run the project, ensure you have the following installed on your local machine:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager)


........how to run............
follow all the steps in terminal
in the folder rbac-ui
 STEP 1 ->    npm i   <!-- to install node modules -->
 STEP 2 -> npm install @mui/material @emotion/react @emotion/styled axios json-server
 STEP 3 -> npm install react-router-dom <!--THIS INSTALL REACT ROUTER DOM-->
 STEP 4 -> npm install @mui/icons-material  <!--THIS INSTALL ICON-->
 STEP 5 ->  npx json-server --watch db.json --port 3001   <!--to start json server-->
 <!-- IN NEW TERMINAL -->
 STEP 6 -> npm start
