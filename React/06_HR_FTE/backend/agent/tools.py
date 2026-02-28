import json
import os
import time
import smtplib
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from playwright.sync_api import Page, TimeoutError

def get_credentials():
    """Reads credentials from credentials.json."""
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    if not os.path.exists(creds_path):
        return {}
    with open(creds_path, 'r') as f:
        return json.load(f)

def scrape_glassdoor_jobs(page: Page, keyword, location):
    """Scrapes job URLs from Glassdoor."""
    url = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={urllib.parse.quote(keyword)}&locT=C&locId={urllib.parse.quote(location)}"
    print(f"🔍 Searching Glassdoor: {url}")
    page.goto(url)
    page.wait_for_timeout(5000)

    try:
        # Improved selectors for Glassdoor job links
        links = page.query_selector_all("a[data-test='job-link'], a.jobLink, div[data-test='jobListing'] a")
        urls = []
        for link in links:
            href = link.get_attribute("href")
            if href:
                full_url = "https://www.glassdoor.com" + href if not href.startswith("http") else href
                if full_url not in urls: urls.append(full_url)
        return urls
    except Exception as e:
        print(f"Error scraping Glassdoor: {e}")
        return []

def scrape_indeed_jobs(page: Page, keyword, location):
    """Scrapes job URLs from Indeed."""
    # Note: Indeed URLs can vary by region. Using pk.indeed.com for Pakistan.
    url = f"https://pk.indeed.com/jobs?q={urllib.parse.quote(keyword)}&l={urllib.parse.quote(location)}"
    print(f"🔍 Searching Indeed: {url}")
    page.goto(url)
    page.wait_for_timeout(5000)

    try:
        # Indeed job card link selectors
        links = page.query_selector_all("a.jcs-JobTitle, h2.jobTitle a, a[data-jk]")
        urls = []
        for link in links:
            href = link.get_attribute("href")
            if href:
                full_url = "https://pk.indeed.com" + href if not href.startswith("http") else href
                if full_url not in urls: urls.append(full_url)
        return urls
    except Exception as e:
        print(f"Error scraping Indeed: {e}")
        return []

def find_smart_button(page: Page, keywords):
    """Heuristically finds a button or link based on text keywords."""
    print(f"🔎 Scanning for buttons containing: {keywords}")
    
    # Check common elements that act as buttons
    interactive_selectors = ["button", "a", "[role='button']", "input[type='button']", "input[type='submit']"]
    
    for selector in interactive_selectors:
        elements = page.query_selector_all(selector)
        for el in elements:
            try:
                if not el.is_visible(): continue
                text = el.inner_text().strip().lower()
                if not text:
                    text = (el.get_attribute("value") or el.get_attribute("aria-label") or "").lower()
                
                if any(k.lower() in text for k in keywords):
                    # Prioritize exact or near-exact matches if needed, but here we return first match
                    return el
            except:
                continue
    return None

def fill_field(page: Page, selector, value):
    """Safely fills a field if it exists."""
    try:
        field = page.query_selector(selector)
        if field and field.is_visible():
            field.fill(value)
            return True
    except:
        pass
    return False

def fill_generic_form(page: Page, profile, resume_path, cover_letter):
    """Detects and fills common form fields on Glassdoor, Indeed, and generic sites."""
    print("🪄 Attempting to fill form fields intelligently...")
    
    # Keywords for field detection
    field_maps = {
        "name": ["name", "full name", "first name", "last name", "given name"],
        "email": ["email", "e-mail", "email address", "identifier"],
        "phone": ["phone", "mobile", "contact", "number", "tel"],
        "textarea": ["cover letter", "message", "additional", "why should we hire", "intro"],
        "resume": ["resume", "cv", "curriculum vitae", "document", "upload"]
    }

    # Find all potentially fillable elements
    inputs = page.query_selector_all("input, textarea, select")
    for field in inputs:
        try:
            if not field.is_visible(): continue
            
            # Extract identifying information
            id_attr = (field.get_attribute("id") or "").lower()
            name_attr = (field.get_attribute("name") or "").lower()
            placeholder = (field.get_attribute("placeholder") or "").lower()
            
            label_text = ""
            if id_attr:
                label_el = page.query_selector(f"label[for='{id_attr}']")
                if label_el: label_text = label_el.inner_text().lower()
            
            # Combined identity
            identity = f"{id_attr} {name_attr} {placeholder} {label_text}"

            # Fill based on detection
            if any(k in identity for k in field_maps["name"]):
                field.fill(profile.get("name", "Muhammad Ali"))
            elif any(k in identity for k in field_maps["email"]):
                field.fill(profile.get("email", "alilaiqat22731279@gmail.com"))
            elif any(k in identity for k in field_maps["phone"]):
                field.fill(profile.get("phone", "03705105203"))
            elif field.get_attribute("type") == "file" or any(k in identity for k in field_maps["resume"]):
                if os.path.exists(resume_path):
                    field.set_input_files(resume_path)
                    print(f"✅ CV Uploaded: {os.path.basename(resume_path)}")
            elif field.tag_name == "textarea" and any(k in identity for k in field_maps["textarea"]):
                field.fill(cover_letter)
        except Exception as e:
            # print(f"DEBUG: Error filling field: {e}")
            continue

