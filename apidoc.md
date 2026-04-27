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
    "issueNumber": "2026042713191999999",
    "startTime": 1777276140000,
    "endTime": 1777276170000
  },
  "current": {
    "issueNumber": "2026042713194900001",
    "startTime": 1777276170000,
    "endTime": 1777276200000
  },
  "next": {
    "issueNumber": "2026042713194900002",
    "startTime": 1777276200000,
    "endTime": 1777276230000
  }
}
```

---

### 2. Health Check
```
GET /health
```

**Response**
```json
{ "status": "ok" }
```