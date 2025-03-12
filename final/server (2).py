from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('trashsync.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to TrashSync API"})

@app.route('/schedule', methods=['POST'])
def schedule_pickup():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['user', 'location', 'date']):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert pickup into database
        cursor.execute(
            "INSERT INTO pickups (user, location, date, status) VALUES (?, ?, ?, ?)",
            (data['user'], data['location'], data['date'], "Scheduled")
        )
        
        # Get the ID of the new pickup
        pickup_id = cursor.lastrowid
        
        conn.commit()
        
        # Create pickup response
        pickup = {
            "id": pickup_id,
            "user": data['user'],
            "location": data['location'],
            "date": data['date'],
            "status": "Scheduled"
        }
        
        return jsonify({
            "message": "Pickup scheduled successfully!", 
            "pickup": pickup
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/pickups', methods=['GET'])
def get_pickups():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all pickups from database
        cursor.execute("SELECT * FROM pickups ORDER BY date DESC")
        rows = cursor.fetchall()
        
        # Convert rows to list of dictionaries
        pickups = []
        for row in rows:
            pickup = dict(row)
            pickups.append(pickup)
        
        return jsonify(pickups)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/report', methods=['POST'])
def report_pickup():
    data = request.json
    
    # Validate input
    if 'id' not in data:
        return jsonify({"error": "Pickup ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update pickup status
        cursor.execute(
            "UPDATE pickups SET status = ? WHERE id = ?",
            ("Uncollected", data['id'])
        )
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Pickup ID not found"}), 404
        
        conn.commit()
        
        # Get updated pickup
        cursor.execute("SELECT * FROM pickups WHERE id = ?", (data['id'],))
        pickup = dict(cursor.fetchone())
        
        return jsonify({
            "message": "Pickup status updated to Uncollected",
            "pickup": pickup
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/pickup/<int:pickup_id>', methods=['GET'])
def get_pickup(pickup_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM pickups WHERE id = ?", (pickup_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "Pickup not found"}), 404
        
        pickup = dict(row)
        return jsonify(pickup)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# Routes for cleaner management

@app.route('/cleaners', methods=['GET'])
def get_cleaners():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all active cleaners from database
        cursor.execute("SELECT * FROM cleaners WHERE status IN ('Available', 'Busy')")
        rows = cursor.fetchall()
        
        # Convert rows to list of dictionaries
        cleaners = []
        for row in rows:
            cleaner = dict(row)
            
            # Add additional fields for compatibility with frontend
            # In a real app, these would be in separate tables with proper relationships
            if "services" not in cleaner:
                cleaner["services"] = ["Residential", "Commercial"]
            if "rating" not in cleaner:
                cleaner["rating"] = 4.5
            
            cleaners.append(cleaner)
        
        return jsonify(cleaners)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/hire-cleaner', methods=['POST'])
def hire_cleaner():
    data = request.json
    
    # Validate required fields
    required_fields = ['cleaningType', 'location', 'dateTime', 'contactName', 'contactPhone']
    if not all(key in data for key in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get first available cleaner
        cursor.execute("SELECT id FROM cleaners WHERE status = 'Available' LIMIT 1")
        available_cleaner = cursor.fetchone()
        
        status = "Pending"
        cleaner_id = None
        
        if available_cleaner:
            cleaner_id = available_cleaner['id']
            status = "Assigned"
            
            # Update cleaner status to busy
            cursor.execute("UPDATE cleaners SET status = 'Busy' WHERE id = ?", (cleaner_id,))
        
        # In a real app, we would store this in a cleaning_requests table
        # For simplicity, we'll just return the data for now
        request_data = {
            "id": datetime.datetime.now().timestamp(),  # Using timestamp as ID
            "type": data['cleaningType'],
            "location": data['location'],
            "dateTime": data['dateTime'],
            "details": data.get('details', ''),
            "contactName": data['contactName'],
            "contactPhone": data['contactPhone'],
            "status": status,
            "created_at": datetime.datetime.now().isoformat()
        }
        
        if cleaner_id:
            request_data["assigned_cleaner_id"] = cleaner_id
        
        conn.commit()
        
        return jsonify({
            "message": "Cleaning request submitted successfully!",
            "request": request_data
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/cleaner/<int:cleaner_id>', methods=['GET'])
def get_cleaner(cleaner_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM cleaners WHERE id = ?", (cleaner_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "Cleaner not found"}), 404
        
        cleaner = dict(row)
        
        # Add additional fields for compatibility with frontend
        if "services" not in cleaner:
            cleaner["services"] = ["Residential", "Commercial"]
        if "rating" not in cleaner:
            cleaner["rating"] = 4.5
        
        return jsonify(cleaner)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    # Initialize database with sample data
    from database import init_db
    
    # Initialize the database
    init_db()
    
    print("Database initialized successfully!")
    app.run(debug=True)