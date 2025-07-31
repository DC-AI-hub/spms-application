Feature: Process Management API
  Tests for ProcessControllerV1 endpoints covering process definitions,
  instances and task management

  Background:
    Given the API base URL is "/api/v1/process"
    And valid authentication credentials are provided

  Scenario: Create new process definition
    Given a valid process definition request
    When POST request is made to "/definitions"
    Then response status should be 200
    And response should contain process definition details

  Scenario: Create process definition with invalid BPMN
    Given a process definition request with invalid BPMN XML
    When POST request is made to "/definitions"
    Then response status should be 400

  Scenario: Get process definition by ID
    Given an existing process definition
    When GET request is made to "/definitions/{definitionId}"
    Then response status should be 200
    And response should match the stored definition

  Scenario: Get non-existent process definition
    Given a non-existent process definition ID
    When GET request is made to "/definitions/{definitionId}"
    Then response status should be 404

  Scenario: List process definition versions
    Given an existing process definition with versions
    When GET request is made to "/definitions/{definitionId}/versions"
    Then response status should be 200
    And response should contain paginated versions

  Scenario: Get specific process definition version
    Given an existing process definition version
    When GET request is made to "/definitions/{definitionId}/versions/{versionId}"
    Then response status should be 200
    And response should match the version details

  Scenario: Activate process definition version
    Given an existing inactive process definition version
    When POST request is made to "/definitions/{definitionId}/versions/{versionId}/active"
    Then response status should be 200

  Scenario: Start process instance
    Given an active process definition
    When POST request is made to "/instances" with definition ID
    Then response status should be 200
    And response should contain instance details

  Scenario: Get process instance status
    Given an existing process instance
    When GET request is made to "/instances/{instanceId}"
    Then response status should be 200
    And response should contain instance status

  Scenario: List process instance tasks
    Given an existing process instance with tasks
    When GET request is made to "/instances/{instanceId}/tasks"
    Then response status should be 200
    And response should contain task list

  Scenario: Complete process task
    Given an existing incomplete process task
    When POST request is made to "/instances/{instanceId}/tasks/{taskId}/complete"
    Then response status should be 200
