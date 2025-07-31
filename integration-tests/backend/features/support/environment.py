from behave import fixture
import requests
import os
import sys
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Add steps directory to Python path
steps_dir = Path(__file__).parent.parent.joinpath('step_definitions')
sys.path.insert(0, str(steps_dir))

# Import step definitions explicitly
import form_steps
import process_steps
import form_version_steps

@fixture
def api_client(context, *args, **kwargs):
    # Setup
    context.base_url = os.getenv('API_BASE_URL', 'http://localhost:8080')
    context.session = requests.Session()
    context.created_versions = []  # Track versions for cleanup

    yield context

    # Teardown
    context.session.close()
    if hasattr(context, 'browser'):
        context.browser.quit()

def before_scenario(context, scenario):
    # Initialize version tracking
    context.created_versions = []
    
    if 'authentication' in scenario.tags:
        # Initialize Chrome in headless mode
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        service = Service(ChromeDriverManager().install())
        context.browser = webdriver.Chrome(service=service, options=options)
        
        # Get credentials from environment
        username = os.getenv('OAUTH_USERNAME', 'testuser')
        password = os.getenv('OAUTH_PASSWORD', 'testpass')
        
        # Navigate to login page
        context.browser.get(f"{context.base_url}/oauth2/authorization/keycloak")
        
        # Fill credentials (using Keycloak default selectors)
        username_field = WebDriverWait(context.browser, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        username_field.send_keys(username)
        
        password_field = context.browser.find_element(By.ID, "password")
        password_field.send_keys(password)
        
        # Submit login
        submit_button = context.browser.find_element(By.ID, "kc-login")
        submit_button.click()
        
        # Get JSESSIONID cookie for API requests
        jsessionid = context.browser.get_cookie("JSESSIONID")['value']
        context.session.cookies.set("JSESSIONID", jsessionid)

def after_scenario(context, scenario):
    # Clean up created form versions
    for version_info in context.created_versions:
        key, version = version_info
        try:
            # Deprecate version first
            context.session.post(
                f"{context.base_url}/api/v1/forms/{key}/versions/{version}/deprecate"
            )
            # Actual deletion would require repository access
        except Exception as e:
            print(f"Cleanup failed for {key}/{version}: {str(e)}")
    
    # Clean up browser if it exists
    if hasattr(context, 'browser'):
        context.browser.quit()
