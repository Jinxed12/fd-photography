# 📡 API Documentation

Complete reference for all API endpoints in FD Photography Portfolio.

## 🔑 Authentication

### Login Endpoint

**Endpoint:** `POST /api/auth/login`

**Description:** Get JWT token for admin access

**Request:**
```json
{
  "password": "your-admin-password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "error": "Invalid password"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing password
- `401` - Invalid password
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"MySecure@Pass456!"}'
```

---

## 👗 Looks Endpoints

### Get All Looks

**Endpoint:** `GET /api/looks`

**Description:** List all fashion looks with their images

**Authentication:** Not required

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Urban Minimalist",
    "theme": "Modern",
    "description": "Clean lines and neutral colors",
    "cover_image_url": "https://res.cloudinary.com/...",
    "sequence": 1,
    "images": [
      {
        "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "url": "https://res.cloudinary.com/...",
        "image_type": "full-body",
        "caption": "Front view"
      }
    ]
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl http://localhost:3000/api/looks
```

---

### Create Look (Admin)

**Endpoint:** `POST /api/looks`

**Description:** Create new fashion look

**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "title": "Summer Collection",
  "theme": "Seasonal",
  "description": "Bright and airy designs",
  "cover_image_url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Summer Collection",
  "theme": "Seasonal",
  "description": "Bright and airy designs",
  "cover_image_url": "https://example.com/image.jpg",
  "sequence": 4,
  "created_at": "2025-01-20T10:30:00Z",
  "updated_at": "2025-01-20T10:30:00Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Title is required
- `401` - Unauthorized (missing/invalid token)
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/looks \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Collection",
    "theme": "Seasonal",
    "description": "Bright designs"
  }'
```

---

### Get Single Look

**Endpoint:** `GET /api/looks/:id`

**Description:** Get details of single look with all images

**Authentication:** Not required

**URL Parameters:**
- `id` (UUID) - Look ID

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Urban Minimalist",
  "theme": "Modern",
  "description": "Clean lines and neutral colors",
  "cover_image_url": "https://res.cloudinary.com/...",
  "sequence": 1,
  "images": [
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "url": "https://res.cloudinary.com/...",
      "image_type": "full-body",
      "caption": "Front view"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `404` - Look not found
- `500` - Server error

**Example:**
```bash
curl http://localhost:3000/api/looks/550e8400-e29b-41d4-a716-446655440000
```

---

### Update Look (Admin)

**Endpoint:** `PUT /api/looks/:id`

**Description:** Update look details

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `id` (UUID) - Look ID

**Request:**
```json
{
  "title": "Updated Title",
  "theme": "Updated Theme",
  "description": "Updated description",
  "cover_image_url": "https://new-image.com/image.jpg"
}
```

**Response:** Updated look object (same as GET single look)

**Status Codes:**
- `200` - Updated successfully
- `400` - No valid fields to update
- `401` - Unauthorized
- `404` - Look not found
- `500` - Server error

**Example:**
```bash
curl -X PUT http://localhost:3000/api/looks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

---

### Delete Look (Admin)

**Endpoint:** `DELETE /api/looks/:id`

**Description:** Delete look and all associated images

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `id` (UUID) - Look ID

**Response:**
```json
{
  "message": "Look deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `401` - Unauthorized
- `404` - Look not found
- `500` - Server error

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/looks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🖼️ Images Endpoints

### Upload Image (Admin)

**Endpoint:** `POST /api/images/upload`

**Description:** Upload image to look (stored in Cloudinary)

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Request Parameters:**
- `file` (File, required) - Image file (JPG, PNG, WebP)
- `look_id` (UUID, required) - Look ID to attach image to
- `image_type` (string, optional) - Type: full-body, detail, candid, movement
- `caption` (string, optional) - Image caption

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "look_id": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://res.cloudinary.com/...",
    "image_type": "full-body",
    "caption": "Front view",
    "sequence": 0,
    "created_at": "2025-01-20T10:30:00Z"
  },
  "message": "Image uploaded successfully"
}
```

**Status Codes:**
- `201` - Uploaded successfully
- `400` - File or look_id missing
- `401` - Unauthorized
- `500` - Upload failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "file=@image.jpg" \
  -F "look_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "image_type=full-body" \
  -F "caption=Front view"
```

