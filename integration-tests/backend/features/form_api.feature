Feature: Form API Endpoints
  Scenario: Create new form version
    Given the form API is available
    When I POST valid form data to "/api/v1/forms"
    Then the response status should be 201
    And the response should contain form metadata

  Scenario: Get form version by ID
    Given a form version exists with ID "123"
    When I GET "/api/v1/forms/123"
    Then the response status should be 200
    And the response should contain the form version details

  @wip
  Scenario: Update form version
    Given a form version exists with ID "123"
    When I PUT updated data to "/api/v1/forms/123"
    Then the response status should be 200
    And the response should contain the updated form version
