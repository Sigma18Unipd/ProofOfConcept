from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import uuid
from llmQuery import process_prompt
from db import get_db
import runner
import json


db = get_db("data.db")
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
  user = db.fetchone("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
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
  db.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
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
  flows = db.fetchall("SELECT id, clientEmail, name FROM workflows WHERE clientEmail = ?", (clientEmail,))
  flows = [dict(zip(['id', 'clientEmail', 'name'], row)) for row in flows]
  print(flows)
  return jsonify({"workflows": flows}), 200



@cross_origin
@app.route('/api/flows/<id>', methods=['POST'])
def get_workflow_by_id(id):
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  flow = db.fetchone("SELECT * FROM workflows WHERE id = ?", (id, ))
  if not flow or flow[1] != clientEmail:
    return jsonify({"error": "Workflow not found or does not belong to the client"}), 404
  flow = dict(zip(['id', 'clientEmail', 'name', 'contents'], flow))
  return jsonify({"workflow": flow}), 200



@cross_origin
@app.route('/api/flows/<id>/save', methods=['POST'])
def save_workflow(id):
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  data = request.get_json()
  name = data.get('name', '')
  contents = data.get('contents', {})
  print(f"id: {id}, clientEmail: {clientEmail}, name: {name}, contents: {contents}")
  if not clientEmail:
    return jsonify({"error": "Unauthorized"}), 401
  if not name:
    return jsonify({"error": "Missing name field"}), 400 # va ben anca se no ghe xe el nome
  if isinstance(contents, str):
    contents_str = contents
  else:
    contents_str = json.dumps(contents)
  try:
    db.execute("INSERT OR REPLACE INTO workflows (id, clientEmail, name, contents) VALUES (?, ?, ?, ?)",
             (id, clientEmail, name, contents_str))
  except Exception as e:
    print(f"Error saving workflow: {e}")
    return jsonify({"error": str(e)}), 500
  return jsonify({"message": "Workflow saved successfully"}), 200



@cross_origin
@app.route('/api/flows/<id>/delete', methods=['DELETE'])
def delete_workflow(id):
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  flow = db.fetchone("SELECT * FROM workflows WHERE id = ?", (id,))
  if not flow: 
    return jsonify({"error": "Workflow not found or does not belong to the client"}), 404
  if flow[1] != clientEmail:
    return jsonify({"error": "Unauthorized"}), 403
  try: 
    db.execute("DELETE FROM workflows WHERE id = ?", (id,))
    return jsonify({"message": "Workflow deleted successfully"}), 200
  except Exception as e:
    print(f"Error deleting workflow: {e}")
    return jsonify({"error": str(e)}), 500
  
  
  
@cross_origin
@app.route('/api/flows/<id>/run', methods=['POST'])
def run_workflow(id):
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  flow = db.fetchone("SELECT * FROM workflows WHERE id = ?", (id,))
  print(f"Running workflow with id: {id}, clientEmail: {clientEmail}")
  contents = json.loads(flow[3]) if flow[3] else {}
  try:
    return runner.run(contents)
  except Exception as e:
    print(f"Error running workflow: {e}")
    return jsonify({"error": str(e)}), 500




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
    print(f"Error processing prompt: {e}")
    return jsonify({"error": str(e)}), 500



@cross_origin
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
  
  
  
@cross_origin
@app.route('/api/new', methods=['POST'])
def new_workflow():
  authToken = request.cookies.get('authToken')
  clientEmail = session.get(authToken)
  data = request.get_json()
  name = data.get('name', '')
  if not name:
    return jsonify({"error": "Routine name is required"}), 400
  if not clientEmail:
    return jsonify({"error": "Unauthorized"}), 401
  new_id = str(uuid.uuid4())
  try:
    db.execute("INSERT INTO workflows (id, clientEmail, name, contents) VALUES (?, ?, ?, ?)",
             (new_id, clientEmail, name, '{}'))
    return jsonify({"id": new_id}), 200
  except Exception as e:
    print(f"Error creating new workflow: {e}")
    return jsonify({"error": str(e)}), 500



# ------------- RUN -------------
if __name__ == '__main__':
  app.run(debug=True)