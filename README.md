TrashSync - Smart Waste Management

TrashSync is a smart waste management system that allows users to schedule waste pickups, report uncollected trash, and track scheduled pickups.

Features

Schedule waste pickups

Report uncollected trash

View scheduled pickups

Responsive UI with modern design

Prerequisites

Ensure you have the following installed on your Windows system:

Python 3.x (Download Here)

Git (optional) (Download Here)

Node.js (for frontend development) (Download Here)

Visual Studio Code (Download Here)

Setup Instructions

1. Clone or Download the Repository

If you have Git installed, open Command Prompt (CMD) and run:

 git clone https://github.com/your-repository/trashsync.git
 cd trashsync

Otherwise, download and extract the ZIP from GitHub.

2. Setup Python Environment

Create and activate a virtual environment:

 python -m venv venv
 venv\Scripts\activate

3. Install Dependencies

 pip install flask flask-cors

4. Initialize the Database

 python database.py

5. Run the Backend Server

 python server.py

The API should now be running on http://127.0.0.1:5000/

6. Run the Frontend with Live Server

Open the project folder in Visual Studio Code.

Install the Live Server extension if you haven’t already.

Right-click on index.html and select Open with Live Server.

The frontend should open automatically in your default browser.

API Endpoints

Endpoint

Method

Description

/

GET

Welcome message

/schedule

POST

Schedule a waste pickup

/pickups

GET

Get all scheduled pickups

/report

POST

Report uncollected trash

/pickup/<id>

GET

Get details of a specific pickup

Troubleshooting

If you see ModuleNotFoundError, ensure you activated the virtual environment and installed dependencies.

If the backend does not start, check for Python installation and correct dependencies.

If the frontend does not display, ensure Live Server is installed and running correctly in VS Code.

License

This project is open-source and licensed under the MIT License.
