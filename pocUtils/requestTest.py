from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import uuid
import json
from llmQuery import process_prompt
from db import get_db


app = Flask(__name__)
cors = CORS(app, supports_credentials=True, origins='*')
app.config['CORS_HEADERS'] = 'Content-Type'
session = {}

db = get_db("data.db")


@app.route('/', methods=['GET'])
def debug():
  return jsonify({"session": list(session.keys())}), 200



@cross_origin()
@app.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  email = data['email']
  password = data['password']
  user = db.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
  if user:
    id = str(uuid.uuid4()) + email
    session[id] = email
    return jsonify({"authToken": id}), 200
  return jsonify({"error": "login error"}), 401




@cross_origin()
@app.route('/register', methods=['POST'])
def register():
  data = request.get_json()
  email = data['email']
  password = data['password']
  db.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
  id = str(uuid.uuid4()) + email
  session[id] = email
  return jsonify({"authToken": id}), 200



@cross_origin()
@app.route('/verifyToken', methods=['POST'])
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
@app.route('/api/flows', methods=['GET'])
def get_workflows():
  flows = db.fetchall("SELECT * FROM workflows")
  return jsonify({"workfows": flows}), 200

@cross_origin
@app.route('/api/flows/prompt', methods=['POST'])
def ai_flow():
  data = request.get_json()
  prompt = data.get('prompt', '')
  if not prompt:
    return jsonify({"error": "Prompt is required"}), 400
  try:
    response = process_prompt(prompt)
    save_new_flow(data.get('name', 'New Flow'), data.get('description', ''), response)
    return jsonify({"success": True}), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

def save_new_flow(name, description, contents):
    db.execute("INSERT INTO workflows (name, description, contents) VALUES (?, ?, ?)",
               (name, description, json.dumps(contents)))


@cross_origin()
@app.route('/api', methods=['POST'])
def test():
  nodes = [
    {
      "id": "node-1",
      "type": "simpleNode",
      "position": {"x": 0, "y": 0},
      "data": {"title": "Nodo1", "apiKey": "ASD)_(#*()#$%&"}
    },
    {
      "id": "node-2",
      "type": "simpleNode",
      "position": {"x": 400, "y": 0},
      "data": {"title": "Nodo2", "apiKey": "OPENAI_API_KEY"}
    },
    {
      "id": "node-3",
      "type": "simpleNode",
      "position": {"x": 400, "y": 200},
      "data": {"title": "Nodo3", "apiKey": "ANOTHER_PIETROCROTTIAI_KEY"}
    }
  ]
  edges = [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
    },
    {
      "id": "edge-2",
      "source": "node-2",
      "target": "node-3",
    }
  ]
  return jsonify({"nodes": nodes, "edges": edges}), 200



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