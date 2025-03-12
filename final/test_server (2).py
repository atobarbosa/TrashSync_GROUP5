import pytest
import json
import os
import sqlite3
from server import app

@pytest.fixture
def client():
    # Set up a test database
    if os.path.exists('test_trashsync.db'):
        os.remove('test_trashsync.db')
    
    # Create test database
    conn = sqlite3.connect('test_trashsync.db')
    cursor = conn.cursor()
    
    # Create pickups table
    cursor.execute('''CREATE TABLE IF NOT EXISTS pickups (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        user TEXT, 
                        location TEXT, 
                        date TEXT, 
                        status TEXT DEFAULT 'Pending')''')
    
    # Create cleaners table
    cursor.execute('''CREATE TABLE IF NOT EXISTS cleaners (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        name TEXT, 
                        contact TEXT, 
                        status TEXT DEFAULT 'Available')''')
    
    # Add a test cleaner
    cursor.execute(
        "INSERT INTO cleaners (name, contact, status) VALUES (?, ?, ?)",
        ("Test Cleaner", "+1-555-TEST", "Available")
    )
    
    conn.commit()
    conn.close()
    
    # Configure Flask app for testing
    app.config['TESTING'] = True
    app.config['DATABASE'] = 'test_trashsync.db'
    
    with app.test_client() as client:
        yield client
    
    # Clean up test database
    if os.path.exists('test_trashsync.db'):
        os.remove('test_trashsync.db')

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.get_json()["message"] == "Welcome to TrashSync API"

def test_schedule_pickup(client):
    data = {
        "user": "Test User",
        "location": "Test Location",
        "date": "2025-02-27"
    }
    response = client.post('/schedule', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    response_data = response.get_json()
    assert "message" in response_data
    assert "pickup" in response_data
    assert response_data["message"] == "Pickup scheduled successfully!"
    assert response_data["pickup"]["user"] == "Test User"

def test_get_pickups(client):
    # First add a pickup
    data = {
        "user": "Test User",
        "location": "Test Location",
        "date": "2025-02-27"
    }
    client.post('/schedule', data=json.dumps(data), content_type='application/json')
    
    # Then get all pickups
    response = client.get('/pickups')
    assert response.status_code == 200
    pickups = response.get_json()
    assert len(pickups) >= 1
    assert pickups[0]["user"] == "Test User"

def test_report_pickup(client):
    # First add a pickup
    data = {
        "user": "Test User",
        "location": "Test Location",
        "date": "2025-02-27"
    }
    response = client.post('/schedule', data=json.dumps(data), content_type='application/json')
    pickup_id = response.get_json()["pickup"]["id"]
    
    # Then report it
    report_data = {"id": pickup_id}
    response = client.post('/report', data=json.dumps(report_data), content_type='application/json')
    assert response.status_code == 200
    response_data = response.get_json()
    assert "message" in response_data
    assert "pickup" in response_data
    assert response_data["pickup"]["status"] == "Uncollected"

def test_cleaners(client):
    response = client.get('/cleaners')
    assert response.status_code == 200
    cleaners = response.get_json()
    assert len(cleaners) >= 1
    assert cleaners[0]["name"] == "Test Cleaner"