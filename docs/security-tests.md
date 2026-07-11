# IDOR Protection Test Evidence

**Date**: July 11, 2026  
**Tested by**: AI Build Agent  
**Request**: Verify admin routes reject student tokens

---

## Test Setup

- **Backend**: http://localhost:8001
- **Student credentials**: `1GD23CS001 / student123`
- **Admin credentials**: `admin@gcem.edu / admin123`

---

## Test Results

### Test 1: GET /api/admin/students (Student Token)

**Request**:
```http
GET /api/admin/students HTTP/1.1
Authorization: Bearer <student_jwt>
```

**Response**:
```json
HTTP/1.1 403 Forbidden
{"detail":"Admin access required"}
```

**Result**: ✅ PASS — Student correctly denied access

---

### Test 2: GET /api/admin/analytics (Student Token)

**Request**:
```http
GET /api/admin/analytics HTTP/1.1
Authorization: Bearer <student_jwt>
```

**Response**:
```json
HTTP/1.1 403 Forbidden
{"detail":"Admin access required"}
```

**Result**: ✅ PASS — Student correctly denied access

---

### Test 3: POST /api/tests (Student Token)

**Request**:
```http
POST /api/tests HTTP/1.1
Authorization: Bearer <student_jwt>
Content-Type: application/json

{"title":"hacker test"}
```

**Response**:
```json
HTTP/1.1 403 Forbidden
```

**Result**: ✅ PASS — Student cannot create tests

---

### Test 4: GET /api/admin/students (Admin Token)

**Request**:
```http
GET /api/admin/students HTTP/1.1
Authorization: Bearer <admin_jwt>
```

**Response**:
```json
HTTP/1.1 200 OK
[{"id":2,"email":"1gd23cs001@gcem.edu","username":"1gd23cs001",...}]
```

**Result**: ✅ PASS — Admin can access their own routes

---

## Summary

| Endpoint | Student Token | Admin Token | Status |
|----------|---------------|-------------|--------|
| GET /api/admin/students | 403 Forbidden | 200 OK | ✅ |
| GET /api/admin/analytics | 403 Forbidden | — | ✅ |
| POST /api/tests | 403 Forbidden | — | ✅ |

**All IDOR protection tests PASSED.** Admin routes are properly protected with `requireAdmin` middleware.
