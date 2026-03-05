# **Robust URL Shortener API with NestJS**

## Overview

This project is a high-performance URL shortening service built with TypeScript and NestJS. It provides a robust API for creating, retrieving, updating, and deleting shortened URLs, utilizing in-memory storage for rapid access and `nanoid` for generating concise, unique identifiers.

## Features

- **URL Shortening**: Convert long, cumbersome URLs into short, memorable links.
- **Efficient Redirection**: Seamlessly redirect users from shortened links to their original destinations.
- **URL Management**: Comprehensive CRUD operations (Create, Read, Update, Delete) for all shortened URLs.
- **Input Validation**: Ensures valid URL formats are processed and handles common input errors gracefully.
- **Unique Identifier Generation**: Leverages `nanoid` for generating secure, URL-friendly unique IDs.

## Getting Started

To get this URL Shortener API up and running on your local machine, follow these simple steps.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/lexizuchenna/nest-url-shortner.git
    cd nest-url-shortner
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Build the Project (Optional, for production)**:
    ```bash
    pnpm build
    ```

### Environment Variables

Create a `.env` file in the root of the project and populate it with the following required variables:

```dotenv
PORT=3000
```

## Usage

After installation and setting up environment variables, you can start the API server and interact with it using various HTTP clients like `curl`, Postman, or Insomnia.

1.  **Start the Development Server**:

    ```bash
    pnpm start:dev
    ```

    The server will typically run on `http://localhost:3000` (or your specified `PORT`).

2.  **Start the Production Server**:
    ```bash
    pnpm start:prod
    ```

### Example Interactions

**Shorten a URL:**

```bash
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"original_url": "https://www.example.com/a-very-long-article-about-software-development"}'
```

**Get All Shortened URLs:**

```bash
curl -X GET http://localhost:3000
```

**Redirect a Shortened URL:**
Open `http://localhost:3000/xyz456fg` (replace `xyz456fg` with an actual shortened ID) in your browser. This will redirect you to the original URL.

**Update a Shortened URL:**

```bash
curl -X PATCH http://localhost:3000/xyz456fg -H "Content-Type: application/json" -d '{"original_url": "https://www.example.com/an-updated-link"}'
```

**Delete a Shortened URL:**

```bash
curl -X DELETE http://localhost:3000/xyz456fg
```

## API Documentation

This section details the available API endpoints, their expected requests, and potential responses.

### Base URL

`http://localhost:3000` (or your configured `PORT`)

### Endpoints

#### GET /

Retrieves a list of all currently stored shortened URLs.

**Request**:
No request body required.

**Response**:

```json
{
  "success": true,
  "message": "All url successfully returned",
  "data": {
    "urls": [
      {
        "id": "abc123de",
        "original_url": "https://example.com/very/long/url",
        "created_at": "2023-10-27T10:00:00.000Z",
        "shortened_url": "http://localhost:3000/abc123de"
      },
      {
        "id": "xyz456fg",
        "original_url": "https://www.another-example.com/long-page",
        "created_at": "2023-10-27T10:05:00.000Z",
        "shortened_url": "http://localhost:3000/xyz456fg"
      }
    ]
  },
  "statusCode": 200
}
```

**Errors**:

- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /

Creates a new shortened URL for a given original URL.

**Request**:

```json
{
  "original_url": "https://www.example.com/my-very-long-article-link"
}
```

- `original_url` (string, required): The full URL to be shortened.

**Response**:

```json
{
  "success": true,
  "data": {
    "url": {
      "id": "xyz456fg",
      "original_url": "https://www.example.com/my-very-long-article-link",
      "created_at": "2023-10-27T10:30:00.000Z",
      "shortened_url": "http://localhost:3000/xyz456fg"
    }
  },
  "message": "URL successfully shortned",
  "statusCode": 201
}
```

**Errors**:

