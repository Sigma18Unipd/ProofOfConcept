import boto3
from typing import Any, Callable, Dict, List
import json
import uuid

def invoke_agent(prompt):
    print(f"Invoking agent with prompt: {prompt}")
    agents_runtime_client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")

    response = agents_runtime_client.invoke_agent(
        agentId="XKFFWBWHGM",
        inputText=prompt,
        agentAliasId="ZJEFSE80VZ",
        sessionId=f"session-{uuid.uuid4()}",
    )

    completion = ""
    for event in response.get("completion"):
        chunk = event["chunk"]
        completion = completion + chunk["bytes"].decode()
    return completion

_SANITIZERS: Dict[str, List[Callable[[Dict[str, Any]], Dict[str, Any]]]] = {}
_PRE_SAN = []

def register_sanitizer(*node_types: str):
    """Decorator to register a sanitizer for one or more node types."""
    def decorator(fn: Callable[[Dict[str, Any]], Dict[str, Any]]):
        for node_type in node_types:
            if node_type not in _SANITIZERS:
                _SANITIZERS[node_type] = []
            _SANITIZERS[node_type].append(fn)
        return fn
    return decorator

def reg_pre_san():
    """Decorator to register a pre-sanitizer."""
    def decorator(fn):
        _PRE_SAN.append(fn)
        return fn
    return decorator

def add_json(data, key, value):
    if key not in data:
        data[key] = value

_id_counter=0
_position_counter=[0, 0]  

def add_field_if_missing(data, field, value=""):
    match field:
        case "id":
            if value == "":
                global _id_counter  
                _id_counter += 1 
                add_json(data, "id", f"node-{_id_counter}")
            else:
                add_json(data, "id", value)
        case "type":
            add_json(data, "type", "systemWaitSeconds" if value == "" else value)
        case "position":
            global _position_counter
            _position_counter[0] += 400  
            if _position_counter[0] > 800:
                _position_counter[0] = 0
                _position_counter[1] += 400  
            add_json(data, "position", {"x": _position_counter[0], "y": _position_counter[1]})
        case "data":
            add_json(data, "data", {})
        case _:
            add_json(data, field, value)

@reg_pre_san()
def check_basic_fields(data):
    required_fields = ["id", "type", "data", "position"]
    for field in required_fields:
        add_field_if_missing(data, field)
    return data





@register_sanitizer("telegramSendBotMessage")
def telegram_send_bot_message_sanitizer(data: Dict[str, Any]) -> Dict[str, Any]:
    add_field_if_missing(data, "botToken")
    add_field_if_missing(data, "chatId")
    add_field_if_missing(data, "message")
    return data

@register_sanitizer("systemWaitSeconds")
def wait_seconds_sanitizer(data: Dict[str, Any]) -> Dict[str, Any]:
    add_field_if_missing(data, "seconds", "10")
    return data








def sanitize_node(node: Dict[str, Any]) -> Dict[str, Any]:
    node_type = node.get("type")
    if node_type in _SANITIZERS:
        data = node.get("data", {})
        for sanitizer in _SANITIZERS[node_type]:
            data = sanitizer(data)
        node["data"] = data
    return node

def run_pre_sanitizers(flow: Dict[str, Any]) -> Dict[str, Any]:
    for pre_sanitizer in _PRE_SAN:
        flow = pre_sanitizer(flow)
    return flow

def sanitize_response(flow: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(flow, dict):
        return {}
    flow["nodes"] = [run_pre_sanitizers(n) for n in flow.get("nodes", [])]
    flow["nodes"] = [sanitize_node(n) for n in flow.get("nodes", [])]
    return flow


def process_prompt(query):
    raw = invoke_agent(query)
    try:
        flow = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return sanitize_response(flow)

if __name__ == "__main__":
    # 1) get raw JSON string from the agent
    raw = invoke_agent("crea un workflow che invia un messaggio telegram usando il bot sigma18")
    # Print raw JSON from agent in yellow color
    print(f"\033[93mRaw JSON from agent:\033[0m {raw}")
    flow = json.loads(raw)
    # 3) sanitize every node
    clean_flow = sanitize_response(flow)
    # 4) now you can safely use clean_flow
    print("\033[92mSanitized text:\033[0m")
    print(json.dumps(clean_flow, indent=2))