## how to run the code
git clone https://github.com/soohiaaaa/381.git
cd 381
npm install
cp .env.example .env

 第 5 步：只改这一行！把下面这一整行替换成你自己的 Atlas 地址
 （没有 Atlas？去 https://cloud.mongodb.com 免费注册 3 分钟就有）
nano .env    ← 粘贴你的 Atlas 连接字符串 → Ctrl+O → 回车 → Ctrl+X

npm run dev    # 或者直接 npm start

3. 浏览器打开 http://localhost:3000



## Expense Tracker – Express + MongoDB + EJS

Personal expense tracker demonstrating session-based auth, EJS web UI CRUD, and unauthenticated RESTful APIs backed by MongoDB.

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas cluster or local MongoDB instance
- Cloud deployment target (Render free tier example below)

### 2. Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment  
   Create `.env` with:
   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
   SESSION_SECRET=replace_with_strong_secret
   PORT=3000
   ```
   For Atlas/cloud, use the provided connection string.
3. Start MongoDB (skip if Atlas).
4. Run the server
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000`. Register your own user, then log in to access the CRUD dashboard.

### 3. Features checklist
- Login / logout with session + cookie
- Protected EJS dashboard for CRUD (filters + create/edit/delete)
- REST APIs (GET/POST/PUT/DELETE) without auth as required

### 4. REST API cURL scripts
Replace `<BASE_URL>` with `http://localhost:3000` or your cloud URL and set `EXPENSE_ID` and `USER_ID` as needed.

```bash
# CREATE (POST /api/expenses)
curl -X POST <BASE_URL>/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<USER_ID>",
    "title": "Coffee",
    "amount": 4.75,
    "category": "Food",
    "note": "Latte on the way to work"
  }'

# READ (GET /api/expenses?category=Food)
curl "<BASE_URL>/api/expenses?category=Food"

# UPDATE (PUT /api/expenses/:id)
curl -X PUT <BASE_URL>/api/expenses/<EXPENSE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Groceries",
    "amount": 82.15,
    "category": "Shopping",
    "note": "Weekly grocery run"
  }'

# DELETE (DELETE /api/expenses/:id)
curl -X DELETE <BASE_URL>/api/expenses/<EXPENSE_ID>
```

To obtain `USER_ID`, inspect MongoDB after registering/logging in or call `GET /api/expenses` once you’ve created records.

### 5. Cloud deployment (Render example)
1. Push this repository to GitHub.
2. Create a free MongoDB Atlas cluster and add its connection string to Render’s environment variables (`MONGODB_URI`).
3. On Render:
   - Create **New + Web Service**, connect GitHub repo.
   - Build command: `npm install`
   - Start command: `npm run start`
   - Environment variables: `MONGODB_URI`, `SESSION_SECRET`, `PORT` (set to `3000`).
4. Deploy; Render will host your app publicly. Update `<BASE_URL>` in your cURL tests to the Render URL.

You can deploy to any other cloud (Railway, Azure App Service, etc.) using similar environment variable and start command settings.


