# Backend Documentation

## /users/register Endpoint

### Endpoint
**POST** /users/register

## Description
Registers a new user. Requires a firstname, email, and password. Lastname is optional.

## Request Payload
```json
{
  "fullname": {
    "firstname": "string (required)",
    "lastname": "string (optional)"
  },
  "email": "string (required)",
  "password": "string (required)"
}
```

## Response Status Codes
- **201 Created**: User registered successfully.
- **400 Bad Request**: Missing or invalid fields.
- **500 Internal Server Error**: Server encountered an error.

## Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Example Response (Success, 201) for /users/register
```json
{
  "token": "generated-jwt-token",
  "user": {
    "_id": "generated-user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

## /users/login Endpoint

### Endpoint
**POST** /users/login

### Description
Logs in an existing user using email and password.

### Request Payload
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

### Response Status Codes
- **201 Created**: User logged in successfully.
- **400 Bad Request**: Missing or invalid fields.
- **401 Unauthorized**: Invalid user or password.
- **500 Internal Server Error**: Server encountered an error.

### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Example Response (Success, 201) for /users/login
```json
{
  "token": "generated-jwt-token",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

## /users/profile Endpoint

### Endpoint
**GET** /users/profile

### Description
Fetches the profile of the currently authenticated user. Requires a valid authentication token passed via cookies or the Authorization header.

### Headers
- **Authorization**: Bearer token (if not using cookies)

### Response Status Codes
- **200 OK**: Returns the authenticated user's profile.
- **401 Unauthorized**: Missing, invalid, or blacklisted token.
- **500 Internal Server Error**: Server encountered an error.

### Example Response (Success, 200)
```json
{
  "_id": "user-id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

## /users/logout Endpoint

### Endpoint
**GET** /users/logout

### Description
Logs out the authenticated user by clearing the authentication cookie and blacklisting the token.

### Headers
- **Authorization**: Bearer token (if not using cookies)
 
### Response Status Codes
- **200 OK**: User logged out successfully.
- **401 Unauthorized**: If no valid token is present.
- **500 Internal Server Error**: Server encountered an error.

### Example Response (Success, 200)
```json
{
  "message": "logged out"
}
```
# Captain Routes

## /captain/register Endpoint

### Endpoint
**POST** /captain/register

### Description
Registers a new captain. Requires captain details including fullname, email, password, and vehicle details such as color, plate, capacity, and vehicleType. Latitude and longitude are optional.

### Request Payload
```json
{
  "fullname": {
    "firstname": "string (required)",
    "lastname": "string (optional)"
  },
  "email": "string (required)",
  "password": "string (required)",
  "vehicle": {
    "color": "string (required)",
    "plate": "string (required)",
    "capacity": "number (required)",
    "vehicleType": "string (required, one of 'bike', 'auto', or 'car')",
    "location": {
      "lat": "number (optional)",
      "lng": "number (optional)"
    }
  }
}
```

### Response Status Codes
- **201 Created**: Captain registered successfully.
- **400 Bad Request**: Missing or invalid fields.
- **401 Unauthorized**: Validation errors.
- **500 Internal Server Error**: Server encountered an error.

### Example Request
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "strongPassword123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "vehicleType": "car",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
}
```

### Example Response (Success, 201)
```json
{
  "token": "generated-jwt-token",
  "captain": {
    "_id": "generated-captain-id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  }
}
```
