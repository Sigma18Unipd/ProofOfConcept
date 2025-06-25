from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import uuid, boto3, json



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
session = {}



@app.route('/', methods=['GET'])
def debug():
  return json.dumps(list(session.values())), 200


 
@app.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  email = data['email']
  password = data['password']
  if email == "diomerda" and password == "diomerda":
    id = str(uuid.uuid4())
    session[id] = email
    return jsonify({"authToken": id}), 200
  return jsonify({"error": "Invalid credentials"}), 401



@app.route('/checklogin', methods=['POST'])
def checklogin():
  authToken = request.cookies.get('authToken')
  if authToken in session.keys():
    return 200
  return 302



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






# ------------- AI STUFF -------------
def invoke_agent(prompt):
    print(f"Invoking agent with prompt: {prompt}")
    agents_runtime_client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")

    response = agents_runtime_client.invoke_agent(
        agentId="XKFFWBWHGM",
        inputText=prompt,
        agentAliasId="MGRMV9P6PM",
        sessionId="session-1234567890",
    )

    completion = ""
    for event in response.get("completion"):
        chunk = event["chunk"]
        completion = completion + chunk["bytes"].decode()
    return completion




@app.route('/api/prompt', methods=['POST'])
def prompt():
    data = request.get_json()
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        response = invoke_agent(prompt)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ------------- RUN -------------
if __name__ == '__main__':
  app.run(debug=True)