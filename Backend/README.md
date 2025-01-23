# User Registration API Documentation

## Register User Endpoint

`POST /users/register`

### Description

Creates a new user account with the provided information. The endpoint validates the input data, hashes the password, and returns a JWT token upon successful registration.

---

### Request Body

```json
{
  "fullname": {
    "firstname": "string", // min 2 characters
    "lastname": "string" // min 3 characters
  },
  "email": "string", // valid email format
  "password": "string" // min 6 characters
}
```

### Validation Rules

- **firstname**: Minimum 2 characters required
- **lastname**: Minimum 3 characters required
- **email**: Must be in a valid email format and unique
- **password**: Minimum 6 characters required

---

### Responses

#### **201 Created**

Successful registration response:

```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

#### **400 Bad Request**

Validation errors:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### **404 Not Found**

Server error during user creation:

```json
{
  "message": "an error occurred"
}
```

---

### Example cURL Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Login User Endpoint

`POST /users/login`

### Description

Authenticates a user with the provided email and password. The endpoint validates the input data and returns a JWT token upon successful authentication.

---

### Request Body

```json
{
  "email": "string", // valid email format
  "password": "string" // min 6 characters
}
```

### Validation Rules

- **email**: Must be in a valid email format
- **password**: Minimum 6 characters required

---

### Responses

#### **200 OK**

Successful login response:

```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

#### **400 Bad Request**

Validation errors:

```json
{
  "errors": [
    {
      "msg": "Invalid email or password",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### **401 Unauthorized**

Invalid email or password:

```json
{
  "message": "Invalid email or password"
}
```

---

### Example cURL Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Get User Profile Endpoint

`GET /users/profile`

### Description

Retrieves the profile information of the authenticated user.

### Responses

#### **200 OK**

Successful profile retrieval response:

```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "socketId": null
}
```

#### **401 Unauthorized**

Unauthorized access:

```json
{
  "message": "Unauthorized access"
}
```

---

### Example cURL Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer jwt_token_string"
```

---

## Logout User Endpoint

`GET /users/logout`

### Description

Logs out the authenticated user by invalidating the JWT token.

### Responses

#### **200 OK**

Successful logout response:

```json
{
  "message": "Logged Out"
}
```

#### **401 Unauthorized**

Unauthorized access:

```json
{
  "message": "Unauthorized access"
}
```

---

### Example cURL Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer jwt_token_string"
```

---

## Register Captain Endpoint

`POST /captains/register`

### Description

Creates a new captain account with the provided information. The endpoint validates the input data, hashes the password, and returns a JWT token upon successful registration.

---

### Request Body

```json
{
  "fullname": {
    "firstname": "string", // min 3 characters
    "lastname": "string" // min 3 characters
  },
  "email": "string", // valid email format
  "password": "string", // min 6 characters
  "vehicle": {
    "vehicleType": "string", // "Car", "Motorcycle", "Auto"
    "plate": "string", // min 3 characters
    "color": "string", // min 3 characters
    "capacity": "number" // min 1
  }
}
```

### Validation Rules

- **firstname**: Minimum 3 characters required
- **lastname**: Minimum 3 characters required
- **email**: Must be in a valid email format and unique
- **password**: Minimum 6 characters required
- **vehicleType**: Must be one of "Car", "Motorcycle", "Auto"
- **plate**: Minimum 3 characters required
- **color**: Minimum 3 characters required
- **capacity**: Minimum 1 required

---

### Responses

#### **201 Created**

Successful registration response:

```json
{
  "token": "jwt_token_string",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "vehicle": {
      "vehicleType": "Car",
      "plate": "ABC123",
      "color": "Red",
      "capacity": 4
    },
    "socketId": null,
    "status": "inactive"
  }
}
```

#### **400 Bad Request**

Validation errors:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### **409 Conflict**

Email already exists:

```json
{
  "message": "Email already exists"
}
```

#### **500 Internal Server Error**

Server error during captain creation:

```json
{
  "message": "Internal server error",
  "error": "error_message"
}
```

---

### Example cURL Request

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123",
    "vehicle": {
      "vehicleType": "Car",
      "plate": "ABC123",
      "color": "Red",
      "capacity": 4
    }
  }'
```

---

## Get Captain Profile Endpoint

`GET /captains/profile`

### Description

Retrieves the profile information of the authenticated captain.

### Responses

#### **200 OK**

Successful profile retrieval response:

```json
{
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "vehicle": {
      "vehicleType": "Car",
      "plate": "ABC123",
      "color": "Red",
      "capacity": 4
    },
    "socketId": null,
    "status": "inactive"
  }
}
```

#### **401 Unauthorized**

Unauthorized access:

```json
{
  "message": "Unauthorized access"
}
```

---

### Example cURL Request

```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer jwt_token_string"
```

---

## Logout Captain Endpoint

`GET /captains/logout`

### Description

Logs out the authenticated captain by invalidating the JWT token.

### Responses

#### **200 OK**

Successful logout response:

```json
{
  "message": "Logout Successfully"
}
```

#### **401 Unauthorized**

Unauthorized access:

```json
{
  "message": "Unauthorized access"
}
```

---

### Example cURL Request

```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer jwt_token_string"
```
