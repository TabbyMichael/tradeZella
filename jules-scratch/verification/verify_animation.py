from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        # Home page
        page.goto("http://localhost:5173/")
        expect(page.locator("nav:not([aria-label])")).to_be_visible()
        page.wait_for_timeout(5000) # wait for animations to play
        page.screenshot(path="jules-scratch/verification/01-home-page-animation.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
