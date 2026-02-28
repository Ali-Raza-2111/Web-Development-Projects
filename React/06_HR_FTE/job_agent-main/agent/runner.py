import json
import os
import time
from playwright.sync_api import sync_playwright
from tools import (
    scrape_glassdoor_jobs, 
    scrape_indeed_jobs, 
    smart_apply, 
    already_applied, 
    get_job_description, 
    save_application_log,
    send_email_notification
)
from job_matcher import calculate_match_score
from ai_writer import generate_cover_letter, tailor_resume

def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def get_daily_application_count():
    """Returns the number of applications made today from history.json."""
    history_path = os.path.join(os.path.dirname(__file__), 'memory', 'history.json')
    history = load_json(history_path)
    return len(history.get("applied_jobs", []))

def main():
    # 1. Load configuration and profile
    base_dir = os.path.dirname(__file__)
    # The profile is in the root directory relative to the runner script in agent/
    profile_path = os.path.abspath(os.path.join(base_dir, "..", "user_profile.json"))
    user_profile = load_json(profile_path)
    
    if not user_profile:
        print(f"❌ Error: user_profile.json not found at {profile_path}")
        return

    # 2. Configurable targets from profile
    keyword = user_profile.get("role", "Flutter Developer")
    location = "Pakistan"
    daily_limit = 10
    min_match_score = 40 # Slightly more lenient to catch more jobs
    
    print(f"\n" + "="*50)
    print(f"🚀 ULTIMATE JOB AGENT: GLASSDOOR & INDEED EDITION")
    print(f"Keyword: {keyword} | Location: {location}")
    print("="*50)

    with sync_playwright() as p:
        # Launching in headful mode so you can watch
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 3. Gather Jobs from Glassdoor and Indeed
            print("\n🔭 Searching for opportunities...")
            all_job_urls = []
            
            # Glassdoor Search
            glassdoor_jobs = scrape_glassdoor_jobs(page, keyword, location)
            print(f"✅ Glassdoor: Found {len(glassdoor_jobs)} potential jobs.")
            all_job_urls.extend(glassdoor_jobs)
            
            # Indeed Search
            indeed_jobs = scrape_indeed_jobs(page, keyword, location)
            print(f"✅ Indeed: Found {len(indeed_jobs)} potential jobs.")
            all_job_urls.extend(indeed_jobs)

            applications_today = get_daily_application_count()
            print(f"\n📊 Total apps found: {len(all_job_urls)} | Apps made today: {applications_today}")
            
            # 4. Intelligent Processing Loop
            for job_url in all_job_urls:
                if applications_today >= daily_limit:
                    print(f"\n🛑 Daily limit of {daily_limit} reached. Stopping for today.")
                    break
                    
                if already_applied(job_url):
                    print(f"⏭️ Skipping already applied job: {job_url}")
                    continue
                
                print(f"\n🧐 Analyzing: {job_url}")
                job_description = get_job_description(page, job_url)
                
                # Check for match score using AI layer
                score = calculate_match_score(user_profile, job_description)
                
                if score >= min_match_score:
                    print(f"✨ Match Score: {score}%! Generating custom application...")
                    
                    # Generate tailored cover letter
                    cover_letter = generate_cover_letter(user_profile, job_description)
                    
                    # CV Path (templates/Muhammad ALi.docx in the root folder)
                    resume_filename = user_profile.get("resume_file", "templates/Muhammad ALi.docx")
                    resume_path = os.path.abspath(os.path.join(base_dir, "..", resume_filename))
                    
                    if not os.path.exists(resume_path):
                        print(f"⚠️ CV file missing at: {resume_path}. Please check templates folder.")
                        continue
                        
                    # START SMART APPLY
                    success = smart_apply(page, job_url, user_profile, resume_path, cover_letter)
                    
                    if success:
                        applications_today += 1
                        print(f"🔗 Application process complete for: {job_url}")
                    else:
                        print(f"❌ Smart Apply could not finish for: {job_url}")
                else:
                    print(f"📉 Match score too low ({score}%). Skipping.")
                
                # Cooldown period to avoid bot detection
                print("⏳ Resting for 10 seconds...")
                time.sleep(10)

        except Exception as e:
            print(f"❌ Critical Error in Runner Loop: {e}")
        finally:
            print("\n🧹 Session finished. Closing browser...")
            browser.close()

if __name__ == "__main__":
    main()
