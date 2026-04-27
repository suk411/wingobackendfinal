# Wingo Backend API

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Game Sync (Current Round)
```
GET /WinGo/WinGo_30S.json
```

Returns current round info (previous, current, next round with issueNumber, startTime, endTime).

---

### 2. Draw History
```
GET /WinGo/WinGo_30S/GetHistoryIssuePage.json?pageNo=1
```

Returns list of draw results with pagination.

**Query Params**
- `pageNo` - Page number (default: 1)

**Response**
```json
{
  "data": {
    "list": [
      { "issueNumber": "2026042700002", "number": 7 },
      { "issueNumber": "2026042700001", "number": 3 }
    ],
    "pageNo": 1,
    "totalPage": 1,
    "totalCount": 10
  },
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0,
  "serviceTime": 1777274817271
}
```

---

### 3. Trend Statistics
```
GET /WinGo/WinGo_30S/GetTrendStatistics.json
```

Returns statistics for each number (0-9).

**Response**
```json
{
  "data": [
    { "number": 0, "missingCount": 7, "avgMissing": 8, "openCount": 10, "maxContinuous": 1 },
    { "number": 1, "missingCount": 10, "avgMissing": 7, "openCount": 11, "maxContinuous": 2 },
    { "number": 2, "missingCount": 15, "avgMissing": 10, "openCount": 8, "maxContinuous": 2 },
    { "number": 3, "missingCount": 0, "avgMissing": 9, "openCount": 9, "maxContinuous": 1 },
    { "number": 4, "missingCount": 6, "avgMissing": 7, "openCount": 11, "maxContinuous": 3 },
    { "number": 5, "missingCount": 1, "avgMissing": 4, "openCount": 17, "maxContinuous": 2 },
    { "number": 6, "missingCount": 49, "avgMissing": 11, "openCount": 7, "maxContinuous": 2 },
    { "number": 7, "missingCount": 5, "avgMissing": 8, "openCount": 10, "maxContinuous": 1 },
    { "number": 8, "missingCount": 13, "avgMissing": 11, "openCount": 7, "maxContinuous": 1 },
    { "number": 9, "missingCount": 14, "avgMissing": 8, "openCount": 10, "maxContinuous": 2 }
  ],
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0,
  "serviceTime": 1777280610983
}
```

**Fields:**
- `missingCount` - Current gap since last appearance
- `avgMissing` - Average rounds between appearances
- `openCount` - Frequency count in sample
- `maxContinuous` - Longest consecutive winning streak

---

### 4. User Data
```
GET /wingo/user
```

Returns user data (requires JWT token).

**Headers**
- `Authorization: Bearer <token>`

**Response**
```json
{
  "userId": "user123",
  "balance": 1000.50
}
```

---

### 5. Health Check
```
GET /health
```

**Response**
```json
{ "status": "ok" }
```