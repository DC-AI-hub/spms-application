# Smart Process Management System Spec Department

## If you are reading this spec, please read the following item first.
Background: background.md
DataModel: datamodel.md

## SPEC Definition - List & Create Department
1. As an administrator , I can create Department under a Division. ps: business unit is kind of company , please reference to SPEC_2.md
2. As an administrator , I needs:
    a. the system can view the deparment list in a orginzation module which tab named Department,
    b. the list page can have at least the following columns [ "Department Name", "Department Type", "Active", "LastModified", "Related To" "Edit"  ], 
    c. the Related to means that which division the Department under then.
    d. the list MUST have a check all function ,that we can operation in bulk,
    e. in the right top of list , we needs three buttons [ "Create Department", "Operation", "Delete" ], 
    f. in the left top of list ,we needs a search box ,that can fuzzy search the Department.
    i. the list MUST have pagenation.
3. The "Create Department Form " must include a selector to select muti types,
    a. if selected type include the "Functional" type, I MUST choose a division as it's parent
    b. if selected type include the "Local" type , I MUST choose a Company as it's parent or choose a "Local" Department as it's parent.
    c. If seelcted type is "Team" type, clean all other types, and MUST choose a Department as it's parent.
    d. If selected type is "Other" type , clean all other types, and MUST choose a Company as it's parent.

