import os
from urllib import request
import psycopg2
from flask_cors import CORS
from flask import Flask, jsonify, request

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
    cur.execute('SELECT id, name, status, type FROM devices ORDER BY id;')
    devices = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(devices)

@app.route('/devices/<int:device_id>/toggle', methods=['POST'])
def toggle_device(device_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Prendo lo stato attuale
    cur.execute('SELECT status FROM devices WHERE id = %s;', (device_id,))
    result = cur.fetchone()
    if not result:
        cur.close()
        conn.close()
        return jsonify({'error': 'Device not found'}), 404

    current_status = result[0]
    new_status = 'offline' if current_status == 'online' else 'online'

    # Aggiorno lo stato
    cur.execute(
        'UPDATE devices SET status = %s WHERE id = %s;',
        (new_status, device_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'device_id': device_id, 'new_status': new_status})

@app.route('/devices', methods=['POST'])
def create_device():
    data = request.get_json()

    name = data.get('name')
    status = data.get('status', 'offline')  # default offline
    type_ = data.get('type')

    if not name:
        return jsonify({'error': 'Il nome del dispositivo è obbligatorio'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO devices (name, status, type) VALUES (%s, %s, %s) RETURNING id;',
        (name, status, type_)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'id': new_id, 'name': name, 'status': status, 'type': type_}), 201

@app.route('/devices/<int:device_id>', methods=['DELETE'])
def delete_device(device_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('DELETE FROM devices WHERE id = %s;', (device_id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({'message': f'Dispositivo {device_id} eliminato'}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
