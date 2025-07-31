# Smart Process Management System Spec Orginzation Chart

## If you are reading this spec, please read the following item first.
Background: background.md

DataModel: datamodel.md


## SPEC Definition - Orginzation Chart Display 
1. As an administrator, I can view the orginzation chart in orginzation module , it can display in a new tab named "Orginzation Chart".
2. In the top of Orginzation Chart, it shall have a select box, display all the Group Company, and default to select the first one,
3. In the top of Orginzation Chart ,it must include a switch, in order to control the chart display style, one is "Functional", one is "Realistic“
4. the "Orginzation Chart" MUST display the selcted Group Company and follow the the hirachy when using the Realistic:   
    a. Company With "Group" Type must be the root node, and display all it's sub companies there.
    b. The business entity must display all it's "Local" type departments.
    c. The Department also dispaly all it's "Local" type departments

example of hirachy --- [ Realistic ] 
 ```   
Group --> 
    Business Entity [ITD -SZ]
        Department A [Local - L1]
            Department AA [Local - L2]
                Department AAA [Local L3]
                    Department AAAA  [L4]
            Department AB [Local -L2]
    Business Entity [ITD - SH]
        Department Q (Local -L1)
    Business Entity [Holding]  
        Business Entity [A]
            Department 
        Business Entity [B]
 ```           
5. the "Orginzation Chart" MUST display the selcted Group Company and follow the the hirachy when using the Functional:
    a. Company With "Group" Type must be the root node and display all it's division there.
    b. The Division must display all it's "Functional" type departments.
    c. 
example of hirachy --- [ Functional ]
```
Group 
    Division (IT) John Hsu
        Department - Function (ITD-SZ & SH) Ding He
        Department - Function (Application) -- No 
            Department - Function (Application Engineering & Application Integration) Kitch Chow
                Department - Function (Application Enginnering) Richard Lai
                    Team (DevOps) ShunXu Guo
                        - Jeff 
            Department function 
        Departmenet Function - LME IT  (If there have no leader , report line will loop up )
            Department Function - LMEC Chris
                Department Function - Development & Engineering -- ???
                    Department Function - Development Tools -- 
        
```
 