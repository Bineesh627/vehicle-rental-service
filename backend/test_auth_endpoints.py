import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_register():
    print("Testing Registration...")
    url = f"{BASE_URL}/register/"
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    response = requests.post(url, json=data)
    if response.status_code == 201:
        print("Registration Successful!")
        print(response.json())
        return True
    elif response.status_code == 400 and 'username' in response.json() and 'already exists' in str(response.json()):
         print("User already exists, proceeding to login.")
         return True
    else:
        print(f"Registration Failed: {response.status_code}")
        print(response.text)
        return False

def test_login():
    print("\nTesting Login...")
    url = f"{BASE_URL}/login/"
    data = {
        "username": "testuser",
        "password": "testpassword123"
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Login Successful!")
        print(response.json())
        return True
    else:
        print(f"Login Failed: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    if test_register():
        test_login()
