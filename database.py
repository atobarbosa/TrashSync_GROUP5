import sqlite3
import os

def init_db():
    # Check if database already exists
    db_exists = os.path.exists('trashsync.db')
    
    conn = sqlite3.connect('trashsync.db')
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
    
    # Check if we already have sample data
    cursor.execute("SELECT COUNT(*) FROM cleaners")
    cleaner_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM pickups")
    pickup_count = cursor.fetchone()[0]
    
    # Add sample cleaners if table is empty
    if cleaner_count == 0:
        # Sample cleaner data
        sample_cleaners = [
            ("AJ Pogi", "+639478696945", "Available"),
            ("MJ Cruz", "+639667527860", "Available"),
            ("Matt Viernes", "+639560172918", "Busy"),
            ("Gian Villaceran", "+639690252075", "Busy")
        ]
        
        cursor.executemany(
            "INSERT INTO cleaners (name, contact, status) VALUES (?, ?, ?)",
            sample_cleaners
        )
        print("Added sample cleaners to database.")
    
    # Add sample pickup if table is empty
    if pickup_count == 0:
        # Sample pickup data
        cursor.execute(
            "INSERT INTO pickups (user, location, date, status) VALUES (?, ?, ?, ?)",
            ("John Doe", "123 Main St, Anytown", "2025-03-15", "Scheduled")
        )
        print("Added sample pickup to database.")
    
    conn.commit()
    conn.close()
    
    if not db_exists:
        print("Database created successfully.")
    else:
        print("Database already exists, tables verified.")

if __name__ == "__main__":
    init_db()
    print("Database initialization complete.")