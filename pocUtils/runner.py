import json
from typing import Dict, Callable, Any, List
from flask import Flask, request, jsonify, make_response
import time
import requests
from collections import deque


_workflow_handlers: Dict[str, Callable] = {}


def register_handler(workflow_type: str):
    """Decorator to register handlers for specific workflow types"""
    def decorator(func: Callable):
        _workflow_handlers[workflow_type] = func
        return func
    return decorator







def run(workflow_data):
    nodes = workflow_data.get("nodes", [])
    edges = workflow_data.get("edges", [])
    execution_order = get_execution_order(nodes, edges)
    
    
    
    
    results = {}
    for node_id in execution_order:
        node = next((n for n in nodes if n["id"] == node_id), None)
        if not node:
            continue
            
        node_type = node.get("type")
        node_data = node.get("data", {})
        
        # Create workflow item for the node
        workflow_item = {
            "type": node_type,
            "id": node_id,
            **node_data
        }
        
        print(f"Executing node {node_id} of type {node_type}")
        
        # Execute the node
        handler = _workflow_handlers.get(node_type)
        if handler:
            result = handler(workflow_item)
            results[node_id] = result
        else:
            print(f"Warning: No handler registered for node type: {node_type}")
            results[node_id] = {"status": "skipped", "type": node_type}
    return results

def get_execution_order(nodes: List[Dict], edges: List[Dict]) -> List[str]:
    """Determine the execution order of nodes based on edges"""
    
    graph = {}
    in_degree = {}
    
    # Initialize graph and in-degree for all nodes
    for node in nodes:
        node_id = node["id"]
        graph[node_id] = []
        in_degree[node_id] = 0
    
    # Build the graph and calculate in-degrees
    for edge in edges:
        source = edge["source"]
        target = edge["target"]
        if source in graph and target in graph:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Use deque for better performance and sort nodes with 0 in-degree for consistency
    queue = deque(sorted([node_id for node_id in in_degree if in_degree[node_id] == 0]))
    execution_order = []
    
    while queue:
        current = queue.popleft()
        execution_order.append(current)
        
        # Get neighbors and sort them for consistent ordering
        neighbors = sorted(graph[current])
        for neighbor in neighbors:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycles
    if len(execution_order) != len(nodes):
        raise ValueError("Cycle detected in workflow graph")
    
    return execution_order






@register_handler("systemWaitSeconds")
def handle_data_processing(workflow_data):
    seconds = int(workflow_data.get("seconds", 0))
    print(f"Waiting for {seconds} seconds...")
    time.sleep(seconds)
    return {"status": "completed", "type": "systemWaitSeconds", "waited": seconds}



@register_handler("telegramSendBotMessage")
def handle_data_processing(workflow_data):
    botToken = workflow_data.get("botToken", "")
    chatId = workflow_data.get("chatId", "")
    message = workflow_data.get("message", "")
    print(f"Sending message to Telegram bot {botToken} in chat {chatId}: {message}")
    url = f'https://api.telegram.org/bot{botToken}/sendMessage'
    payload = {
        'chat_id': chatId,
        'text': message
    }
    response = requests.post(url, data=payload)
    print(f"Telegram response: {response.status_code} - {response.text}")
    return {"status": "completed", "type": "telegramSendBotMessage", "response": response.json()}