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

**Response**
```json
{
  "gameCode": "WinGo_30S",
  "intervalMinute": 0.5,
  "state": 1,
  "previous": {
    "issueNumber": "2026042700001",
    "startTime": 1777277550000,
    "endTime": 1777277580000
  },
  "current": {
    "issueNumber": "2026042700002",
    "startTime": 1777277580000,
    "endTime": 1777277610000
  },
  "next": {
    "issueNumber": "2026042700003",
    "startTime": 1777277610000,
    "endTime": 1777277640000
  }
}
```

---

### 2. Draw History
```
GET /WinGo/WinGo_30S/GetHistoryIssuePage.json?pageNo=1
```

Returns list of draw results (issueNumber, number). 25s betting + 5s result period per round.

**Response**
```json
{
  "data": {
    "list": [
      { "issueNumber": "2026042700002", "number": 7 },
      { "issueNumber": "2026042700001", "number": 3 }
    ],
    "pageNo": 1,
    "totalPage": 50,
    "totalCount": 500
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