import json
import os
import time
import random
import smtplib
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from playwright.sync_api import Page, TimeoutError, BrowserContext
from playwright_stealth import Stealth

def get_credentials():
    """Reads credentials from credentials.json in root."""
    if os.path.exists("credentials.json"):
        with open("credentials.json", "r") as f:
            return json.load(f)
    return {}

def human_delay(min_sec=1, max_sec=3):
    """Add a randomized delay to mimic human behavior."""
    time.sleep(random.uniform(min_sec, max_sec))

def wait_for_page_load(page: Page, timeout=10000):
    """Robust page load helper."""
    try:
        if page.is_closed(): return
        page.wait_for_load_state("domcontentloaded", timeout=timeout)
    except:
        pass
    human_delay(2, 4) # Extra buffer for elements to settle

def check_forced_pause(page: Page):
    """Checks if the page contains verification/CAPTCHA and pauses if it does."""
    if page.is_closed(): return
    
    captcha_selectors = [
        "iframe[src*='captcha']", 
        "div.g-recaptcha", 
        ".h-captcha", 
        "text='Verify you are human'", 
        "text='PARDON OUR INTERRUPTION'"
    ]
    
    for selector in captcha_selectors:
        try:
            if page.query_selector(selector):
                print("\n🛑 SECURITY VERIFICATION DETECTED!")
                print("👋 Please solve the CAPTCHA or Verification manually in the browser window.")
                print("⏳ The agent is waiting for you to complete it... (Press Enter in terminal when done or wait for auto-resume)")
                page.pause() # This opens the Playwright inspector/pauses script
                return True
        except: continue
    return False

