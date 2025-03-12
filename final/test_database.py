import sqlite3

def test_database():
    print("Testing database connection...")
    try:
        # Connect to the database
        conn = sqlite3.connect('trashsync.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Test pickups table
        print("\nChecking pickups table:")
        cursor.execute("SELECT * FROM pickups")
        pickups = cursor.fetchall()
        print(f"Found {len(pickups)} pickups")
        
        for pickup in pickups:
            print(f"ID: {pickup['id']}, User: {pickup['user']}, Location: {pickup['location']}, Date: {pickup['date']}, Status: {pickup['status']}")
        
        # Test cleaners table
        print("\nChecking cleaners table:")
        cursor.execute("SELECT * FROM cleaners")
        cleaners = cursor.fetchall()
        print(f"Found {len(cleaners)} cleaners")
        
        for cleaner in cleaners:
            print(f"ID: {cleaner['id']}, Name: {cleaner['name']}, Contact: {cleaner['contact']}, Status: {cleaner['status']}")
        
        conn.close()
        print("\nDatabase test completed successfully.")
        return True
    except Exception as e:
        print(f"Database test failed: {e}")
        return False

if __name__ == "__main__":
    test_database()