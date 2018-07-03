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
    public static List<Contact> getSObjects(Integer limitValue,Integer offsetValue,String sObjectType){
        String query = 'SELECT Id,Name FROM '+ SObjectType + ' '+' LIMIT '+limitValue+' OFFSET '+offsetValue;        
        List<sObject> sObjects =  Database.query(query);       
        return sObjects;
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
}