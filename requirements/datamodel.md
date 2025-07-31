# SPMS Data model


## Principal 
All Data Module Shall include audit trail, fields shall be:

```
    private Boolean active;
    private LocalDateTime lastModified;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdTime;
```


## User Data Model
Name: String - unique,
Description: String,
Email: String - unique,
UserType: enumable one of [ "Staff", "Vendor", "Machine" ]
UserProfiles : Key Value pair Array e.g. [ "IDNumber":"BX1231231231" ]

## Company Data Model
Name: String - unique,
Description: string, 
Location: string
LanguageTags : Key Value pair Array, e.g. ["en": "Xiaomi Grup", cn:"小米集团"]
CompanyType: enumable one of [ "Group", "Business Entity", "Vendor", "Customer", "Other" ]
CompanyProfiles : Key Value pair Array e.g. [ "BusinessLincess":"BX1231231231" ]

## Division Data Model
Name: String - unique,
Description: String, 
LanguageTags : Key Value pair Array, e.g. ["en": "Human Resource", cn:"人力资源"]
type: enumable one of [ Core, Business,Technology, strategy, Support]
Profiles : Key Value Pair Array e.g. [ "Capibility":"xxxx" ]

## Role Data Model
Name: String - unique,
Description: String, 
LanguageTags : Key Value pair Array, e.g. ["en": "Administrator", cn:"管理员"]
Applicate: Enumable One of [ Human, Machine Account, Other ]
Attributes:  Key Value Pair Array e.g. [ "Capibility":"xxxx" ]

### Departments Data Model
ID: String - unique
Division: String, indicating the company ID which the Division is belong to.
Name: String
Tags: Key value pairs in array format, like: ["primary location": "HK"]
parent: companyId or divisionId
Type: String an fixed enum type including: OU, [Functional, Local, Team and Other]
Level: Integer, value from 1-4, indicating the hirerachy of the Division.

### System Statistics Data Model
ID: String - unique
Name: String            ## Name of the static data
Description: String     ## Description of the static data
AsOfDate: Date          ## The date of the static data
Value: Long             ## The value of the static data 


## User Activity Data Model 
ID: String - unique
User: String                 ## The user ID who perform the action
Action: String               ## The action performed by the user
Description: String          ## The description of the action  
CreatedAt: unixtimestamp     ## The date of the action
EntityId: String             ## The entity ID of the action
EntityType: String           ## The entity type of the action
Details: String              ## The details of the action


#### Example data
The following indentation based strucutre are an example of the previous model definition. 
1st level of indentation indicate an Division, 
2nd level of indentation indicates the first level Department
3rd level of indentation indicates the second level Team
4th level of indentation indicates the third level of Section

ITD Shenzhen / Shanghai (Division)
  Post-Trade System (Department)
  Market System
  Application Engineer
  Application Integration
  Listing & Corporate System
  Information Security
  Infrastructure & Operations
    Technology Service Management (Team)
    Infrastructure Critical Service
    System & Network Operations
  CHC | QME Support
  Data Engineering
  Testing COE
    HK Testing
    LME/LMEC Testing
    LME Engineering
  ITD Shanghah
  ITD SZ/SH Management Office
    Third-Party Management