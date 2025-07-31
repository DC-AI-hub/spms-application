from behave import *
import requests
import json
from hamcrest import assert_that, equal_to, has_key, is_not

BASE_URL = None

@given('the API base URL is "{url}"')
def set_base_url(context, url):
    global BASE_URL
    BASE_URL = url

@given('valid authentication credentials are provided')
def set_auth(context):
    context.headers = {'Authorization': 'Bearer test-token'}

@given('a valid process definition request')
def create_valid_definition_request(context):
    context.request_body = {
        "name": "Test Process",
        "key": "test_process",
        "bpmnXml": "<bpmn>...</bpmn>",
        "businessOwnerId": 1
    }

@given('a process definition request with invalid BPMN XML')
def create_invalid_bpmn_request(context):
    context.request_body = {
        "name": "Invalid Process", 
        "key": "invalid_process",
        "bpmnXml": "invalid",
        "businessOwnerId": 1
    }

@given('an existing process definition')
def mock_existing_definition(context):
    context.definition_id = "test_definition"

@given('a non-existent process definition ID')
def set_nonexistent_id(context):
    context.definition_id = "nonexistent"

@given('an existing process definition with versions')
def mock_definition_with_versions(context):
    context.definition_id = "versioned_definition"

@given('an existing process definition version')
def mock_existing_version(context):
    context.definition_id = "versioned_definition"
    context.version_id = "v1"

@given('an existing inactive process definition version')
def mock_inactive_version(context):
    context.definition_id = "inactive_definition"
    context.version_id = "v1"

@given('an active process definition')
def mock_active_definition(context):
    context.definition_id = "active_definition"

@given('an existing process instance')
def mock_existing_instance(context):
    context.instance_id = "test_instance"

@given('an existing process instance with tasks')
def mock_instance_with_tasks(context):
    context.instance_id = "task_instance"

@given('an existing incomplete process task')
def mock_incomplete_task(context):
    context.instance_id = "task_instance"
    context.task_id = "incomplete_task"

@when('POST request is made to "{endpoint}"')
def post_request(context, endpoint):
    if hasattr(context, 'request_body'):
        context.response = requests.post(
            f"{BASE_URL}{endpoint}",
            headers=context.headers,
            json=context.request_body
        )

@when('GET request is made to "{endpoint}"')
def get_request(context, endpoint):
    endpoint = endpoint.replace("{definitionId}", getattr(context, 'definition_id', ''))
    endpoint = endpoint.replace("{versionId}", getattr(context, 'version_id', ''))
    endpoint = endpoint.replace("{instanceId}", getattr(context, 'instance_id', ''))
    context.response = requests.get(
        f"{BASE_URL}{endpoint}",
        headers=context.headers
    )

@when('POST request is made to "{endpoint}" with definition ID')
def post_request_with_definition(context, endpoint):
    context.request_body = {"definitionId": context.definition_id}
    context.response = requests.post(
        f"{BASE_URL}{endpoint}",
        headers=context.headers,
        json=context.request_body
    )

@then('response status should be {status_code}')
def check_status(context, status_code):
    assert_that(context.response.status_code, equal_to(int(status_code)))

@then('response should contain process definition details')
def check_definition_response(context):
    response_json = context.response.json()
    assert_that(response_json, has_key('id'))
    assert_that(response_json, has_key('name'))
    assert_that(response_json, has_key('key'))
    assert_that(response_json, has_key('bpmnXml'))

@then('response should match the stored definition')
def check_matches_stored(context):
    response_json = context.response.json()
    assert_that(response_json['name'], equal_to("Test Process"))

@then('response should contain paginated versions')
def check_paginated_versions(context):
    response_json = context.response.json()
    assert_that(response_json['content'], is_not(None))
    assert_that(len(response_json['content']), equal_to(1))

@then('response should match the version details')
def check_version_details(context):
    response_json = context.response.json()
    assert_that(response_json['version'], equal_to("1.0"))

@then('response should contain instance details')
def check_instance_response(context):
    response_json = context.response.json()
    assert_that(response_json, has_key('instanceId'))
    assert_that(response_json, has_key('definitionId'))

@then('response should contain instance status')
def check_instance_status(context):
    response_json = context.response.json()
    assert_that(response_json, has_key('status'))
    assert_that(response_json, has_key('startTime'))

@then('response should contain task list')
def check_task_list(context):
    response_json = context.response.json()
    assert_that(len(response_json), equal_to(1))
    assert_that(response_json[0], has_key('taskId'))
