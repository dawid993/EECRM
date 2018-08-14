trigger EECRM_ProjectTrigger on EECRM_Project__c (
  after delete, after insert, after update, after undelete, before delete, before insert, before update) {
	fflib_SObjectDomain.triggerHandler(EECRM_Projects.class);
}