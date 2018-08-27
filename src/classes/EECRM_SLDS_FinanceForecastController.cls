public with sharing class EECRM_SLDS_FinanceForecastController {
	
    @AuraEnabled
    public static List<EECRM_Project_Budget_Change__c> getBudgetChangesForProject(ID projectId,Date fromDate,Date toDate){
    	Schema.SObjectType budgedChangeType = Schema.getGlobalDescribe().get('EECRM_Project_Budget_Change__c');
    	fflib_QueryFactory queryFactory = new fflib_QueryFactory(budgedChangeType);
    	List<String> fields = new List<String>{'Budget_Type__c','CreatedById','EECRM_Project_ref__c','LastModifiedById','New_Value__c',
    		'Old_Value__c','OwnerId','Name','CreatedDate','Change_Date__c'};
    	queryFactory.selectFields(fields);
        queryFactory.setCondition('EECRM_Project_ref__c = :projectId AND DAY_ONLY(Change_Date__c) >= :fromDate AND DAY_ONLY(Change_Date__c) <= :toDate ' +
    			 'AND Change_Date__c != NULL');
        queryFactory.addOrdering(budgedChangeType.getDescribe().fields.getMap().get('Change_Date__c'),fflib_QueryFactory.SortOrder.ASCENDING);        
        List<EECRM_Project_Budget_Change__c> budgetChanges = Database.query(queryFactory.toSOQL());
        return budgetChanges;
    }
    
    @AuraEnabled
    public static BudgetChangangeWrapper getBudgetChangeWrapperForProject(ID projectId,String fromDateString,String toDateString){       
    	BudgetChangangeWrapper wrapper = new BudgetChangangeWrapper();
    	try{
    		Date fromDate = Date.valueOf(fromDateString);
    		Date toDate = Date.valueOf(toDateString);	
    		System.debug(fromDate+' '+toDate);
    		System.debug(fromDateString+' '+toDateString);
    		wrapper.budgetChanges = getBudgetChangesForProject(projectId,fromDate,toDate);    		
    		wrapper.initialValueBeforeFromDate = getLastValueForBudgetChangeBeforeDate(projectId,fromDate,
    			EECRM_UTL_GeneralUtils.BUDGET_TYPE_INITIAL);
    		wrapper.plannedValueBeforeFromDate = getLastValueForBudgetChangeBeforeDate(projectId,fromDate,
    			EECRM_UTL_GeneralUtils.BUDGET_TYPE_PLANNED);
    		wrapper.actualValueBeforeFromDate = getLastValueForBudgetChangeBeforeDate(projectId,fromDate,
    			EECRM_UTL_GeneralUtils.BUDGET_TYPE_ACTUAL);      		 
    		return wrapper;
    	}catch(QueryException ex){
    		throw new EECRM_SLDS_RequestException('Exception in retrieving data.',ex);
    	}catch(Exception ex){
    		throw new EECRM_SLDS_RequestException('Unknow Exception', ex);
    	}
    } 
    
    private static Decimal getLastValueForBudgetChangeBeforeDate(ID projectId,Date budgetDate,String budgetType){
    	String condition = 'DAY_ONLY(Change_Date__c) < :budgetDate AND Budget_Type__c = :budgetType';
    	return getValueForBudgetChange(projectId,budgetDate,budgetType,condition,fflib_QueryFactory.SortOrder.DESCENDING);
    }
    
    private static Decimal getFirstValueForBudgetChangeAfterDate(ID projectId,Date budgetDate,String budgetType){
    	String condition = 'DAY_ONLY(Change_Date__c) > :budgetDate AND Budget_Type__c = :budgetType';
    	return getValueForBudgetChange(projectId,budgetDate,budgetType,condition,fflib_QueryFactory.SortOrder.ASCENDING);
    }
    
    private static Decimal getValueForBudgetChange(ID projectId,Date budgetDate,String budgetType,String condition,
    		fflib_QueryFactory.SortOrder sortOrder){
    			
    	Schema.SObjectType budgedChangeType = Schema.getGlobalDescribe().get('EECRM_Project_Budget_Change__c');
    	fflib_QueryFactory queryFactory = new fflib_QueryFactory(budgedChangeType);
    	List<String> fields = new List<String>{'New_Value__c'};
    	queryFactory.selectFields(fields);
    	queryFactory.setCondition('EECRM_Project_ref__c = :projectId AND '+condition+
    			 ' AND Change_Date__c != NULL');
       	queryFactory.addOrdering(budgedChangeType.getDescribe().fields.getMap().get('Change_Date__c'),sortOrder);
       	queryFactory.setLimit(1);
       	List<EECRM_Project_Budget_Change__c> budgetChanges = Database.query(queryFactory.toSOQL());
       	       		 
       	if(budgetChanges != null && !budgetChanges.isEmpty()){ 
       		return budgetChanges[0].New_Value__c; 
       	}else{
       		return 0;
       	}
    }
    
    public class BudgetChangangeWrapper{   	
    	@AuraEnabled    	
    	public List<EECRM_Project_Budget_Change__c> budgetChanges;
    	
    	@AuraEnabled    	
    	public Decimal initialValueBeforeFromDate;
    	
    	@AuraEnabled    	
    	public Decimal plannedValueBeforeFromDate;
    	
    	@AuraEnabled    	
    	public Decimal actualValueBeforeFromDate; 	
    	
    }    
    
}