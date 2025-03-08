import sqlite3

def init_db():
    conn = sqlite3.connect('trashsync.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS pickups (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        user TEXT, 
                        location TEXT, 
                        date TEXT, 
                        status TEXT DEFAULT 'Pending')''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS cleaners (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        name TEXT, 
                        contact TEXT, 
                        status TEXT DEFAULT 'Available')''')
    conn.commit()
    conn.close()

init_db()
print("Database initialized successfully.")
