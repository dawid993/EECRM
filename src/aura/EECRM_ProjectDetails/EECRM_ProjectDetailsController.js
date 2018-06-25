({
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
		}
	},

	showResponsiblePersonDialog : function (component, event, helper) {
		component.set("v.showResponsiblePersonDialog", true);		
	},

	closeResponsiblePersonDialog : function (component, event, helper) {
		component.set("v.showResponsiblePersonDialog", false);		
		console.log("test");
	},

	handleLookupSObject: function(component, event, helper){
		var contact = event.getParam("sObjectEntity");
		var contacts = component.get("v.responsiblePersons");	
		contacts.push(contact);		
		component.set("v.responsiblePersons",contacts);
	},

	removeResponsiblePerson : function(component,event,helper){
		var contactId = event.getSource().get("v.value");
		var contacts = component.get("v.responsiblePersons");		
		contacts = contacts.filter(function filterContacts(item) {
			return item.Id != contactId;
		});
		component.set("v.responsiblePersons",contacts);
	}
})