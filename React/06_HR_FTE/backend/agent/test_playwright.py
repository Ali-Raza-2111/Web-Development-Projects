from playwright.sync_api import sync_playwright

def test_launch():
    with sync_playwright() as p:
        try:
            print("Attempting to launch browser...")
            browser = p.chromium.launch(headless=True) # Test in headless first
            print("Browser launched successfully.")
            browser.close()
        except Exception as e:
            print(f"Launch failed: {e}")

if __name__ == "__main__":
    test_launch()
