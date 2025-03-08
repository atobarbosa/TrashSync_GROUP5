import pytest
import json
from server import app

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.get_json() == {"message": "Welcome to TrashSync API"}

def test_schedule_pickup(client):
    data = {
        "user": "Test User",
        "location": "Test Location",
        "date": "2025-02-27"
    }
    response = client.post('/schedule', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    assert response.get_json() == {"message": "Pickup Scheduled"}

def test_get_pickups(client):
    response = client.get('/pickups')
    assert response.status_code == 200

def test_report_trash(client):
    data = {"id": 1}  # Make sure a pickup exists with ID 1 before testing
    response = client.post('/report', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 200
    assert response.get_json() == {"message": "Trash Reported"}
