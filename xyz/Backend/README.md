# User API Documentation

## Endpoints

### Register a new user

**URL:** `/users/register`

**Method:** `POST`

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validations:**

- `firstname`: Must be at least 2 characters long.
- `lastname`: Must be at least 3 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

**Success Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": false,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `201 Created`

**Error Responses:**

- **Validation Error:**

  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      }
    ],
    "message": "Data validation error"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Email Exists:**

  ```json
  {
    "message": "Email already exists"
  }
  ```

  **Status Code:** `409 Conflict`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Login a user

**URL:** `/users/login`

**Method:** `POST`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validations:**

- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

**Success Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": false,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Validation Error:**

  ```json
  {
    "errors": [
      {
        "msg": "invalid email or password",
        "param": "email",
        "location": "body"
      }
    ],
    "message": "Data validation error"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Invalid Credentials:**

  ```json
  {
    "message": "Invalid email or password"
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Get user profile

**URL:** `/users/profile`

**Method:** `GET`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
{
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": false,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access"
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Logout a user

**URL:** `/users/logout`

**Method:** `POST`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
{
  "message": "Logout Successfully"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access"
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Send verification OTP

**URL:** `/users/verify/send-otp`

**Method:** `POST`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
{
  "message": "Verification OTP has been sent on Email"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **User Not Found:**

  ```json
  {
    "message": "User doesn't exist"
  }
  ```

  **Status Code:** `404 Not Found`

- **User Already Verified:**

  ```json
  {
    "message": "User already verified"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Verify OTP

**URL:** `/users/verify`

**Method:** `POST`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "otp": "123456"
}
```

**Success Response:**

```json
{
  "message": "Account successfully verified"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Invalid OTP:**

  ```json
  {
    "message": "Invalid OTP"
  }
  ```

  **Status Code:** `400 Bad Request`

- **OTP Expired:**

  ```json
  {
    "message": "OTP Expired"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Send reset password OTP

**URL:** `/users/reset-password/send-otp`

**Method:** `POST`

**Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Success Response:**

```json
{
  "message": "OTP has been sent to your email address"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **User Not Found:**

  ```json
  {
    "message": "User not found"
  }
  ```

  **Status Code:** `404 Not Found`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Reset password

**URL:** `/users/reset-password`

**Method:** `PUT`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Success Response:**

```json
{
  "message": "Password changed successfully"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Invalid OTP:**

  ```json
  {
    "message": "Invalid OTP"
  }
  ```

  **Status Code:** `400 Bad Request`

- **OTP Expired:**

  ```json
  {
    "message": "OTP expired"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Update name

**URL:** `/users/update-name`

**Method:** `PUT`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

**Success Response:**

```json
{
  "message": "Name updated successfully",
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": false,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **User Not Found:**

  ```json
  {
    "message": "User not found"
  }
  ```

  **Status Code:** `404 Not Found`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Update profile picture

**URL:** `/users/update-profile-picture`

**Method:** `PUT`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
}
```

**Success Response:**

```json
{
  "message": "Profile picture updated successfully",
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": false,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **User Not Found:**

  ```json
  {
    "message": "User not found"
  }
  ```

  **Status Code:** `404 Not Found`

- **Not Premium:**

  ```json
  {
    "message": "You must be a premium member to update your profile picture"
  }
  ```

  **Status Code:** `403 Forbidden`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Update password

**URL:** `/users/update-password`

**Method:** `PUT`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Success Response:**

```json
{
  "message": "Password updated successfully"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Incorrect Old Password:**

  ```json
  {
    "message": "Incorrect old password"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Subscribe to premium plan

**URL:** `/users/subscribe-premium`

**Method:** `PUT`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
{
  "message": "Subscription successful. You are now a premium user",
  "user": {
    "_id": "60c72b2f9b1d4c3a88e4f8b9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "isPremium": true,
    "isAccountVerified": false,
    "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgH..."
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **User Not Found:**

  ```json
  {
    "message": "User not found"
  }
  ```

  **Status Code:** `404 Not Found`

- **Already Premium:**

  ```json
  {
    "message": "You are already a premium user"
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**
  ```json
  {
    "message": "Internal server error",
    "error": "Error message"
  }
  ```
  **Status Code:** `500 Internal Server Error`

### Items Endpoints

#### Add a new item

**URL:** `/items/add`

**Method:** `POST`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "storeLocation": "Home",
  "quantity": 1,
  "purchaseDate": "2021-06-13",
  "expiryDate": null,
  "serialNumber": "123456789",
  "purchaseLocation": "Online",
  "value": 1000,
  "notes": "Work laptop"
}
```

**Success Response:**

```json
{
  "_id": "60c72b2f9b1d8c001c8e4b8b",
  "name": "Laptop",
  "owner": "60c72b2f9b1d8c001c8e4b8a",
  "category": "Electronics",
  "storeLocation": "Home",
  "quantity": 1,
  "purchaseDate": "2021-06-13T00:00:00.000Z",
  "expiryDate": null,
  "serialNumber": "123456789",
  "purchaseLocation": "Online",
  "value": 1000,
  "notes": "Work laptop",
  "__v": 0
}
```

**Status Code:** `201 Created`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access."
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Forbidden:**

  ```json
  {
    "message": "Non-premium users can only add up to 25 items. Upgrade to premium to add more."
  }
  ```

  **Status Code:** `403 Forbidden`

- **Bad Request:**

  ```json
  {
    "errors": [
      {
        "msg": "Name must be at least 2 characters long",
        "param": "name",
        "location": "body"
      }
    ]
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**

  ```json
  {
    "message": "Failed to add item",
    "error": "Error message"
  }
  ```

  **Status Code:** `500 Internal Server Error`

#### Update an item

**URL:** `/items/update/:itemId`

**Method:** `PUT`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**

```json
{
  "name": "Updated Laptop",
  "category": "Electronics",
  "storeLocation": "Office",
  "quantity": 1,
  "purchaseDate": "2021-06-13",
  "expiryDate": null,
  "serialNumber": "987654321",
  "purchaseLocation": "Online",
  "value": 1200,
  "notes": "Updated work laptop"
}
```

**Success Response:**

```json
{
  "_id": "60c72b2f9b1d8c001c8e4b8b",
  "name": "Updated Laptop",
  "owner": "60c72b2f9b1d8c001c8e4b8a",
  "category": "Electronics",
  "storeLocation": "Office",
  "quantity": 1,
  "purchaseDate": "2021-06-13T00:00:00.000Z",
  "expiryDate": null,
  "serialNumber": "987654321",
  "purchaseLocation": "Online",
  "value": 1200,
  "notes": "Updated work laptop",
  "__v": 0
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access."
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Forbidden:**

  ```json
  {
    "message": "Non-premium users can only add up to 25 items. Upgrade to premium to add more."
  }
  ```

  **Status Code:** `403 Forbidden`

- **Bad Request:**

  ```json
  {
    "errors": [
      {
        "msg": "Name must be at least 2 characters long",
        "param": "name",
        "location": "body"
      }
    ]
  }
  ```

  **Status Code:** `400 Bad Request`

- **Internal Server Error:**

  ```json
  {
    "message": "Failed to update item",
    "error": "Error message"
  }
  ```

  **Status Code:** `500 Internal Server Error`

#### Delete an item

**URL:** `/items/delete/:itemId`

**Method:** `DELETE`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
{
  "message": "Item deleted successfully"
}
```

**Status Code:** `200 OK`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access."
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Forbidden:**

  ```json
  {
    "message": "Non-premium users can only add up to 25 items. Upgrade to premium to add more."
  }
  ```

  **Status Code:** `403 Forbidden`

- **Not Found:**

  ```json
  {
    "message": "Item not found"
  }
  ```

  **Status Code:** `404 Not Found`

- **Internal Server Error:**

  ```json
  {
    "message": "Failed to delete item",
    "error": "Error message"
  }
  ```

  **Status Code:** `500 Internal Server Error`

#### Get all items

**URL:** `/items`

**Method:** `GET`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response:**

```json
[
  {
    "_id": "60c72b2f9b1d8c001c8e4b8b",
    "name": "Laptop",
    "owner": "60c72b2f9b1d8c001c8e4b8a",
    "category": "Electronics",
    "storeLocation": "Home",
    "quantity": 1,
    "purchaseDate": "2021-06-13T00:00:00.000Z",
    "expiryDate": null,
    "serialNumber": "123456789",
    "purchaseLocation": "Online",
    "value": 1000,
    "notes": "Work laptop",
    "__v": 0
  }
]
```

**Status Code:** `200 OK`

**Error Responses:**

- **Unauthorized:**

  ```json
  {
    "message": "Unauthorized access."
  }
  ```

  **Status Code:** `401 Unauthorized`

- **Internal Server Error:**

  ```json
  {
    "message": "Failed to retrieve items",
    "error": "Error message"
  }
  ```

  **Status Code:** `500 Internal Server Error`
