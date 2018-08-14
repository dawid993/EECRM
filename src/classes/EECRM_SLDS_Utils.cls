public class EECRM_SLDS_Utils {

	@AuraEnabled
    public static List<String> getPicklistValues(String sObjectName,String sObjectFieldName){
        List<String> options = new List<String>();
        Schema.DescribeSObjectResult sObjectDescribe = Schema.getGlobalDescribe().get(sObjectName).getDescribe();
        Schema.DescribeFieldResult fieldDescribe = sObjectDescribe.fields.getMap().get(sObjectFieldName).getDescribe();
        for(Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()){
            options.add(entry.getLabel());
        }
        return options;        
    }

    @AuraEnabled
    public static sObjectWrapper getSObjectsWrapper(Integer limitValue,Integer offsetValue,String sObjectType,List<String> filterByIds){       
        List<sObject> sObjects = getSObjects(null,null,sObjectType,filterByIds);
        Integer totalRecordNumber = sObjects.size();
        sObjects = getSObjects(limitValue,offsetValue,sObjectType,filterByIds);
        sObjectWrapper wrapper = new sObjectWrapper();
        wrapper.totalRecords = totalRecordNumber;
        wrapper.filteredSObjectList = sObjects;

        return wrapper;
    }

    @AuraEnabled
    public static Decimal getInitialBudgetLimit(String priority){
        Decimal maxBudget = 0;
        if(String.isNotBlank(priority)){  
            EECRM_BudgetSettings__c budgetSetting = EECRM_BudgetSettings__c.getInstance(priority);
            maxBudget = budgetSetting != null ? budgetSetting.Max_Budget__c : 0;
        }
        System.debug(maxBudget);
        return maxBudget;
    }

    @AuraEnabled
    public static EECRM_Project__c getProject(Id projectId){
        fflib_QueryFactory queryFactory = new fflib_QueryFactory(Schema.getGlobalDescribe().get('EECRM_Project__c'));
        List<String> fields = new List<String>{'Actual_Cost__c','Actual_hours_effort__c','Category__c','Checksum__c','CreatedById','Description__c','Name'
            ,'Initial_Budget__c','LastModifiedById','Mailbox__c','OwnerId','Planned_Cost__c','Planned_hours_effor__c','Planned_Start_Date__c','Priority__c'
            ,'Project_Name__c','Responsible_Person__c','Start_Date__c','Status__c','Validated__c'};
        queryFactory.selectFields(fields);
        queryFactory.setCondition('Id = :projectId');
        System.debug(projectId);
        EECRM_Project__c project = Database.query(queryFactory.toSOQL());  
        System.debug(project+' '+projectId);
        return project; 
    }

    @AuraEnabled
    public static EECRM_Project__c save(EECRM_Project__c project){
        System.debug(project);
        upsert project;
         System.debug(project);
        return getProject(project.Id);
    }

    private static List<Contact> getSObjects(Integer limitValue,Integer offsetValue,String sObjectType,List<String> filterByIds){
         String query = 'SELECT Id,Name FROM '+ SObjectType 
        + (!filterByIds.isEmpty() ? ' WHERE ID NOT IN :filterByIds' : '')
        + (limitValue != null ? ' LIMIT '+limitValue+' OFFSET '+offsetValue : '');            
        List<sObject> sObjects =  Database.query(query);       
        return sObjects;
    }    

    public class sObjectWrapper{
        @AuraEnabled
        public Integer totalRecords;
        @AuraEnabled
        public List<sObject> filteredSObjectList;
    }
}