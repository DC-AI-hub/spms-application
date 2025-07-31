# Smart Process Management System - User View Requirements

## If you are reading this spec, please read the following item first.
Background: background.md  
DataModel: datamodel.md  

## Process Definitions View
### User Perspective  
As a user, I can:  
1. View active process definitions  
2. Initiate new process instances  

### Requirements  
1. The system shall display active process definitions as cards showing:  
   - Process name  
   - Version number  
   - Short description  
   - "Start" action button  
2. When starting a process:  
   a. Clicking "Start" opens a dynamic form dialog  
   b. Clicking "Cancel" closes the dialog without changes  
   c. Clicking "Confirm":  
      - Validates form inputs  
      - Creates a new process instance  
      - Redirects to Process Instances view  
   d. Failed validation displays specific field errors  
   e. Failed creation shows error message with retry option  

## Process Instances View  
### User Perspective  
As a user, I can:  
1. View process instances I've initiated  
2. Monitor instance progress  

### Requirements  
1. The system shall display process instances in a table with:  
   - Instance ID  
   - Process name  
   - Start time (formatted)  
   - Current stage name  
   - Status (Running/Completed/Canceled)  
2. Clicking a table row opens a dialog showing:  
   - Visual stage progression diagram  
   - Stage completion timestamps  
   - Current assignees  

## User Tasks View  
### User Perspective  
As a user, I can:  
1. View tasks assigned to me  
2. Complete or decline tasks  

### Requirements  
1. The system shall display tasks in a table with:  
   - Task title  
   - Related process name  
   - Due date (with overdue highlighting)  
   - Priority indicator (Low/Medium/High)  
   - Actions ("Details", "Decline")  
2. Action behaviors:  
   a. "Details":  
      - Opens task form dialog  
      - Pre-fills available data  
      - Shows completion button  
   b. "Decline":  
      - Opens confirmation dialog  
      - Requires optional reason  
      - Updates task status to "Declined"  
3. Task states:  
   - Pending: Awaiting action  
   - Completed: Successfully finished  
   - Declined: Rejected by user  

---

*Document optimized from original SPEC_9.md version 1.0 - 2025-07-13*