def smart_apply(page: Page, job_url, profile, resume_path, cover_letter):
    """Main intelligent application logic: Find Apply -> Fill -> Next -> Submit -> Email."""
    print(f"\n🚀 Starting Smart Apply Process for: {job_url}")
    page.goto(job_url)
    try:
        page.wait_for_load_state("domcontentloaded", timeout=10000)
    except:
        print("Page load timeout, continuing...")
    page.wait_for_timeout(3000)
    
    # 1. Detect Apply Button (General keywords)
    apply_keywords = ["Apply", "Apply Now", "Quick Apply", "Easy Apply", "Apply on Company Site", "Continue to Apply"]
    apply_btn = find_smart_button(page, apply_keywords)
    
    if not apply_btn:
        print("❌ Could not find any apply button on this page.")
        return False

    btn_text = apply_btn.inner_text().strip() or "Apply"
    print(f"👆 Clicking: '{btn_text}'")
    apply_btn.click()
    page.wait_for_timeout(3000)

    # 2. Multi-Step Form Handling Loop
    step_limit = 10
    for step in range(step_limit):
        print(f"📋 Processing Application Step {step + 1}...")
        
        # Current page might have changed if redirected
        try:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
        except:
            print("Page load timeout, continuing...")
        page.wait_for_timeout(3000)
        
        # Fill visible fields
        fill_generic_form(page, profile, resume_path, cover_letter)
        
        # Check for Final Submit button
        submit_keywords = ["Submit", "Finish", "Send", "Apply Application", "Confirm Application"]
        submit_btn = find_smart_button(page, submit_keywords)
        
        # If we see a submit button and it's not just a "Next" button with "Submit" as a keyword
        if submit_btn and "submit" in submit_btn.inner_text().lower():
            print("🚀 FOUND FINAL SUBMIT! Clicking...")
            submit_btn.click()
            page.wait_for_timeout(5000)
            
            # Verify Success
            success_indicators = ["success", "applied", "thank you", "received", "confirmation"]
            if any(k in page.content().lower() for k in success_indicators):
                print("✨ SUCCESS: Application submitted successfully!")
                save_application_log(job_url)
                
                # Try to get company name for email
                company = "Unknown"
                try: company = page.title().split('-')[0].strip()
                except: pass
                
                send_email_notification(job_url, "Potential Match", company)
                return True
            else:
                print("⚠️ Submit clicked, success message not caught (might still be successful).")
                save_application_log(job_url) # Log anyway
                return True
        
        # Look for intermediate "Next" or "Continue" buttons
        next_keywords = ["Next", "Continue", "Review", "Step", "Save and continue"]
        next_btn = find_smart_button(page, next_keywords)
        
        if next_btn:
            # Avoid clicking buttons we already clicked or that lead nowhere
            print(f"➡️ Proceeding to next step: '{next_btn.inner_text().strip()}'")
            next_btn.click()
            page.wait_for_timeout(3000)
        else:
            print("🛑 No more 'Next' or 'Submit' buttons found.")
            break
            
    return False

def save_application_log(job_url):
    """Saves the applied job URL to history.json."""
    history_path = os.path.join(os.path.dirname(__file__), 'memory', 'history.json')
    os.makedirs(os.path.dirname(history_path), exist_ok=True)
    
    history = {"applied_jobs": []}
    if os.path.exists(history_path):
        with open(history_path, 'r') as f:
            try: history = json.load(f)
            except: pass
    
    if job_url not in history["applied_jobs"]:
        history["applied_jobs"].append(job_url)
        with open(history_path, 'w') as f:
            json.dump(history, f, indent=4)
        print(f"📝 Job logged in history: {job_url}")

def already_applied(job_url):
    """Checks if the job URL exists in history.json."""
    history_path = os.path.join(os.path.dirname(__file__), 'memory', 'history.json')
    if not os.path.exists(history_path): return False
    with open(history_path, 'r') as f:
        try:
            history = json.load(f)
            return job_url in history.get("applied_jobs", [])
        except: return False

def get_job_description(page: Page, job_url):
    """Extracts job description text."""
    if page.url != job_url:
        page.goto(job_url)
        try:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
        except:
            print("Page load timeout, continuing...")
        page.wait_for_timeout(3000)
    
    description_selectors = [
        ".jobs-description", ".job-description", "#job-details", 
        "[data-test='job-description']", "div.jobsearch-JobComponent-description"
    ]
    for sel in description_selectors:
        el = page.query_selector(sel)
        if el: return el.inner_text()
    
    # Fallback: get text of the largest readable container
    return "Description extraction failed."

def send_email_notification(job_url, job_title="Unknown", company_name="Unknown"):
    """Sends a detailed email notification via Gmail SMTP."""
    creds = get_credentials()
    smtp_user = creds.get("smtp_user")
    smtp_pass = creds.get("smtp_password")
    receiver = creds.get("notification_email")
    
    if not smtp_user or not smtp_pass or not receiver:
        print("❌ Email notification skipped: SMTP credentials missing in credentials.json.")
        return

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = receiver
    msg['Subject'] = f"✅ Job Application Submitted: {company_name}"

    body = f"""
Hello,

Your Job Search Agent has submitted an application:

🏢 Company: {company_name}
🎯 Position: {job_title}
📅 Date/Time: {time.strftime('%Y-%m-%d %H:%M:%S')}
🔗 Link: {job_url}

The application was handled automatically using the Smart Apply logic.

Good luck!
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, receiver, msg.as_string())
        server.quit()
        print(f"📧 Confirmation email sent to {receiver}")
    except Exception as e:
        print(f"❌ SMTP Error: {e}")
