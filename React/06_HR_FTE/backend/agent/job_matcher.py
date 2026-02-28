import json
import os
import requests

def get_openrouter_key():
    """Reads OpenRouter API key from credentials.json."""
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    with open(creds_path, 'r') as f:
        return json.load(f).get("openrouter_api_key")

def calculate_match_score(profile, job_description):
    """
    Uses AI to calculate a match score (0-100) between user profile and job description.
    """
    api_key = get_openrouter_key()
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    Evaluate the match between the following user profile and job description.
    Provide a single integer score between 0 and 100, where 100 is a perfect match.
    ONLY return the integer score.
    
    JOB DESCRIPTION:
    {job_description}
    
    USER PROFILE:
    {json.dumps(profile, indent=2)}
    """
    
    data = {
        "model": "google/gemini-flash-1.5",
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        print("Calculating match score...")
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        score_text = response.json()['choices'][0]['message']['content'].strip()
        # Extract integer from response
        score = int(''.join(filter(str.isdigit, score_text)))
        print(f"Match Score: {score}%")
        return score
    except Exception as e:
        print(f"Error calculating match score: {e}")
        return 0
