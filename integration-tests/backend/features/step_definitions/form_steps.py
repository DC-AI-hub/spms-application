from behave import *
import requests
import os

import json
from behave import given, when, then

@given('the form API is available')
def step_impl(context):
    context.base_url = context.config.userdata['API_BASE_URL']
    context.auth = (
        context.config.userdata['TEST_USER'],
        context.config.userdata['TEST_PASS']
    )
    
@when('I POST valid form data to "{endpoint}"')
def step_impl(context, endpoint):
    form_data = {
        "name": "Test Form",
        "version": "1.0",
        "definition": {"fields": []}
    }
    response = requests.post(
        f"{context.base_url}{endpoint}",
        json=form_data,
        auth=context.auth
    )
    context.response = response
    if response.status_code == 200:
        context.form_id = response.json().get('id')

@given('a form version exists with ID "{form_id}"')
def step_impl(context, form_id):
    # Create test data
    form_data = {
        "name": "Test Form",
        "version": "1.0",
        "definition": {"fields": []}
    }
    response = requests.post(
        f"{context.base_url}/forms",
        json=form_data,
        auth=context.auth
    )
    assert response.status_code == 201
    context.form_id = form_id

@when('I GET "{endpoint}"')
def step_impl(context, endpoint):
    response = requests.get(
        f"{context.base_url}{endpoint}",
        auth=context.auth
    )
    context.response = response

@then('the response status should be {status_code}')
def step_impl(context, status_code):
    assert context.response.status_code == int(status_code), \
        f"Expected status {status_code}, got {context.response.status_code}. Response: {context.response.text}"

@then('the response should contain form metadata')
def step_impl(context):
    response_json = context.response.json()
    assert 'id' in response_json, f"Response missing 'id': {response_json}"
    assert 'name' in response_json, f"Response missing 'name': {response_json}"
    assert 'version' in response_json, f"Response missing 'version': {response_json}"

@then('the response should contain the form version details')
def step_impl(context):
    response_json = context.response.json()
    assert str(response_json['id']) == context.form_id, \
        f"Expected form ID {context.form_id}, got {response_json['id']}"
    assert 'definition' in response_json, \
        f"Response missing 'definition': {response_json}"
