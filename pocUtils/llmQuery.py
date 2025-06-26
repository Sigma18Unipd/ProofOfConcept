import boto3
from typing import Any, Callable, Dict
import json
import uuid

def invoke_agent(prompt):
    print(f"Invoking agent with prompt: {prompt}")
    agents_runtime_client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")

    response = agents_runtime_client.invoke_agent(
        agentId="XKFFWBWHGM",
        inputText=prompt,
        agentAliasId="13RCNRM4RF",
        sessionId=f"session-{uuid.uuid4()}",
    )

    completion = ""
    for event in response.get("completion"):
        chunk = event["chunk"]
        completion = completion + chunk["bytes"].decode()
    return completion


# handlers are registered here
_SANITIZERS: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {}

def register_sanitizer(node_type: str):
    """Decorator to register a sanitizer for a given node type."""
    def decorator(fn: Callable[[Dict[str, Any]], Dict[str, Any]]):
        _SANITIZERS[node_type] = fn
        return fn
    return decorator


@register_sanitizer("telegram-sendMessageFromBot")
def api_key_filler(data: Dict[str, Any]) -> Dict[str, Any]:
    sanitized = dict(data)
    sanitized["apiKey"] = ""
    return sanitized


def sanitize_node(node: Dict[str, Any]) -> Dict[str, Any]:
    node_type = node.get("type")
    if node_type not in _SANITIZERS:
        raise KeyError(f"No sanitizer registered for node type {node_type!r}")
    sanitized_data = _SANITIZERS[node_type](node.get("data", {}))
    # return a new node dict with sanitized data
    return { **node, "data": sanitized_data }

def sanitize_flow(flow: Dict[str, Any]) -> Dict[str, Any]:
    """
    Walks through all nodes in the flow JSON and sanitizes them.
    """
    flow_copy = dict(flow)
    flow_copy["nodes"] = [sanitize_node(n) for n in flow.get("nodes", [])]
    return flow_copy

if __name__ == "__main__":
    # 1) get raw JSON string from the agent
    raw = invoke_agent("crea un workflow che invia un messaggio telegram usando il bot sigma18")
    # Print raw JSON from agent in yellow color
    print(f"\033[93mRaw JSON from agent:\033[0m {raw}")
    flow = json.loads(raw)
    # 3) sanitize every node
    clean_flow = sanitize_flow(flow)
    # 4) now you can safely use clean_flow
    print("\033[92mSanitized text:\033[0m")
    print(json.dumps(clean_flow, indent=2))