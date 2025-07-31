# Smart Process Management System Spec Company

## If you are reading this spec, please read the following item first.
Background: background.md
DataModel: datamodel.md

## SPEC Definition - List & Create Company 
<pre>
1. As the Administrators, we needs:
    a. the system can view the company list in a orginzation module which tab named Company Name, 
    b. the list page can have at least the following columns [ "CompanyName", "CompanyType", "Active", "LastModified", "Edit"  ],
    c. the list MUST have a check all function ,that we can operation in bulk,
    e. in the right top of list , we needs three buttons [ "Create Company", "Operation", "Delete" ],
    f. in the left top of list ,we needs a search box ,that can fuzzy search the company.
    i. the list MUST have pagenation.
    
2. As the Administrators, we needs the system can filled the company information and create a new company once I click the "Create Company" Button.
    a. when we click the create button ,it shall be a popup page, that disaplay fields.
3. The column name, button lable should be tranlated into different Language
4. Column Name must be translated

</pre>  


## SPEC Definition - Edit & Delete Company 
<pre>
1. As an administrator, I needs :
    a. I can click the "edit" in the action column and popup the "Company Data" Edit Form, the Form shall the same fields and layout as the "Create Company" Form 
    b. The CompanyName Cannot be edit during edit.
    c. There have two buttons in the form, "Confirm" will close the form and update the company data to data base and update the list. "Cancel" close the form
2. As an administrtor, I needs :
    a. I can click  click the "delete" in the action column and popup an confirm form ,containing "Are you sure to delete the [CompanyName]?" with two button, Confirm will delete the record to database , Cancle will close the form.
    b. I can select the multi record and click the delete button in the top of list, then popup a confirm form ,containing "Are you sure to delete the Flowing Companies?" [Company A][Company B]...., Confirm will delete the records to database , Cancle will close the form.

</pre>

## SPEC Definition - Import Company 
<pre>
1. As an administrator , I needs : 
    a. an "import" menu under the operation in "Company Tab",
    b. once I clic the "import" button will popup a new dialog for me to upload a file , it needs to suppor the drag drop function, the diaglog must include the cancle and complete
    c. the file must support the csv & excel.
    d, once I drop or upload file commit, it shall decode the files and preview data in data table ,format is the same as company list.
    e, if the data is incorrect , please let the line red, or if confict please let the row yellow , or if looks good ,please let it green.
    f. once I click the summit ,create the company using exsiting api using the correct data.
    g. once I click cancle , close the dialog and donothing.

</pre>

## SPEC Definition - Company business 
<pre>
1. A company with a type "Group" must be a kind of Top of company, it cannot related to other company.
2. A company with a type "Business Entity" must under a Company with type "Group" or "Business Entity".
3. A company with a type "Vendor" must under a Company with type "Group" or "Business Entity"
4. A company with a type "Customer" MUST under a Company with the type "Group" or "Business Entity" 
5. A company with a type "Other" must under a Company with type  "Group"

As a administor , When I  create a company , if a type related to other company, I can select the related company type in a form .
</pre>