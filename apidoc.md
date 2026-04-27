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
- `limit` - Items per page (default: 10)

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

### 3. Health Check
```
GET /health
```

**Response**
```json
{ "status": "ok" }
```