# Contact API Testing

You can test the contact form API endpoint using curl:

## Test the contact form submission:

```bash
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "service": "photography",
    "message": "I would like to inquire about your photography services."
  }'
```

## Test validation (missing fields):

```bash
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": ""
  }'
```

## Test invalid email:

```bash
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "service": "photography",
    "message": "Test message"
  }'
```

## Expected Responses:

### Success (200):

```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon."
}
```

### Validation Error (400):

```json
{
  "success": false,
  "error": "All fields are required"
}
```

### Server Error (500):

```json
{
  "success": false,
  "error": "There was an error processing your request. Please try again."
}
```