---

## 👥 Credits Endpoints

### Get All Credits

**Endpoint:** `GET /api/credits`

**Description:** List all team members

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "7ca8b911-9dad-11d1-80b4-00c04fd430c8",
    "role": "photographer",
    "name": "Arjun Kapoor",
    "instagram_handle": "@arjun_clicks",
    "contact_email": "arjun@example.com",
    "portfolio_url": "https://portfolio.com",
    "bio": "Professional photographer",
    "created_at": "2025-01-20T10:30:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Example:**
```bash
curl http://localhost:3000/api/credits
```

---

### Add Credit (Admin)

**Endpoint:** `POST /api/credits`

**Description:** Add team member

**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "role": "photographer",
  "name": "New Person",
  "instagram_handle": "@handle",
  "contact_email": "email@example.com",
  "portfolio_url": "https://portfolio.com",
  "bio": "Bio text"
}
```

**Response:** Newly created credit object

**Status Codes:**
- `201` - Created successfully
- `400` - Role and name required
- `401` - Unauthorized
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/credits \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "role": "designer",
    "name": "Jane Doe",
    "contact_email": "jane@example.com"
  }'
```

---

## 🎫 QR Code Endpoint

### Generate QR Code

**Endpoint:** `GET /api/qr?slug=exhibition-slug`

**Description:** Generate QR code for exhibition

**Authentication:** Not required

**Query Parameters:**
- `slug` (string, required) - Exhibition slug (e.g., "fd-lookbook-2025")

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "url": "http://localhost:3000/exhibition/fd-lookbook-2025",
  "exhibition": {
    "name": "FD Portfolio 2025",
    "venue": "Design Studio",
    "date": "2025-01-20T10:30:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Slug missing
- `404` - Exhibition not found
- `500` - QR generation failed

**Example:**
```bash
curl "http://localhost:3000/api/qr?slug=fd-lookbook-2025"
```

---

## 🔒 Authentication Headers

All admin endpoints require this header:

```
Authorization: Bearer <JWT_TOKEN>
```

Get token from `/api/auth/login` endpoint.

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3000/api/looks
```

---

## 📊 Response Formats

### Success Response (200, 201)
```json
{
  "data": {...} or [...]
}
```

### Error Response (400, 401, 404, 500)
```json
{
  "error": "Error message"
}
```

---

## 🧪 Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'
```

### Get All Looks
```bash
curl http://localhost:3000/api/looks
```

### Get Single Look
```bash
curl http://localhost:3000/api/looks/LOOK_ID
```

### Create Look (needs token)
```bash
curl -X POST http://localhost:3000/api/looks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Look"}'
```

---

## ⚙️ Data Types

### UUID
Unique identifier in format: `550e8400-e29b-41d4-a716-446655440000`

### ENUM: image_type
- `full-body` - Full body photo
- `detail` - Detail/close-up
- `candid` - Candid shot
- `movement` - Action/movement

### ENUM: credit_role
- `photographer`
- `designer`
- `mua` (Makeup Artist)
- `model`
- `stylist`

### Timestamps
ISO 8601 format: `2025-01-20T10:30:00Z`

---

## 🚀 Rate Limiting

No rate limiting in development. Production deployment may have limits.

---

## 📝 Examples

### Complete Workflow

1. **Login**
```bash
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"pass"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
```

2. **Create Look**
```bash
LOOK_ID=$(curl -X POST http://localhost:3000/api/looks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Look"}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)
```

3. **Upload Image**
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg" \
  -F "look_id=$LOOK_ID"
```

4. **Get Look Details**
```bash
curl http://localhost:3000/api/looks/$LOOK_ID
```

---

## 🆘 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login first, get token |
| 404 | Not Found | Check ID is correct |
| 500 | Server Error | Check server logs |

---

## 📚 Related Documents

- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Setup instructions
- [DATABASE.sql](./DATABASE.sql) - Database schema

---

**API Version:** 1.0.0  
**Last Updated:** 2025  
**Status:** Production Ready ✅
