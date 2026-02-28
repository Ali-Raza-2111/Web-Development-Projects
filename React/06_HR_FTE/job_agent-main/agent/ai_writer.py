import json
import os
import requests

def get_openrouter_key():
    """Reads OpenRouter API key from credentials.json."""
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    with open(creds_path, 'r') as f:
        return json.load(f).get("openrouter_api_key")

def call_openrouter(prompt):
    """Makes a call to OpenRouter API."""
    api_key = get_openrouter_key()
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "google/gemini-flash-1.5", # Using Gemini flash as requested
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        return ""

def generate_cover_letter(profile, job_description):
    """
    Generates a tailored cover letter using user profile and job description.
    """
    prompt = f"""
    Write a professional and concise cover letter for the following job:
    
    JOB DESCRIPTION:
    {job_description}
    
    USER PROFILE:
    {json.dumps(profile, indent=2)}
    
    Keep it under 300 words and focus on matching the user's skills to the job requirements.
    """
    print("Generating cover letter...")
    return call_openrouter(prompt)

def tailor_resume(profile, job_description):
    """
    Generates tailored skill highlights for the resume based on the job description.
    """
    prompt = f"""
    Based on the following job description and user profile, provide 5 bullet points 
    summarizing why the user is a great fit for this specific role.
    
    JOB DESCRIPTION:
    {job_description}
    
    USER PROFILE:
    {json.dumps(profile, indent=2)}
    """
    print("Tailoring resume highlights...")
    return call_openrouter(prompt)
