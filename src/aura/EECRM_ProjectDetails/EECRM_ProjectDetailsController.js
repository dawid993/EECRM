({
	doInit: function(component,event,helper){
		helper.setInitialBudgetLimit(component);
	},

	handleStatusPicklistEvent: function (component, event, helper) {
		switch (event.getParam("sObjectFieldName")) {
			case "Category__c": {
				component.set("v.project.Category__c", event.getParam("picklistValue"));
				break;
			}
			case "Status__c": {
				component.set("v.project.Status__c", event.getParam("picklistValue"));
				break;
			}
			case "Priority__c":{
				component.set("v.project.Priority__c", event.getParam("picklistValue"));
				helper.setInitialBudgetLimit(component);
			}
		}
	},

	showResponsiblePersonDialog : function (component, event, helper) {
		component.set("v.showResponsiblePersonDialog", true);		
	},

	closeResponsiblePersonDialog : function (component, event, helper) {
		component.set("v.showResponsiblePersonDialog", false);	
		
	},

	handleLookupSObject: function(component, event, helper){
		var contact = event.getParam("sObjectEntity");
		var contacts = component.get("v.responsiblePersons");	
		contacts.push(contact);		
		console.log(contact);
		component.set("v.responsiblePersons",contacts);
	},

	removeResponsiblePerson : function(component,event,helper){
		var contactId = event.getSource().get("v.value");
		var contacts = component.get("v.responsiblePersons");		
		contacts = contacts.filter(function filterContacts(item) {
			return item.Id != contactId;
		});
		component.set("v.responsiblePersons",contacts);
	},

	saveProject : function(component,event,helper){
		var inputFieldNames = ["startDateInput","initialBudgetInput"];
		helper.removeErrorClass(inputFieldNames,component);
		helper.validateProject(component);
	}	
})