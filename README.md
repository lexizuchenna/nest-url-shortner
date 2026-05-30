# URL Shortener API

Hey there! So, this project is a neat little API that lets you take those super long, clunky URLs and shrink them down into something much more manageable. The idea here is to not only make sharing easier but also give you some cool insights into who's clicking your links, where they're coming from, and even what browsers they're using.

## Overview

This project lets you create short, trackable links from any long URL. It solves the problem of unwieldy links and provides you with analytics to see how your shared content is performing, all without any fuss. You get a clean, functional API that just works.

## Description

This API provides a robust and efficient solution for managing and tracking shortened URLs. Built with a focus on performance and developer experience, it offers user authentication, URL shortening, and comprehensive click analytics. Whether you're looking to simplify link sharing or gain valuable insights into your audience engagement, this project offers a solid foundation.

## Installation

Getting this project up and running on your local machine is pretty straightforward.

1.  **Clone the Repository**

    Start by cloning the project to your local machine:

    ```bash
    git clone https://github.com/lexizuchenna/nest-url-shortner.git
    cd nest-url-shortner
    ```

2.  **Install Dependencies**

    Once you're in the project directory, install all the required Node.js packages:

    ```bash
    npm install
    # or if you prefer pnpm
    pnpm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root of the project. You'll need to configure your database connection and a JWT secret. Here's an example:

    ```
    PORT=5000
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    DIRECT_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    JWT_SECRET="your_very_secret_jwt_key_here"
    NODE_ENV=development
    ```

    - `PORT`: The port your API will run on.
    - `DATABASE_URL`: Your PostgreSQL database connection string.
    - `DIRECT_URL`: Used by Prisma for migrations, typically the same as `DATABASE_URL`.
    - `JWT_SECRET`: A strong, random string used for signing JWT tokens.

4.  **Run Database Migrations**

    With your database configured, apply the Prisma migrations to set up your database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

## Usage

After you've got everything installed and the database is ready, you can fire up the application.

1.  **Start the Development Server**

    To start the API in development mode with hot-reloading:

    ```bash
    npm run start:dev
    # or if you prefer pnpm
    pnpm start:dev
    ```

    For a production build:

    ```bash
    npm run start:prod
    # or if you prefer pnpm
    pnpm start:prod
    ```

2.  **Access the API**

    The API will be running on the port you specified in your `.env` file (e.g., `http://localhost:5000`).
    - **API Documentation**: You can access the Swagger UI documentation at `http://localhost:5000/api/v1/docs`. This interface lets you explore all available endpoints, their parameters, and expected responses. It's a great way to interact with the API directly.
    - **Shortened URL Redirect**: When a shortened URL is accessed (e.g., `http://localhost:5000/r/YOUR_SHORT_CODE`), it will automatically redirect to the original URL while recording click analytics.

## Features

- **URL Shortening**: Easily transform long URLs into concise, shareable short links.
- **Custom Short Codes**: While automatic short codes are generated, the underlying service can support custom ones (though not exposed directly in this API).
- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Link Analytics**: Track detailed metrics for each shortened link, including total clicks, click timelines, referrer sources, and browser usage.
- **CRUD Operations for Links**: Create, retrieve, update, and delete your shortened URLs.
- **Health Check**: A simple endpoint to check the API's status.

## Technologies Used

| Technology     | Description                                                                                   |
| :------------- | :-------------------------------------------------------------------------------------------- |
| **NestJS**     | A progressive Node.js framework for building efficient and scalable server-side applications. |
| **TypeScript** | A typed superset of JavaScript that compiles to plain JavaScript.                             |
| **Prisma**     | A next-generation ORM that makes database access easy and type-safe.                          |
| **PostgreSQL** | A powerful, open-source object-relational database system.                                    |
| **JWT**        | JSON Web Tokens for secure authentication and authorization.                                  |
| **Bcrypt.js**  | Library for hashing and comparing passwords.                                                  |
| **Nanoid**     | A tiny, secure, URL-friendly, unique string ID generator.                                     |
| **Swagger**    | Interactive API documentation for easy exploration and testing.                               |

## Contributing

We'd love for you to contribute to this project! Here's how you can help:

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  **Make your changes**.
4.  **Commit your changes** with a clear and concise message: `git commit -m 'feat: Add new feature X'`.
5.  **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
6.  **Open a Pull Request** to the `main` branch of this repository.

Please ensure your code adheres to the project's coding style and includes appropriate tests.

## License

This project is currently unlicensed.

## Author Info

Connect with me!

- **LinkedIn**: [Alexander Ukwueze](https://linkedin.com/in/lexizuchenna)
- **X (Twitter)**: [@lexiz_tech](https://x.com/lexiz_tech)

---

[![NestJS](https://img.shields.io/badge/nestjs-%23e0234e.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=white)](https://swagger.io/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
