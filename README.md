# GoTrip-Ride Sharing Management System (Backend).

This repository contains the backend code for a ride-sharing application. It provides the core functionalities for user management, driver management, ride requests, ride assignment, real-time updates, and payment processing. The backend is built using Node.js, Express, MongoDB, and Redis, ensuring scalability, reliability, and performance.

## Features & Functionalities

- **User Authentication & Authorization:** 
    - Secure user registration, 
    - Login, 
    - Role-based access control using **JWTs** and **Passport.js**.
- **Driver Management:** Functionalities for 
    - Drivers to Register, 
    - Apply and manage their profiles and availability.
- **Real-time Ride Request & Assignment:** Efficiently matches riders with the nearest available drivers using location-based algorithms.
- **Ride Lifecycle Management:** 
    - Handles ride requests, 
    - Acceptance, 
    -Start, 
    - end 
    - cancellation.
    - status updates.
- **Feedback System:** Allows riders and drivers to provide feedback on each other after each ride.
- **Payment Integration:** (Potentially - not explicitly mentioned but likely) Secure payment processing for ride fares.
- **Scalable Architecture:** Designed with scalability in mind, leveraging 
    - **<u>Node.js</u>**, 
    - **<u>Express</u>**, 
    - **<u>MongoDB</u>**,
    - **<u>Redis</u>**.
- **Comprehensive Error Handling:** Robust error handling and logging for easy debugging and maintenance.


## 🛠️ Tech Stack

| Category    | Technology                      | Description                                                                                                                               |
|-------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| **Backend** | Node.js                         | JavaScript runtime environment for server-side development.                                                                               |
|             | Express.js                      | Web application framework for building APIs and handling routing.                                                                        |
| **Database**| MongoDB                         | NoSQL database for storing application data.                                                                                             |
|             | Mongoose                        | ODM (Object-Document Mapper) for MongoDB, providing a structured way to interact with the database.                                      |
|             | Redis                           | In-memory data store used for caching, session management, and real-time features.                                                        |
| **Authentication**| Passport.js                     | Authentication middleware for handling local and Google OAuth 2.0 strategies.                                                        |
|             | JSON Web Tokens (JWT)           | Standard for securely transmitting information between parties as a JSON object.                                                          |
|             | bcryptjs                        | Library for hashing and comparing passwords.                                                                                              |
| **Others** | dotenv                          | Loads environment variables from a `.env` file.                                                                                           |
|             | cors                            | Middleware for enabling Cross-Origin Resource Sharing.                                                                                    |
|             | cookie-parser                   | Middleware for parsing cookies from request headers.                                                                                      |
|             | express-session                 | Middleware for managing user sessions.                                                                                                   |
|             | http-status                     | Library for HTTP status code constants.                                                                                                   |
|             | jsonwebtoken                    | Library for generating and verifying JSON Web Tokens (JWTs).                                                                              |
|             | nodemailer                      | Library for sending emails.                                                                                                               |
|             | ejs                             | Templating engine for generating dynamic email content.                                                                                 |
|             | zod                             | Schema validation library for validating request bodies.                                                                                  |
| **Styling & Linting**   | TypeScript                      | Superset of JavaScript that adds static typing.                                                                                            |
|             | ESLint                          | Linter for identifying and reporting on patterns found in ECMAScript/JavaScript code.                                                    |
|             | Prettier                        | Code formatter for enforcing a consistent style.                                                                                          |

## 📦 Getting Started

### Prerequisites

- Node.js
- MongoDB installed and running
- Redis installed and running

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Create a `.env` file in the root directory and make sure you have the environment variables.  A sample `.env` might look like this:

    ```
    PORT=
    DB_URL=
    NODE_ENV=

    # JWT TOKENS
    BCRYPT_SALT_ROUND=
    JWT_ACCESS_SECRET=
    JWT_ACCESS_EXPIRES=
    JWT_REFRESH_SECRET=
    JWT_REFRESH_EXPIRES=

    # SUPER ADMIN
    SUPER_ADMIN_EMAIL=
    SUPER_ADMIN_PASSWORD=

    # GOOGLE
    GOOGLE_CLIENT_SECRET=
    GOOGLE_CLIENT_ID=
    GOOGLE_CALLBACK_URL=

    # Express Session
    EXPRESS_SESSION_SECRET=

    # Frontend URL
    FRONTEND_URL=

    # CLOUDINARY
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # EMAIL
    SMTP_USER=
    SMTP_PASS=
    SMTP_PORT=
    SMTP_HOST=
    SMTP_FROM=

    # REDIS
    REDIS_HOST=
    REDIS_PORT=
    REDIS_USERNAME=
    REDIS_PASSWORD=
    ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev (if you are using yarn)
    ```

    This will start the server, connect to the database, and listen for incoming requests.

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── config/              # Configuration files (env variables, passport, redis)
│   │   ├── modules/             # Feature modules (user, driver, ride, auth)
│   │   │   ├── user/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.services.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   └── ...
│   │   │   ├── driver/
│   │   │   │   ├── driver.model.ts
│   │   │   │   ├── driver.service.ts
│   │   │   │   ├── driver.interface.ts
│   │   │   │   └── ...
│   │   │   ├── ride/
│   │   │   │   ├── ride.model.ts
│   │   │   │   ├── ride.service.ts
│   │   │   │   ├── ride.interface.ts
│   │   │   │   └── ...
│   │   │   └── auth/
│   │   │       ├── auth.services.ts
│   │   │       └── ...
│   │   ├── middlewares/         # Express middlewares (auth, validation, error handling)
│   │   ├── utils/               # Utility functions (jwt, sendEmail, query builder)
│   │   └── routes/              # API routes
│   ├── routes/                 # Main routes directory
│   │   └── index.ts            # Combines all routes
│   ├── server.ts               # Entry point of the application
│   └── app.ts                  # Express application setup
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```


## 📬 Contact
For inquiries, collaborations, or feedback:

- **Email:** parvezmahmudaa100@gmail.com  
- **Portfolio:** https://parvez-mahamud-portfolio.vercel.app/  
- **LinkedIn:** https://www.linkedin.com/in/parvez-mahamud/  
- **GitHub:** https://github.com/ParvezMah
- **Phone:** +8801850-598057

## Thanks

Thank you for checking out this project! I hope you will keep in touch by providing you valuable feedback to build and scale this amazing ride-sharing applications.
