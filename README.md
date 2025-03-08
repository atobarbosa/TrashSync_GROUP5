# TrashSync - Smart Waste Management

TrashSync is a smart waste management system that allows users to schedule waste pickups, report uncollected trash, and track scheduled pickups.

## Features
- Schedule waste pickups
- Report uncollected trash
- View scheduled pickups
- Responsive UI with modern design

## Prerequisites
Ensure you have the following installed on your Windows system:
- Python 3.x ([Download Here](https://www.python.org/downloads/))
- Git (optional) ([Download Here](https://git-scm.com/downloads))
- Node.js (for frontend development) ([Download Here](https://nodejs.org/))
- Visual Studio Code ([Download Here](https://code.visualstudio.com/))

## Setup Instructions

### 1. Clone or Download the Repository
If you have Git installed, open Command Prompt (CMD) and run:
```sh
 git clone https://github.com/your-repository/trashsync.git
 cd trashsync
```
Otherwise, download and extract the ZIP from GitHub.

### 2. Setup Python Environment
Create and activate a virtual environment:
```sh
 python -m venv venv
 venv\Scripts\activate
```

### 3. Install Dependencies
```sh
 pip install flask flask-cors
```

### 4. Initialize the Database
```sh
 python database.py
```

### 5. Run the Backend Server
```sh
 python server.py
```
The API should now be running on `http://127.0.0.1:5000/`

### 6. Run the Frontend with Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension if you haven’t already.
3. Right-click on `index.html` and select **Open with Live Server**.
4. The frontend should open automatically in your default browser.

## API Endpoints
| Endpoint          | Method | Description |
|------------------|--------|-------------|
| `/`              | GET    | Welcome message |
| `/schedule`      | POST   | Schedule a waste pickup |
| `/pickups`       | GET    | Get all scheduled pickups |
| `/report`        | POST   | Report uncollected trash |
| `/pickup/<id>`   | GET    | Get details of a specific pickup |

## Troubleshooting
- If you see `ModuleNotFoundError`, ensure you activated the virtual environment and installed dependencies.
- If the backend does not start, check for Python installation and correct dependencies.
- If the frontend does not display, ensure **Live Server** is installed and running correctly in VS Code.

## License
This project is open-source and licensed under the MIT License.

