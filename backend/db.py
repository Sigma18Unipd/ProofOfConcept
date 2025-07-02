import sqlite3
import threading

class DatabaseConnection:
    _instance = None
    _lock = threading.Lock()
    _connection = None
    
    def __new__(cls, db_path="data.db"):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, db_path="data.db"):
        if self._connection is None:
            self._connection = sqlite3.connect(db_path, check_same_thread=False)
            self._connection.row_factory = sqlite3.Row
    
    def get_connection(self):
        return self._connection
    
    def execute(self, query, params=()):
        cursor = self._connection.cursor() # type: ignore
        cursor.execute(query, params)
        self._connection.commit() # type: ignore
        return cursor
    
    def fetchone(self, query, params=()):
        cursor = self._connection.cursor() # type: ignore
        cursor.execute(query, params)
        return cursor.fetchone()
    
    def fetchall(self, query, params=()):
        cursor = self._connection.cursor() # type: ignore
        cursor.execute(query, params)
        return cursor.fetchall()
    
    def close(self):
        if self._connection:
            self._connection.close()
            self._connection = None

def get_db(db_path="data.db"):
    return DatabaseConnection(db_path)