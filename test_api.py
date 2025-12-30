#!/usr/bin/env python3
"""
Test script for Pastebin-Lite API
Tests the core functionality with clear output
"""

import requests
import json
import time

BASE_URL = "http://localhost:3000"

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/api/healthz", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_create_paste():
    """Test creating a paste"""
    print("\n=== Testing Create Paste ===")
    try:
        payload = {
            "content": "Hello World! This is test content.",
            "ttl_seconds": 120,
            "max_views": 3
        }
        response = requests.post(f"{BASE_URL}/api/pastes", json=payload, timeout=5)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 201 and "id" in data:
            return data["id"]
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_fetch_paste(paste_id):
    """Test fetching a paste"""
    print(f"\n=== Testing Fetch Paste (ID: {paste_id}) ===")
    try:
        response = requests.get(f"{BASE_URL}/api/pastes/{paste_id}", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_view_count_limit():
    """Test view count limit"""
    print("\n=== Testing View Count Limit (max_views=2) ===")
    try:
        # Create paste with max_views=2
        payload = {
            "content": "Limited view test content",
            "max_views": 2
        }
        response = requests.post(f"{BASE_URL}/api/pastes", json=payload, timeout=5)
        if response.status_code != 201:
            print("Failed to create paste")
            return False
        
        paste_id = response.json()["id"]
        print(f"Created paste: {paste_id}")
        
        # First fetch (view 1/2)
        response = requests.get(f"{BASE_URL}/api/pastes/{paste_id}", timeout=5)
        print(f"Fetch 1: Status {response.status_code}, Remaining: {response.json().get('remaining_views')}")
        
        # Second fetch (view 2/2)
        response = requests.get(f"{BASE_URL}/api/pastes/{paste_id}", timeout=5)
        print(f"Fetch 2: Status {response.status_code}, Remaining: {response.json().get('remaining_views')}")
        
        # Third fetch (should fail)
        response = requests.get(f"{BASE_URL}/api/pastes/{paste_id}", timeout=5)
        print(f"Fetch 3: Status {response.status_code} (should be 404)")
        
        return response.status_code == 404
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_validation_errors():
    """Test input validation"""
    print("\n=== Testing Input Validation ===")
    
    # Missing content
    print("\nTest: Missing content")
    response = requests.post(f"{BASE_URL}/api/pastes", json={"ttl_seconds": 100}, timeout=5)
    print(f"Status: {response.status_code} (should be 400)")
    print(f"Response: {response.json()}")
    
    # Invalid ttl_seconds (< 1)
    print("\nTest: Invalid ttl_seconds (0)")
    response = requests.post(f"{BASE_URL}/api/pastes", json={"content": "test", "ttl_seconds": 0}, timeout=5)
    print(f"Status: {response.status_code} (should be 400)")
    print(f"Response: {response.json()}")
    
    # Invalid max_views (not integer)
    print("\nTest: Invalid max_views (string)")
    response = requests.post(f"{BASE_URL}/api/pastes", json={"content": "test", "max_views": "unlimited"}, timeout=5)
    print(f"Status: {response.status_code} (should be 400)")
    print(f"Response: {response.json()}")

def main():
    print("Starting Pastebin-Lite API Tests")
    print(f"Base URL: {BASE_URL}")
    
    # Allow time for server startup
    print("\nWaiting for server to be ready...")
    time.sleep(2)
    
    # Health check
    if not test_health_check():
        print("❌ Health check failed - server may not be running")
        return
    
    print("✓ Health check passed")
    
    # Test basic creation and fetching
    paste_id = test_create_paste()
    if paste_id:
        test_fetch_paste(paste_id)
    
    # Test view limit
    test_view_count_limit()
    
    # Test validation
    test_validation_errors()
    
    print("\n=== Tests Complete ===")

if __name__ == "__main__":
    main()
