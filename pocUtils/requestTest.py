from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

 

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



if __name__ == '__main__':
  app.run(debug=True)