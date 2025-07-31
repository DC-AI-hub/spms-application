Feature: Form Version Management API

Scenario: Create new form version
  Given a form definition key "leave-request"
  When I create a new version "1.0.0" with valid definition
  Then the response status should be 201
  And the response should contain version "1.0.0"

Scenario: Prevent duplicate version creation
  Given a version "1.0.0" exists for form "leave-request"
  When I create a new version "1.0.0" for form "leave-request"
  Then the response status should be 400
  And the response should contain "Version already exists"

Scenario: Retrieve latest version
  Given multiple versions exist for form "leave-request":
    | version | publishedDate |
    | 1.0.0   | 1620000000000 |
    | 1.1.0   | 1620086400000 |
  When I request the latest version for "leave-request"
  Then the response status should be 200
  And the response should contain version "1.1.0"

Scenario: Retrieve specific version
  Given a version "1.0.0" exists for form "leave-request"
  When I request version "1.0.0" for form "leave-request"
  Then the response status should be 200
  And the response should contain "definition" data

Scenario: Handle non-existent version
  Given form "leave-request" exists
  When I request version "9.9.9" for form "leave-request"
  Then the response status should be 404

Scenario: Deprecate active version
  Given an active version "1.0.0" exists for form "leave-request"
  When I deprecate version "1.0.0"
  Then the response status should be 204
  And the version should be marked deprecated

Scenario: Prevent deprecation of non-existent version
  Given form "leave-request" exists
  When I deprecate version "9.9.9"
  Then the response status should be 404
