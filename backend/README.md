# Playure FastAPI Backend

Backend API service for **Playure - India's Premier Sports Networking Platform**.

---

### 🚀 Quick Start Instructions

1. **Navigate to the `backend` directory**:
   ```bash
   cd backend
   ```

2. **Create & Activate a Python Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

5. **Access Interactive API Docs**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

---

### 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── routers/
│       ├── __init__.py
│       ├── posts.py
│       ├── competitions.py
│       ├── users.py
│       └── ai_chat.py
├── .env.example
├── requirements.txt
└── README.md
```
