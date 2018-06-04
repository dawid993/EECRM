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
	}
})