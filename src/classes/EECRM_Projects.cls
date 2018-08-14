public class EECRM_Projects extends fflib_SObjectDomain {

    public static final String INITIAL_BUDGET_TYPE = 'Initial';
    public static final String PLANNED_BUDGET_TYPE = 'Planned';
    public static final String ACTUAL_BUDGET_TYPE = 'Actual';

    public static final String INITIAL_BUDGET_FIELD = 'Initial_Budget__c';
    public static final String PLANNED_BUDGET_FIELD = 'Planned_Cost__c';
    public static final String ACTUAL_BUDGET_FIELD = 'Actual_Cost__c';

    public EECRM_Projects(List<EECRM_Project__c> sObjectList) {
        super(sObjectList);
    }

    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new EECRM_Projects(sObjectList);
        }
    }

    public override void onApplyDefaults(){
        
    }

    public override void onBeforeInsert(){
        assigneDefaultResponsiblePerson();
        calculateChecksum();        
    }

    public override void onAfterInsert(){
        saveBudgetChanges(records,new Map<Id,sObject>());
    }

    public override void onAfterUpdate(Map<Id,SObject> existingRecords){
        saveBudgetChanges(records,existingRecords);
    }

    public override void onValidate(){
        validateProjectName();
    } 

    private void assigneDefaultResponsiblePerson(){
        for(SObject currentRecord : Records){
            if(currentRecord.get('Responsible_Person__c') == null){
                currentRecord.put('Responsible_Person__c',getDefaultResponsiblePerson().ID);
            }     
        }    
    } 

    private void saveBudgetChanges(List<SObject> newRecords,Map<Id,SObject> oldRecords){
        List<EECRM_Project_Budget_Change__c> budgetChanges = new List<EECRM_Project_Budget_Change__c>();
        for(SObject currentRecord : newRecords){    
              EECRM_Project__c project = (EECRM_Project__c) currentRecord;       
              if(!oldRecords.containsKey(project.Id)){
                  budgetChanges.add(createAndReturnBudgetChange(null,project.Initial_Budget__c,INITIAL_BUDGET_TYPE,project.Id));
                  budgetChanges.add(createAndReturnBudgetChange(null,project.Planned_Cost__c,PLANNED_BUDGET_TYPE,project.Id));
                  budgetChanges.add(createAndReturnBudgetChange(null,project.Actual_Cost__c,ACTUAL_BUDGET_TYPE,project.Id));
              }else{
                  sObject oldRecord = oldRecords.get(project.Id);
                  checkIfFieldIsChangedAndAdd(currentRecord,oldRecord,INITIAL_BUDGET_FIELD,budgetChanges);
                  checkIfFieldIsChangedAndAdd(currentRecord,oldRecord,PLANNED_BUDGET_FIELD,budgetChanges);
                  checkIfFieldIsChangedAndAdd(currentRecord,oldRecord,ACTUAL_BUDGET_FIELD,budgetChanges);
              } 
        }

        insert budgetChanges;
    }

    private void checkIfFieldIsChangedAndAdd(SObject currentRecord,SObject oldRecord,String fieldName
                ,List<EECRM_Project_Budget_Change__c> budgetChanges){                    
        if(isFieldChanged(currentRecord,oldRecord,fieldName)){
            budgetChanges.add(createAndReturnBudgetChange(
                (Decimal)oldRecord.get(fieldName),
                (Decimal)currentRecord.get(fieldName),
                getTypeByFieldName(fieldName),
                (String) currentRecord.get('Id')));           
        }
    }

    private String getTypeByFieldName(String fieldName){
        if(fieldName.equals(INITIAL_BUDGET_FIELD)) return INITIAL_BUDGET_TYPE;
        if(fieldName.equals(PLANNED_BUDGET_FIELD)) return PLANNED_BUDGET_TYPE;
        if(fieldName.equals(ACTUAL_BUDGET_FIELD)) return ACTUAL_BUDGET_TYPE;

        return null;
    }

    private Boolean isFieldChanged(SObject currentRecord,SObject oldRecord,String fieldName){
        return currentRecord.get(fieldName) != oldRecord.get(fieldName);
    }

    private EECRM_Project_Budget_Change__c createAndReturnBudgetChange(Decimal oldValue, Decimal newValue,String type,ID projectId){
        EECRM_Project_Budget_Change__c budgetChange = new EECRM_Project_Budget_Change__c();
        budgetChange.EECRM_Project_ref__c = projectId;
        budgetChange.New_Value__c = newValue;
        budgetChange.Old_Value__c = oldValue;
        budgetChange.Budget_Type__c = type;

        return budgetChange;
    }

    private void validateProjectName(){
        Map<String,sObject> projects = new Map<String,sObject>();
        for(SObject currentRecord : Records){
            String projectName = (String) currentRecord.get('Project_Name__c');

            if(String.isBlank(projectName)){
                currentRecord.addError('Project Name is empty. Please fill it.');
            }           
            if(projects.containsKey(projectName)){
                currentRecord.addError('You are trying to duplicate projects names.');
            }else{
                projects.put(projectName,currentRecord);
            }   
        }

        List<sObject> duplicatedProjects = EECRM_SRV_ProjectsService.getInstance().getProjectsByNames(projects.keySet()); 
        System.debug(duplicatedProjects);       
        if(!projects.isEmpty()){
            for(sObject duplicatedProject : duplicatedProjects){
                String key = (String) duplicatedProject.get('Project_Name__c');
                if(projects.containsKey(key) && projects.get(key).ID != duplicatedProject.ID){
                    projects.get(key).addError('Duplicated Project Name : '+key); 
                }
            }            
        }
    } 

    private void calculateChecksum(){
        for(SObject currentRecord : Records){
            String hashTarget = buildHashTarget(currentRecord);            
            String hashBase64SHA1 = EECRM_UTL_Utils.generateHashBase64SHA1(hashTarget);
            currentRecord.put('Checksum__c',hashBase64SHA1);
        }   
    }
 
    private String buildHashTarget(SObject record){
        String category = (String) record.get('Category__c');      
        return EECRM_UTL_Utils.sortMultiPiclistAlphabetically(category) 
            + '' + record.get('Project_Name__c');
    }   

    private Contact getDefaultResponsiblePerson(){
        List<Contact> globalManager = [SELECT Id,UniqueId__c FROM Contact WHERE Global_Manager__c = true LIMIT 1];
        if(globalManager.isEmpty()){
            return new Contact();
        }else{
            return globalManager[0];
        }
        
    } 
}