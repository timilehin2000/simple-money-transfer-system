# Simple money transfer system API

A RESTful API that allows user transfer money between themeselves.

#### **BASE URL** - [https://backend-task-cpok.onrender.com/api/v1](https://backend-task-cpok.onrender.com//api/v1)

#### **POSTMAN DOCS** - [API Documentation on Postman](https://documenter.getpostman.com/view/36399546/2sAXqqcNbN#a856406c-037c-462d-a3e8-2f743d8e5fbe)

## API Endpoints

### Authentication

-   **POST** `/users/` - Register a new user
-   **POST** `/users/login` - Login with user credentials
-   **GET** `/users/id` - Get user details with balance
-   **GET** `/users/:username` - Get user details

### Transfers

-   **POST** `/transfers` - Initiate a transfer to another user
-   **GET** `/transfers` - Retrieve all user's transfers (with pagination and filtering)

## How to Test

1. **Register** use `/users` with sample user credentails as on API docs
2. **Login** use `/users/login` with sample user credentials on API docs.
3. **Authorization**: API uses a Bearer Token.
4. **To get user details with wallet balance**: Use `/users/id`
5. **To get user details**: Use `/users/:username`
6. **Transfer to other user**: Use `/transfers` with sample credentials on the API docs.
7. **Get user's transfers Details**: Use `/transfers/`.

## To Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/timilehin2000/simple-money-transfer-system
    cd simple-money-transfer-system
    ```

2. Set up environment variables by creating a `.env` file based on `.env.example`.

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the application:

    ```bash
    npm run dev
    ```

5. Optionally, **Run with Docker**:
    - Build and run Docker containers:
        ```bash
        docker-compose up --build
        ```
    - To stop and remove Docker containers:
        ```bash
        docker-compose down
        ```
6. To run tests:

    ```bash
    npm test
    ```