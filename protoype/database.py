import sqlite3

def init_db():
    conn = sqlite3.connect('trashsync.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS pickups (
                        id INTEGER PRIMARY KEY, 
                        user TEXT, 
                        date TEXT)''')
    conn.commit()
    conn.close()