- `400 Bad Request`: `Missing original_url field`
- `400 Bad Request`: `The url inputed must be in a URL format`
- `400 Bad Request`: `This url has already been stored` (The server's `ConflictException` is mapped to `HttpStatus.BAD_REQUEST`)

#### GET /:id

Redirects from a shortened URL to its original destination.

**Request**:
No request body required. The shortened URL's `id` is provided as a path parameter.

**Response**:
Successful requests result in an HTTP 308 Permanent Redirect to the `original_url`.
The browser or client will automatically follow this redirect.

**Errors**:

- `404 Not Found`: `No url with id: [id] found`

#### PATCH /:id

Updates the original URL associated with a given shortened ID.

**Request**:

```json
{
  "original_url": "https://www.updated-example.com/new-article"
}
```

- `id` (string, required): The ID of the shortened URL to update.
- `original_url` (string, required): The new original URL to associate with the ID.

**Response**:

```json
{
  "success": true,
  "data": {
    "url": {
      "id": "xyz456fg",
      "original_url": "https://www.updated-example.com/new-article",
      "created_at": "2023-10-27T10:30:00.000Z",
      "shortened_url": "http://localhost:3000/xyz456fg"
    }
  },
  "message": "The url has been successfully updated",
  "statusCode": 200
}
```

**Errors**:

- `400 Bad Request`: `Missing id param`
- `400 Bad Request`: `Missing original_url field`
- `400 Bad Request`: `The url inputed must be in a URL format`
- `400 Bad Request`: `This url has already been stored` (if the new `original_url` is already linked to a _different_ ID)
- `404 Not Found`: `The url with id: [id] was not found`

#### DELETE /:id

Deletes a shortened URL entry from the system.

**Request**:
No request body required. The shortened URL's `id` is provided as a path parameter.

**Response**:

```json
{
  "success": true,
  "data": {
    "url": {
      "id": "xyz456fg",
      "original_url": "https://www.example.com/my-very-long-article-link",
      "created_at": "2023-10-27T10:30:00.000Z",
      "shortened_url": "http://localhost:3000/xyz456fg"
    }
  },
  "message": "The url has been successfully deleted",
  "statusCode": 200
}
```

**Errors**:

- `400 Bad Request`: `Missing id param`
- `404 Not Found`: `The url with id: [id] was not found`

## Technologies Used

| Technology                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Description                                                                                                   |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                     | A typed superset of JavaScript that compiles to plain JavaScript. Provides enhanced tooling and code quality. |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                              | A JavaScript runtime built on Chrome's V8 JavaScript engine.                                                  |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                 | A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.      |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                        | A fast, unopinionated, minimalist web framework for Node.js (used by NestJS).                                 |
| ![Nanoid](https://img.shields.io/badge/nanoid-3F98F4?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZmlsbD0iIzNGOThGNCIgZD0iTTAgNWg1djVINzZhMSA1IDAgMCAxIDAtNiA2IDYgMCAwIDEgNiA2aDNWMTAuNDZhMSAxIDAgMCAwIDAtLjloLTEuMjJhNS45NyA1Ljk3IDAgMCAxLTYtNkE1LjkyIDUuOTIgMCAwIDEgNiA0LjU0VjBoNXY1aDhhMSAxIDAgMCAxIDAgMiA2IDYgMCAwIDEgLTYgNkg4LjU0YTUuOTcgNS45NyAwIDAgMS02IDZhMSAxIDAgMCAwIDAgLjloMS4yMnYyLjU0SDMwVjExaC01VjZoLTZaIi8+PC9zdmc+&logoColor=white) | A tiny, secure, URL-friendly, unique string ID generator.                                                     |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                 | A pluggable linting utility for JavaScript and TypeScript.                                                    |
| ![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=black)                                                                                                                                                                                                                                                                                                                                                                                                                                           | An opinionated code formatter.                                                                                |

## Author Info

- **[Alexander]**
  - LinkedIn: [Alexander Ukwueze](https://www.linkedin.com/in/lexizuchenna)
  - X (formerly Twitter): [Lexiz](https://x.com/lexiz_tech_)

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
