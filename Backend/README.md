# User API Documentation

## Endpoints

### Register a new user

**URL:** `/users/register`

# HIMS API Documentation

## User Endpoints

### Register User

- **POST** `/users/register`
- **Body:** `{ fullname: { firstname, lastname }, email, password }`
- **Validations:** firstname: min 2 chars, lastname: min 3 chars, email: valid format, password: min 6 chars
- **Success:** `201 Created` `{ token, user }`
- **Errors:** `400 Bad Request` (validation), `409 Conflict` (email exists), `500 Internal Server Error`

---

### Login User

- **POST** `/users/login`
- **Body:** `{ email, password }`
- **Validations:** email: valid format, password: min 6 chars
- **Success:** `200 OK` `{ token, user }`
- **Errors:** `400 Bad Request` (validation), `401 Unauthorized` (invalid credentials), `500 Internal Server Error`

---

### Get User Profile

- **GET** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `{ user }`
- **Errors:** `401 Unauthorized`, `500 Internal Server Error`

---

### Logout User

- **POST** `/users/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `{ message: "Logout Successfully" }`
- **Errors:** `401 Unauthorized`, `500 Internal Server Error`

---

### Send Verification OTP

- **POST** `/users/verify/send-otp`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `{ message: "Verification OTP has been sent on Email" }`
- **Errors:** `404 Not Found` (user), `400 Bad Request` (already verified), `500 Internal Server Error`

---

### Verify OTP

- **POST** `/users/verify`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ otp }`
- **Success:** `200 OK` `{ message: "Account successfully verified" }`
- **Errors:** `400 Bad Request` (invalid/expired OTP), `500 Internal Server Error`

---

### Send Reset Password OTP

- **POST** `/users/reset-password/send-otp`
- **Body:** `{ email }`
- **Success:** `200 OK` `{ message: "OTP has been sent to your email address" }`
- **Errors:** `404 Not Found` (user), `500 Internal Server Error`

---

### Reset Password

- **PUT** `/users/reset-password`
- **Body:** `{ email, otp, newPassword }`
- **Success:** `200 OK` `{ message: "Password changed successfully" }`
- **Errors:** `400 Bad Request` (invalid/expired OTP), `500 Internal Server Error`

---

### Update Name

- **PUT** `/users/update-name`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ fullname }`
- **Success:** `200 OK` `{ message: "Name updated successfully", user }`
- **Errors:** `404 Not Found` (user), `500 Internal Server Error`

---

### Update Profile Picture

- **PUT** `/users/update-profile-picture`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ profilePicture }`
- **Success:** `200 OK` `{ message: "Profile picture updated successfully", user }`
- **Errors:** `404 Not Found` (user), `403 Forbidden` (not premium), `500 Internal Server Error`

---

### Update Password

- **PUT** `/users/update-password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ oldPassword, newPassword }`
- **Success:** `200 OK` `{ message: "Password updated successfully" }`
- **Errors:** `400 Bad Request` (incorrect old password), `500 Internal Server Error`

---

## Item Endpoints

### Add Item

- **POST** `/items/add`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, category, storeLocation, quantity, purchaseDate, expiryDate, serialNumber, purchaseLocation, value, notes, image }`
- **Success:** `201 Created` `{ item }`
- **Errors:** `401 Unauthorized`, `400 Bad Request`, `500 Internal Server Error`

---

### Update Item

- **PUT** `/items/update/:itemId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ ...fields to update }`
- **Success:** `200 OK` `{ item }`
- **Errors:** `401 Unauthorized`, `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`

---

### Delete Item

- **DELETE** `/items/delete/:itemId`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `{ message: "Item deleted successfully" }`
- **Errors:** `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

---

### Get All Items

- **GET** `/items`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `[ item, ... ]`
- **Errors:** `401 Unauthorized`, `500 Internal Server Error`

---

### Get Item

- **GET** `/items/:itemId`
- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200 OK` `{ item }`
- **Errors:** `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`

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