def glassdoor_search(page: Page, keyword, location):
    """Scrapes job URLs from Glassdoor with safety checks."""
    if page.is_closed(): return []
    try:
        url = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={urllib.parse.quote(keyword)}&locT=C&locId={urllib.parse.quote(location)}"
        print(f"SEARCHING Glassdoor: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        check_forced_pause(page)
        wait_for_page_load(page)

        if page.is_closed(): return []
        links = page.query_selector_all("a[data-test='job-link'], a.jobLink, div[data-test='jobListing'] a")
        urls = []
        for link in links:
            try:
                href = link.get_attribute("href")
                if href:
                    full_url = "https://www.glassdoor.com" + href if not href.startswith("http") else href
                    if full_url not in urls: urls.append(full_url)
            except: continue
        return urls
    except Exception as e:
        print(f"⚠️ Error scraping Glassdoor: {e}")
        return []

def indeed_search(page: Page, keyword, location):
    """Scrapes job URLs from Indeed with safety checks."""
    if page.is_closed(): return []
    try:
        url = f"https://pk.indeed.com/jobs?q={urllib.parse.quote(keyword)}&l={urllib.parse.quote(location)}"
        print(f"SEARCHING Indeed: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        check_forced_pause(page)
        wait_for_page_load(page)

        if page.is_closed(): return []
        links = page.query_selector_all("a.jcs-JobTitle, h2.jobTitle a, a[data-jk]")
        urls = []
        for link in links:
            try:
                href = link.get_attribute("href")
                if href:
                    full_url = "https://pk.indeed.com" + href if not href.startswith("http") else href
                    if full_url not in urls: urls.append(full_url)
            except: continue
        return urls
    except Exception as e:
        print(f"⚠️ Error scraping Indeed: {e}")
        return []

def find_smart_button(page: Page, keywords, ignore_keywords=None):
    """Heuristically finds a button or link across main page and all frames."""
    if page.is_closed(): return None
    if ignore_keywords is None: ignore_keywords = []
    
    selectors = ["button", "a", "[role='button']", "input[type='button']", "input[type='submit']"]
    
    frames = page.frames
    for frame in frames:
        try:
            for keyword in keywords:
                for selector in selectors:
                    elements = frame.query_selector_all(selector)
                    for el in elements:
                        try:
                            if not el.is_visible(): continue
                            text = (el.inner_text() or el.get_attribute("value") or el.get_attribute("aria-label") or "").strip().lower()
                            
                            # Filter out ignored keywords (e.g., social logins)
                            if any(ignore.lower() in text for ignore in ignore_keywords):
                                continue
                                
                            if keyword.lower() in text:
                                return el
                        except: continue
        except: continue
    return None

def fill_generic_form(page: Page, profile, resume_path, cover_letter):
    """Detects and fills common form fields, handling potential iframes."""
    if page.is_closed(): return
    print("Attempting to fill form fields intelligently...")
    
    field_maps = {
        "name": ["name", "full name", "first name", "last name", "given name"],
        "email": ["email", "e-mail", "email address", "identifier"],
        "phone": ["phone", "mobile", "contact", "number", "tel"],
        "address": ["address", "street", "city", "location", "residence"],
        "postal": ["postal", "zip", "pincode", "postcode"],
        "salary": ["salary", "compensation", "min", "max", "expectation", "rate"],
        "textarea": ["cover letter", "message", "additional", "why should we hire", "intro"],
        "resume": ["resume", "cv", "curriculum vitae", "document", "upload"]
    }

    for frame in page.frames:
        try:
            inputs = frame.query_selector_all("input:not([type='hidden']), textarea, select")
            for field in inputs:
                try:
                    if not field.is_visible(): continue
                    
                    id_attr = (field.get_attribute("id") or "").lower()
                    name_attr = (field.get_attribute("name") or "").lower()
                    placeholder = (field.get_attribute("placeholder") or "").lower()
                    
                    label_text = ""
                    if id_attr:
                        label_el = frame.query_selector(f"label[for='{id_attr}']")
                        if label_el: label_text = label_el.inner_text().lower()
                    
                    identity = f"{id_attr} {name_attr} {placeholder} {label_text}"

                    creds = get_credentials()
                    user_email = profile.get("email") or creds.get("linkedin_email") or "alilaiqat22731279@gmail.com"
                    user_name = profile.get("name") or "Muhammad Ali"
                    user_phone = profile.get("phone") or "03705105203"

                    if any(k in identity for k in field_maps["name"]):
                        human_delay(0.5, 1.5)
                        field.fill(user_name)
                    elif any(k in identity for k in field_maps["email"]):
                        human_delay(0.5, 1.5)
                        field.fill(user_email)
                    elif any(k in identity for k in field_maps["phone"]):
                        human_delay(0.5, 1.5)
                        field.fill(user_phone)
                    elif any(k in identity for k in field_maps["address"]):
                        human_delay(0.5, 1.5)
                        field.fill(profile.get("address", "Faisalabad, Pakistan"))
                    elif any(k in identity for k in field_maps["postal"]):
                        human_delay(0.5, 1.5)
                        field.fill(profile.get("postal_code", "38000"))
                    elif any(k in identity for k in field_maps["salary"]):
                        human_delay(0.5, 1.5)
                        field.fill(profile.get("desired_salary", "50000"))
                    elif field.get_attribute("type") == "file" or any(k in identity for k in field_maps["resume"]):
                        if os.path.exists(resume_path):
                            human_delay(1, 2)
                            field.set_input_files(resume_path)
                            print(f"CV Uploaded: {os.path.basename(resume_path)}")
                    elif field.tag_name == "textarea" and any(k in identity for k in field_maps["textarea"]):
                        human_delay(1, 3)
                        field.fill(cover_letter)
                    
                    # Handle Checkboxes/Radios for "Remote" if found?
                    # (This is tricky without more context, but we can try simple clicks if label matches)
                except: continue
        except: continue

def apply_to_job(page: Page, job_url):
    """Advanced apply logic with tab handling and iframe support."""
    if page.is_closed(): return False
    print(f"\nStarting Smart Apply for: {job_url}")
    
    try:
        page.goto(job_url, wait_until="domcontentloaded", timeout=30000)
        check_forced_pause(page)
        wait_for_page_load(page)
    except Exception as e:
        print(f"❌ Navigation failed: {e}")
        return False
    
    company_name = "Unknown Company"
    name_selectors = [
        "div[data-test='employer-name']", "div.css-p3yqto", "div.icl-u-xs-mr--xs", 
        "h4.companyName", ".jobsearch-CompanyReview--title", ".css-169en9d", "div.css-p3yqto"
    ]
    for sel in name_selectors:
        try:
            el = page.query_selector(sel)
            if el:
                company_name = el.inner_text().strip()
                break
        except: continue

    apply_keywords = ["Apply Now", "Quick Apply", "Easy Apply", "Continue to Apply", "Apply on company site", "Apply"]
    ignore_apply = ["Google", "Facebook", "Apple", "LinkedIn"]
    apply_btn = find_smart_button(page, apply_keywords, ignore_keywords=ignore_apply)
    
    if not apply_btn:
        print(f"❌ No apply button found for {company_name}.")
        return False

    try:
        btn_text = apply_btn.inner_text().strip()
        print(f"Clicking '{btn_text}' for {company_name}...")
        human_delay(1, 3)
        
        context = page.context
        with context.expect_page(timeout=5000) as new_page_info:
            apply_btn.click()
        working_page = new_page_info.value
        Stealth().apply_stealth_sync(working_page)
        print("Application opened in a NEW TAB.")
    except Exception as e:
        # If click failed or no new page, try to continue on current page
        working_page = page
        print(f"Application continued in the SAME TAB or fallback: {e}")

    profile = {}
    if os.path.exists("user_profile.json"):
        with open("user_profile.json", "r") as f:
            profile = json.load(f)
    
    cover_letter = "I am highly interested in this position and believe my skills are a great fit."
    resume_path = os.path.abspath("templates/Muhammad ALi.docx")

    step_limit = 10
    total_steps = 0
    last_url = ""
    for step in range(step_limit):
        if working_page.is_closed(): break
        
        current_url = working_page.url
        if current_url == last_url and total_steps > 0:
            print("⚠️ URL has not changed. Skipping repetitive step.")
            # If we're stuck, we might need to break or wait
            
        last_url = current_url
        check_forced_pause(working_page)
        wait_for_page_load(working_page)
        total_steps += 1
        
        print(f"Step {total_steps}: {working_page.url[:60]}...")
        fill_generic_form(working_page, profile, resume_path, cover_letter)
        
        submit_keywords = ["Submit", "Finish", "Send Application", "Confirm Application", "Apply now"]
        submit_btn = find_smart_button(working_page, submit_keywords)
        
        if submit_btn:
            try:
                if "submit" in (submit_btn.inner_text() or "").lower():
                    print("Clicking SUBMIT...")
                    human_delay(2, 4)
                    submit_btn.click()
                    time.sleep(5)
                    send_email_notification(job_url, company_name)
                    if working_page != page: working_page.close()
                    return True
            except: pass
        
        next_keywords = ["Next", "Continue", "Review", "Step", "Save and continue", "Proceed"]
        ignore_next = ["Google", "Facebook", "Apple", "LinkedIn"]
        next_btn = find_smart_button(working_page, next_keywords, ignore_keywords=ignore_next)
        
        if next_btn:
            try:
                btn_label = next_btn.inner_text().strip()
                print(f"Step {total_steps}: Clicking '{btn_label}'...")
                human_delay(1, 3)
                next_btn.click()
            except Exception as e:
                print(f"⚠️ Failed to click next button: {e}")
                if total_steps > 1:
                    print("🏁 Attempting to finish as form might be submitted.")
                    send_email_notification(job_url, company_name)
                    if working_page != page: working_page.close()
                    return True
                break
        else:
            if total_steps > 1:
                print("🏁 Form appears complete or submitted.")
                send_email_notification(job_url, company_name)
                if working_page != page: working_page.close()
                return True
            break
            
    if working_page != page and not working_page.is_closed():
        working_page.close()
    return False

def send_email_notification(job_url, company_name):
    """Consolidated email notification."""
    creds = get_credentials()
    sender = creds.get("linkedin_email")
    password = creds.get("linkedin_password")
    
    if not sender or not password:
        return False

    # Load profile to get the specific notification email preference
    profile = {}
    if os.path.exists("user_profile.json"):
        with open("user_profile.json", "r") as f:
            profile = json.load(f)
            
    recipient = profile.get("notification_email", "mrkahn425@gmail.com")
    
    if not sender or not password:
        return False

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = recipient
    msg['Subject'] = f"✅ Application Submitted: {company_name}"

    body = f"Hello,\n\nYou applied for a job at {company_name}.\n\nLink: {job_url}\n\nGood luck!"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
        print(f"📧 Notification email sent for {company_name}")
        return True
    except Exception as e:
        print(f"❌ Email failed: {e}")
        return False

def already_applied(job_url):
    """History check logic."""
    history_path = "history.json"
    if not os.path.exists(history_path): return False
    with open(history_path, 'r') as f:
        try:
            history = json.load(f)
            return job_url in history.get("applied_jobs", [])
        except: return False
