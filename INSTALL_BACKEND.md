# Backend Installation - Step by Step

## Run these commands one by one:

### Step 1: Go to backend folder
```bash
cd backend
```

### Step 2: Activate virtual environment (if not already active)
```bash
venv\Scripts\activate
```

### Step 3: Upgrade pip
```bash
python -m pip install --upgrade pip
```

### Step 4: Install psycopg2-binary (database driver)
```bash
pip install --only-binary :all: psycopg2-binary
```

### Step 5: Install all other packages
```bash
pip install fastapi uvicorn[standard] python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv sqlalchemy alembic pydantic pydantic-settings httpx python-dateutil pytest pytest-asyncio black
```

### Step 6: Run the backend
```bash
uvicorn app.main:app --reload
```

## Done!
Backend should now be running at http://localhost:8000
API docs at http://localhost:8000/docs
