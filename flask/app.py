import os
import psycopg2
from flask_cors import CORS
from flask import Flask, jsonify

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://frontend.localhost"}})

def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port="5432"
    )
    return conn

@app.route('/devices', methods=['GET'])
def get_devices():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, status, type FROM devices;')
    devices = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(devices)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
