from behave import given, when, then, step
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8080/api/v1/forms"

# Context setup helpers
@given('a form definition key "{key}"')
def step_impl(context, key):
    context.form_key = key

@given('a version "{version}" exists for form "{key}"')
def step_impl(context, version, key):
    create_version(context, key, version)

@given('multiple versions exist for form "{key}"')
def step_impl(context, key):
    for row in context.table:
        create_version(context, key, row['version'], int(row['publishedDate']))

@given('form "{key}" exists')
def step_impl(context, key):
    context.form_key = key

@given('an active version "{version}" exists for form "{key}"')
def step_impl(context, version, key):
    create_version(context, key, version)

# Action steps
@when('I create a new version "{version}" with valid definition')
def step_impl(context, version):
    payload = {
        "name": "Test Form",
        "description": "Test Description",
        "version": version,
        "definition": {"fields": [{"name": "test"}]}
    }
    context.response = requests.post(
        f"{BASE_URL}/{context.form_key}/versions",
        json=payload
    )

@when('I create a new version "{version}" for form "{key}"')
def step_impl(context, version, key):
    payload = {
        "name": "Test Form",
        "description": "Test Description",
        "version": version,
        "definition": {"fields": [{"name": "test"}]}
    }
    context.response = requests.post(
        f"{BASE_URL}/{key}/versions",
        json=payload
    )

@when('I request the latest version for "{key}"')
def step_impl(context, key):
    context.response = requests.get(
        f"{BASE_URL}/{key}/versions/latest"
    )

@when('I request version "{version}" for form "{key}"')
def step_impl(context, version, key):
    context.response = requests.get(
        f"{BASE_URL}/{key}/versions/{version}"
    )

@when('I deprecate version "{version}"')
def step_impl(context, version):
    context.response = requests.post(
        f"{BASE_URL}/{context.form_key}/versions/{version}/deprecate"
    )

# Verification steps
@then('the response status should be {status_code:d}')
def step_impl(context, status_code):
    assert context.response.status_code == status_code, \
        f"Expected {status_code} but got {context.response.status_code}"

@then('the response should contain version "{version}"')
def step_impl(context, version):
    data = context.response.json()
    assert data['version'] == version, \
        f"Expected version {version} but got {data.get('version')}"

@then('the response should contain "definition" data')
def step_impl(context):
    data = context.response.json()
    assert 'definition' in data, "Response missing definition data"

@then('the version should be marked deprecated')
def step_impl(context):
    # Verify via direct API call
    key = context.form_key
    version = context.created_version
    response = requests.get(f"{BASE_URL}/{key}/versions/{version}")
    assert response.status_code == 200
    data = response.json()
    assert data['deprecated'] is True, "Version not marked deprecated"

@then('the response should contain "{message}"')
def step_impl(context, message):
    data = context.response.json()
    assert message in data['message'], \
        f"Expected '{message}' in response but got: {data.get('message')}"

# Helper functions
def create_version(context, key, version, published_date=None):
    payload = {
        "name": f"Form {version}",
        "description": "Test form version",
        "version": version,
        "definition": {"fields": [{"name": "field1"}]}
    }
    if published_date:
        payload["publishedDate"] = published_date
        
    response = requests.post(
        f"{BASE_URL}/{key}/versions",
        json=payload
    )
    if response.status_code == 201:
        context.created_version = version
    else:
        raise Exception(f"Version creation failed: {response.text}")
