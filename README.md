# 🌿 EcoLens AI: Sustainable Product Analyzer

EcoLens AI is a full-stack web application designed to help users make environmentally conscious purchasing decisions. By scanning a product's barcode (or using a simulated scan), the app fetches real-time data from the OpenFoodFacts API, calculates an AI-driven sustainability score, and estimates the carbon footprint of the product.

## 🚀 Features

- **Smart Barcode Scanning**: Simulated barcode detection logic optimized for Windows and local development.
- **AI-Powered Impact Analysis**: Calculates sustainability scores (0-100) and CO2 emissions based on product materials and packaging.
- **Real-time Data Integration**: Connects to the **OpenFoodFacts API** for authentic product information.
- **Persistent History**: Stores every scan in a **PostgreSQL/SQLite** database using a modular CRUD architecture.
- **Modern Dashboard**: A responsive React interface featuring data visualization cards and a recent scans history table.

---

## 🛠️ Tech Stack

### **Backend**

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: SQLAlchemy
- **Barcode Logic**: PyZbar (with mock-fallback for Windows stability)
- **Validation**: Pydantic

### **Frontend**

- **Library**: React.js
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Icons**: Lucide-React

---

## 📂 Project Structure

The project follows a **Modular Design Pattern** to ensure scalability and clean separation of concerns.

```text
TY-Project/
├── eco-backend/             # FastAPI Backend
│   ├── main.py              # API entry point & routes
│   ├── database.py          # Database connection & session
│   ├── models.py            # SQLAlchemy database schemas
│   ├── crud.py              # Database Create/Read operations
│   ├── utils.py             # External API calls & AI logic
│   └── requirements.txt     # Python dependencies
├── eco-frontend/            # React Frontend
│   ├── src/
│   │   ├── components/      # UI components (Scanner, Table, Cards)
│   │   ├── api/             # Centralized Axios API calls
│   │   └── App.jsx          # Main application logic
│   └── tailwind.config.js   # Style configuration
└── README.md
```
