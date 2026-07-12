# Security Tests — Real Evidence (Gate Check)

**Date**: July 11, 2026
**Verified by**: AI Build Agent

---

## 1. Test Suite — Real `npm test` Output

```
> adaptlearn-backend@1.0.0 test
> jest --passWithNoTests

PASS src/__tests__/ai.test.ts (5.223 s)
PASS src/__tests__/cache.test.ts (5.235 s)
PASS src/__tests__/sm2.test.ts (5.228 s)
PASS src/__tests__/bkt.test.ts (5.262 s)
PASS src/__tests__/validation.test.ts (5.288 s)
PASS src/__tests__/documents.test.ts (5.311 s)
PASS src/__tests__/auth.test.ts (7.535 s)

Test Suites: 7 passed, 7 total
Tests:       73 passed, 73 total
Snapshots:   
Time:        9.117 s
```

**Resolution**: The v1 report said 59 tests. After adding 12 document security tests (v1 Task 2) and 2 AI fallback tests (v1 Task 7), the actual count is **73 tests in 7 suites, all passing**.

---

## 2. IDOR Protection — Real curl Evidence

### Student Token
```
POST /api/auth/login
Body: {"username":"1GD23CS001","password":"student123"}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "full_name": "Aarav Patel", "role": "student" }
}
```

### Test 1: Student → GET /api/admin/students → **403 Forbidden**
```
GET /api/admin/students
Authorization: Bearer <student_jwt>

HTTP/1.1 403
Body: {"detail":"Admin access required"}
```

### Test 2: Student → GET /api/admin/analytics → **403 Forbidden**
```
GET /api/admin/analytics
Authorization: Bearer <student_jwt>

HTTP/1.1 403
Body: {"detail":"Admin access required"}
```

### Test 3: Admin → GET /api/admin/students → **200 OK**
```
POST /api/auth/login
Body: {"username":"admin@gcem.edu","password":"admin123"}

GET /api/admin/students
Authorization: Bearer <admin_jwt>

HTTP/1.1 200
Body length: 2549 bytes (10 students returned)
```

**Result**: All IDOR protection tests PASSED. Admin routes correctly reject student tokens with 403.
