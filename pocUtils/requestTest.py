from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import uuid
import json
from llmQuery import process_prompt
import sqlite3



app = Flask(__name__)
cors = CORS(app, supports_credentials=True, origins='*')
app.config['CORS_HEADERS'] = 'Content-Type'
session = {}



@app.route('/', methods=['GET'])
def debug():
  return jsonify({"session": list(session.keys())}), 200



@cross_origin()
@app.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  email = data['email'].lower()
  password = data['password']
  con = sqlite3.connect("data.db")
  cur = con.cursor()
  cur.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
  user = cur.fetchone()
  con.close()
  if user:
    id = str(uuid.uuid4()) + email
    session[id] = email
    return jsonify({"authToken": id}), 200
  return jsonify({"error": "login error"}), 401




@cross_origin()
@app.route('/register', methods=['POST'])
def register():
  data = request.get_json()
  email = data['email'].lower()
  password = data['password']
  con = sqlite3.connect("data.db")
  cur = con.cursor()
  cur.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
  con.commit()
  con.close()
  id = str(uuid.uuid4()) + email
  session[id] = email
  return jsonify({"authToken": id}), 200



@cross_origin()
@app.route('/api/verifyToken', methods=['POST'])
def checklogin():
  authToken = request.cookies.get('authToken')
  if authToken in session:
    return jsonify({"success": True}), 200
  return jsonify({"error": "Token non valido"}), 401



@cross_origin()
@app.route('/logout', methods=['POST'])
def logout():
  authToken = request.cookies.get('authToken')
  if authToken in session:
    session.pop(authToken, None)
  response = make_response("ok", 200)
  response.delete_cookie('authToken', path='/')
  return response



@cross_origin
@app.route('/api/flows', methods=['POST'])
def get_workflows():
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  con = sqlite3.connect("data.db")
  cur = con.cursor()
  con.commit()
  flows = cur.execute("SELECT * FROM workflows WHERE clientEmail = ?", (clientEmail,)).fetchall()
  con.close()
  flows = [dict(zip(['id', 'clientEmail', 'name', 'contents'], row)) for row in flows]
  print(flows)
  return jsonify({"workflows": flows}), 200



@cross_origin
@app.route('/api/flows/<id>', methods=['POST'])
def get_workflow_by_id(id):
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  con = sqlite3.connect("data.db")
  cur = con.cursor()
  con.commit()
  flow = cur.execute("SELECT * FROM workflows WHERE id = ?", (id)).fetchone()
  con.close()
  if not flow or flow[1] != clientEmail:
    return jsonify({"error": "Workflow not found or does not belong to the client"}), 404
  flow = dict(zip(['id', 'clientEmail', 'name', 'contents'], flow))
  return jsonify({"workflow": flow}), 200



@cross_origin
@app.route('/api/flows/prompt', methods=['POST'])
def ai_flow():
  data = request.get_json()
  prompt = data.get('prompt', '')
  if not prompt:
    return jsonify({"error": "Prompt is required"}), 400
  try:
    response = process_prompt(prompt)
    return jsonify(response), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500



@app.route('/api/prompt', methods=['POST'])
def prompt():
  data = request.get_json()
  prompt = data.get('prompt', '')
  if not prompt:
    return jsonify({"error": "Prompt is required"}), 400
  try:
    response = process_prompt(prompt)
    return jsonify({"response": response}), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500



# ------------- RUN -------------
if __name__ == '__main__':
  app.run(debug=True)