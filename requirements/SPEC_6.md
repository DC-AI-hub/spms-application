# Vacation Request Workflow Requirements Document

## 1. Functional Requirements

### 1.1 Vacation Request Submission
- Employees can initiate vacation requests with:
  - Start date (YYYY-MM-DD)
  - End date (YYYY-MM-DD)
  - Duration in days
  - Reason for request
  - Optional file attachment for supporting documents

- System validation required:
  - Date range validation (start date <= end date)
  - Required fields must be populated
  - Maximum allowed vacation days per year based on company policy

### 1.2 Approval Process
- Vacation requests must be approved by the employee's direct manager
- Appointed rejection capability for secondary approver in case:
  - Primary approver is unavailable
  - Primary approver rejects without providing feedback
- Escalation process:
  - Auto-forward to secondary approver if primary approver doesn't respond after 3 business days
  - Escalate to HR Admin if secondary approver also doesn't respond after another 3 business days

### 1.3 Notifications
- Email notifications are sent to:
  - Requester when:
    - Request is submitted
    - Request is approved/rejected
    - Request status changes (e.g., escalated)
  - Managers when they have new requests to approve
  - HR Admins when escalations occur

- System-generated email templates with customizable content for:
  - Approval reminders
  - Status updates
  - Escalation notifications

### 1.4 Workflow Tracking
- All activities (submissions, approvals, rejections) are logged with:
  - Timestamp
  - User ID
  - Action taken
  - Comments (if any)

- Audit trail must be retained for at least 5 years

### 1.5 User Roles
- **Employees:**
  - Submit vacation requests
  - View their submitted requests and history
- **Managers:**
  - Approve/Reject vacation requests
  - View pending requests from their team members
- **HR Admins:**
  - Monitor workflow status
  - Handle escalations
  - Generate reports

### 1.6 Integration Requirements
- Email integration:
  - Must use company's internal email server
  - SMTP settings must be configurable
- User Directory Integration:
  - Integrate with existing LDAP/AD for user authentication and roles
- Security:
  - Vacation request data must be encrypted at rest and in transit

## 2. Technical Requirements

### 2.1 Process Modeling
- Implement using BPMN 2.0 standard
- Clear separation of concerns between:
  - User tasks (submission, approval)
  - Gateway logic (approval/rejection/escalation)
  - Service tasks (email notifications)

### 2.2 Data persistence
- All vacation requests and related data must be stored in a relational database
- Use UUID for primary keys to avoid exposing sensitive information

## 3. Workflow Steps

1. **Request Submission**
   - Employee submits vacation request with required details
   - System validates inputs
   - Request status: "Submitted"

2. **Manager Approval**
   - Request routed to direct manager's queue
   - Manager can:
     - Approve (status becomes "Approved")
     - Reject (status becomes "Rejected" with reason)
     - Delegate to secondary approver if unavailable

3. **Escalation Process** 
   - If primary approver doesn't respond after 3 business days:
     - Request routed to secondary approver
   - If secondary approver also doesn't respond after another 3 business days:
     - Escalate to HR Admin

4. **Notification System**
   - Email notifications sent at each state change:
     - Submission notification
     - Approval/Rejection notification
     - Escalation notification

## 4. BPMN Diagram Implementation Notes

- Use pool/choreography for collaboration between employees, managers and HR admins
- Implement gateways for:
  - Approval/rejection decisions
  - Escalation logic based on time out events
- Service tasks for email notifications must include:
  - Message correlation to track notification history
