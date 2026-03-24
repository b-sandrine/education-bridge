# Secure Admin Account Creation

## Overview
The admin account creation endpoint allows secure creation of admin users using a master admin secret key. This prevents unauthorized admin account creation.

## Setup

### 1. Set the Admin Secret Key
Add the `ADMIN_SECRET_KEY` environment variable to your `.env` file:

```bash
# .env file
ADMIN_SECRET_KEY=your-super-secure-secret-key-here-change-this
```

**Security Best Practices:**
- Use a strong, random secret key (minimum 32 characters)
- Generate one using: `openssl rand -hex 32`
- Store it securely in your deployment environment variables
- Never commit it to version control
- Rotate periodically in production

### 2. Environment Variable Example
```env
# Example .env file
DATABASE_URL="postgresql://user:password@localhost:5432/education_bridge"
JWT_SECRET="your-jwt-secret-key"
ADMIN_SECRET_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
NODE_ENV="development"
```

## Using the Endpoint

### Request
```
POST /api/auth/create-admin
```

**Headers:**
```
X-Admin-Secret: your-super-secure-secret-key-here-change-this
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "role": "admin"
}
```

Note: The `role` field will be ignored and forced to `admin` for security.

### Response (Success)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Admin account created successfully"
  }
}
```

### Response (Error Examples)

**Missing Admin Secret Header:**
```json
{
  "status": "error",
  "data": null,
  "message": "Missing X-Admin-Secret header"
}
```

**Invalid Admin Secret:**
```json
{
  "status": "error",
  "data": null,
  "message": "Invalid admin secret key"
}
```

**User Already Exists:**
```json
{
  "status": "error",
  "data": null,
  "message": "User with this email already exists"
}
```

## Usage Examples

### cURL
```bash
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

### Postman
1. Set request method to `POST`
2. URL: `http://localhost:3000/api/auth/create-admin`
3. Headers tab:
   - `X-Admin-Secret`: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - `Content-Type`: `application/json`
4. Body (raw JSON):
   ```json
   {
     "firstName": "Admin",
     "lastName": "User",
     "email": "admin@example.com",
     "password": "SecurePassword123!"
   }
   ```

### JavaScript/Fetch
```javascript
const createAdmin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/create-admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Secret': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    body: JSON.stringify({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'SecurePassword123!'
    })
  });

  const data = await response.json();
  if (data.status === 'success') {
    console.log('Admin created:', data.data.user);
    console.log('Token:', data.data.token);
  } else {
    console.error('Error:', data.message);
  }
};
```

## Validation Rules

The endpoint validates the same rules as regular registration:

- **firstName**: Required, string
- **lastName**: Required, string
- **email**: Required, valid email format
- **password**: Required, minimum 8 characters
- **role**: Automatically set to `admin` (ignored if provided)

## Security Considerations

1. **Secret Key Management**
   - Use strong, random secret keys
   - Store in environment variables only
   - Never expose in client-side code
   - Rotate keys periodically in production

2. **HTTPS Only**
   - Always use HTTPS in production
   - Set secure headers in your web server
   - Use Content Security Policy (CSP)

3. **Rate Limiting**
   - Consider implementing rate limiting on this endpoint
   - Protect against brute force attacks

4. **Logging**
   - Log all admin creation attempts (successful and failed)
   - Monitor for suspicious patterns

5. **Access Control**
   - Only allow trusted systems to access this endpoint
   - Use IP whitelisting if possible
   - Consider requiring additional authentication factors

## Troubleshooting

**Issue: Getting "Admin secret key not enabled"**
- Solution: Ensure `ADMIN_SECRET_KEY` is set in your `.env` file and the server has been restarted

**Issue: Getting "Invalid admin secret key"**
- Solution: Verify the secret key in the header exactly matches the one in your `.env`

**Issue: Getting "User with this email already exists"**
- Solution: Use a different email address that hasn't been registered yet

**Issue: Password validation error**
- Solution: Ensure password is at least 8 characters long
