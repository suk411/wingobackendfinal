====================================================
WINGO 30S COMPLETE API DOCUMENTATION (FULL RESPONSE)
====================================================


========================
1. GAME SYNC (HEARTBEAT)
========================

REQUEST (JSON)
GET /WinGo/WinGo_30S.json?ts=1777270647393


RESPONSE (JSON)
{
  "gameCode": "WinGo_30S",
  "intervalMinute": 0.50,
  "state": 1,
  "previous": {
    "issueNumber": "20260427100050893",
    "startTime": 1777274760000,
    "endTime": 1777274790000
  },
  "current": {
    "issueNumber": "20260427100050894",
    "startTime": 1777274790000,
    "endTime": 1777274820000
  },
  "next": {
    "issueNumber": "20260427100050895",
    "startTime": 1777274820000,
    "endTime": 1777274850000
  }
}


EXPLANATION

- intervalMinute = 0.50 → round duration = 30 seconds  
- state = 1 → game running  

previous → finished round  
current → active betting round  
next → upcoming round  

Use:
- current.issueNumber → betting  
- current.endTime → countdown  


========================
2. DRAW HISTORY
========================

REQUEST (JSON)
GET /WinGo/WinGo_30S/GetHistoryIssuePage.json?ts=1777270586922


RESPONSE (JSON)
{
  "data": {
    "list": [
      {
        "issueNumber": "20260427100050894",
        "number": "0",
        "color": "red,violet",
        "premium": "0",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050893",
        "number": "6",
        "color": "red",
        "premium": "6",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050892",
        "number": "4",
        "color": "red",
        "premium": "4",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050891",
        "number": "0",
        "color": "red,violet",
        "premium": "0",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050890",
        "number": "7",
        "color": "green",
        "premium": "7",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050889",
        "number": "7",
        "color": "green",
        "premium": "7",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050888",
        "number": "9",
        "color": "green",
        "premium": "9",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050887",
        "number": "1",
        "color": "green",
        "premium": "1",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050886",
        "number": "9",
        "color": "green",
        "premium": "9",
        "sum": 0
      },
      {
        "issueNumber": "20260427100050885",
        "number": "9",
        "color": "green",
        "premium": "9",
        "sum": 0
      }
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


EXPLANATION

- First item = latest result  
- number = winning digit  
- color mapping:
  - green → 1,3,7,9  
  - red → 2,4,6,8  
  - red,violet → 0  
  - green,violet → 5  

Use for:
- result display  
- bet settlement  


========================
3. TREND STATISTICS
========================

REQUEST (JSON)
GET /WinGo/WinGo_30S/GetTrendStatistics.json?ts=1777270599000


RESPONSE (JSON)
{
  "data": [
    {
      "type": 5,
      "typeName": "Interval Number",
      "type_Number": 0,
      "number_0": 7,
      "number_1": 7,
      "number_2": 12,
      "number_3": 12,
      "number_4": 9,
      "number_5": 6,
      "number_6": 12,
      "number_7": 8,
      "number_8": 8,
      "number_9": 17
    },
    {
      "type": 4,
      "typeName": "Avg Missing",
      "type_Number": 0,
      "number_0": 13,
      "number_1": 13,
      "number_2": 7,
      "number_3": 7,
      "number_4": 10,
      "number_5": 15,
      "number_6": 7,
      "number_7": 11,
      "number_8": 11,
      "number_9": 4
    },
    {
      "type": 3,
      "typeName": "Max Continued",
      "type_Number": 0,
      "number_0": 1,
      "number_1": 3,
      "number_2": 2,
      "number_3": 3,
      "number_4": 1,
      "number_5": 2,
      "number_6": 1,
      "number_7": 1,
      "number_8": 2,
      "number_9": 2
    },
    {
      "type": 2,
      "typeName": "Missing",
      "type_Number": 0,
      "number_0": 41,
      "number_1": 38,
      "number_2": 3,
      "number_3": 1,
      "number_4": 8,
      "number_5": 0,
      "number_6": 4,
      "number_7": 14,
      "number_8": 16,
      "number_9": 2
    },
    {
      "type": 1,
      "typeName": "Frequency",
      "type_Number": 0,
      "number_0": 6,
      "number_1": 8,
      "number_2": 13,
      "number_3": 14,
      "number_4": 8,
      "number_5": 7,
      "number_6": 11,
      "number_7": 7,
      "number_8": 8,
      "number_9": 18
    }
  ],
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0
}


EXPLANATION

type meanings:

1 → Frequency (hot numbers)  
2 → Missing (current gap) ⭐  
3 → Max Continued (streak)  
4 → Avg Missing  
5 → Interval pattern  

Important:
- High missing → overdue number  
- High frequency → hot number  


========================
4. PLACE BET
========================

REQUEST (JSON)
POST /api/bet/wingo

{
  "gameCode": "WinGo_30S",
  "issueNumber": "20260427100050894",
  "selectValue": "green",
  "amount": 10
}


RESPONSE (JSON)
{
  "code": 0,
  "msg": "Success",
  "data": {
    "newBalance": 5420.50
  }
}


EXPLANATION

- selectValue:
  number → 0–9  
  color → red/green/violet  
  size → big/small  

- total bet = amount × multiply  

Rules:
- must match current issue  
- reject after endTime  
- validate balance  


========================
GAME RULES
========================

Green → 1,3,7,9  
Red → 2,4,6,8  
Violet → 0,5  

Special:
0 = Red + Violet  
5 = Green + Violet  

Small → 0–4  
Big → 5–9  


========================
SYSTEM FLOW
========================

1. Call Game Sync  
2. Get current issue  
3. Start countdown  
4. Place bet  
5. Wait for result  
6. Fetch history  
7. Match issue  
8. Settle bets  
9. Move to next  


====================================================
END
====================================================