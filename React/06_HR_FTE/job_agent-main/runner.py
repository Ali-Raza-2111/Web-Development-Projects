import json
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from tools import glassdoor_search, indeed_search, apply_to_job

def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            try: return json.load(f)
            except: return {}
    return {}

def main():
    # Load profile for keywords
    profile = load_json("user_profile.json")
    keyword = profile.get("role", "Flutter Developer")
    location = "Pakistan"

    print(f"\nSTARTING JOB AGENT (Keyword: {keyword}, Location: {location})")
    
    # Path for storing browser sessions (cookies, logins)
    user_data_dir = os.path.abspath("browser_session")
    if not os.path.exists(user_data_dir):
        os.makedirs(user_data_dir)

    with sync_playwright() as p:
        print("Launching browser with persistent session...")
        context = p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            args=["--disable-blink-features=AutomationControlled"]
        )
        
        page = context.pages[0] if context.pages else context.new_page()
        Stealth().apply_stealth_sync(page)
        
        print("\nTIP: If you need to log in, do it now. The session will be saved.")
        time.sleep(5)

        # 1. Search Glassdoor and Indeed for multiple location types
        search_locations = ["Pakistan", "Remote"]
        
        for loc in search_locations:
            print(f"\n--- SEARCHING GLASSDOOR ({loc}) ---")
            glassdoor_jobs = glassdoor_search(page, keyword, loc)
            print(f"Found {len(glassdoor_jobs)} jobs on Glassdoor for {loc}")
            
            for job in glassdoor_jobs[:5]:
                success = apply_to_job(page, job)
                if success:
                    print(f"Successfully processed Glassdoor job: {job}")
                time.sleep(5)

            print(f"\n--- SEARCHING INDEED ({loc}) ---")
            indeed_jobs = indeed_search(page, keyword, loc)
            print(f"Found {len(indeed_jobs)} jobs on Indeed for {loc}")
            
            for job in indeed_jobs[:5]:
                success = apply_to_job(page, job)
                if success:
                    print(f"Successfully processed Indeed job: {job}")
                time.sleep(5)

        print("\n🏁 Session complete. Closing browser.")
        context.close()

if __name__ == "__main__":
    main()
