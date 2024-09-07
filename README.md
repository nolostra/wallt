# Wallt - Hapi Server

## Overview

**Wallt** is a Hapi.js-based server designed for [brief description of the project, such as handling user authentication, managing profiles, etc.]. It is tailored for [target audience or use case, e.g., developers building web applications, teams needing a robust backend API, etc.]. 

## Features

- **Authentication**: Secure user login and registration using JWT.
- **Profile Management**: CRUD operations for user profiles.
- **Data Validation**: Ensure data integrity with Joi validation.
- **Seamless Integration**: Easy integration with other services and databases.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version [your Node.js version].
- **npm** or **yarn**: For package management.

## Getting Started

To get a local copy of the project up and running, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/nolostra/wallt.git
cd wallt

```
### 2. Install Dependencies 

```bash

npm install
# or
yarn install
```


### 3. Configure Environment Variables

Create a .env file in the backend - Auth and Play and add your environment variables:

```bash

DB_HOST=""        
DB_PORT=3306              # Port number should be separate
DB_USER=""
DB_PASS=""
DB_NAME=""
JWT_SECRET=""

```


### 4. Start the Server for Frontend 

```bash
cd frontend

yarn dev

```
### 5. Start the Server for Backend
open 2 new terminal 


```bash
cd backend\auth

yarn start

```

```bash
cd backend\play

yarn start

```
