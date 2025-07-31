# Smart Process Management System Spec Divisions

## If you are reading this spec, please read the following item first.
Background: background.md
DataModel: datamodel.md

## SPEC Definition - List & Create Division
1. As an administrator , I can create division under a "Group". ps: "Group" is a company with CompanyType "Group", please reference to SPEC_1.md
2. As an administrator , I needs:
    a. the system can view the division list in a orginzation module which tab named Divisions,
    b. the list page can have at least the following columns [ "Division Name", "Division Type", "Active", "LastModified", "Related To" "Edit"  ], 
    c. the Related to means that which Company the division under then.
    d. the list MUST have a check all function ,that we can operation in bulk,
    e. in the right top of list , we needs three buttons [ "Create Division", "Operation", "Delete" ], 
    f. in the left top of list ,we needs a search box ,that can fuzzy search the Division.
    i. the list MUST have pagenation.
3. The "Create Division Form " must include a Selector that can select the company for update.

## SPEC Definition - Edit & Delete Division
1. As an administrator, I needs :
    a. I can click the "edit" in the action column and popup the "Division Data" Edit Form, the Form shall the same fields and layout as the "Create Division" Form 
    b. The DivisionName Cannot be edit during edit.
    c. There have two buttons in the form, "Confirm" will close the form and update the division data to data base and update the list. "Cancel" close the form
2. As an administrtor, I needs :
    a. I can click  click the "delete" in the action column and popup an confirm form ,containing "Are you sure to delete the [DivisionName]?" with two button, Confirm will delete the record to database , Cancle will close the form.
    b. I can select the multi record and click the delete button in the top of list, then popup a confirm form ,containing "Are you sure to delete the Flowing Companies?" [Division A][Division B]...., Confirm will delete the records to database , Cancle will close the form.


## SPEC Definition - Division Business
1. As a division , it can only create under a GROUP type company 
2. As a division , it can assign a user to as an Division Head.





 

