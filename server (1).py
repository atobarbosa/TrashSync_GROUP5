from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data storage 
pickups = []  

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to TrashSync API"})

@app.route('/schedule', methods=['POST'])
def schedule_pickup():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['user', 'location', 'date']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create pickup with additional metadata
    pickup = {
        "id": len(pickups) + 1,
        "user": data['user'],
        "location": data['location'],
        "date": data['date'],
        "status": "Scheduled",
        "created_at": datetime.datetime.now().isoformat(),
        "updated_at": datetime.datetime.now().isoformat()
    }
    pickups.append(pickup)
    
    return jsonify({
        "message": "Pickup scheduled successfully!", 
        "pickup": pickup
    }), 201


@app.route('/pickups', methods=['GET'])
def get_pickups():
    # Sort pickups by date (newest first)
    sorted_pickups = sorted(pickups, key=lambda x: x.get('date', ''), reverse=True)
    return jsonify(sorted_pickups)


@app.route('/report', methods=['POST'])
def report_pickup():
    data = request.json
    
    # Validate input
    if 'id' not in data:
        return jsonify({"error": "Pickup ID is required"}), 400
    
    pickup_id = data["id"]
    for pickup in pickups:
        if pickup["id"] == pickup_id:
            pickup["status"] = "Uncollected"
            pickup["updated_at"] = datetime.datetime.now().isoformat()
            pickup["reported_at"] = datetime.datetime.now().isoformat()
            return jsonify({
                "message": "Pickup status updated to Uncollected",
                "pickup": pickup
            })
    
    return jsonify({"error": "Pickup ID not found"}), 404


@app.route('/pickup/<int:pickup_id>', methods=['GET'])
def get_pickup(pickup_id):
    for pickup in pickups:
        if pickup["id"] == pickup_id:
            return jsonify(pickup)
    return jsonify({"error": "Pickup not found"}), 404


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    # Add some sample data
    pickups.append({
        "id": 1,
        "user": "John Doe",
        "location": "123 Main St, Anytown",
        "date": "2025-03-15",
        "status": "Scheduled",
        "created_at": datetime.datetime.now().isoformat(),
        "updated_at": datetime.datetime.now().isoformat()
    })
    
    app.run(debug=True)