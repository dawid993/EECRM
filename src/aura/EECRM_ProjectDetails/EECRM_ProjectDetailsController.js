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
		var valid = helper.validateProject(component);		
		if(valid){			
			var project = component.get("v.project");
			var action = component.get("c.save");
			action.setParams({
				"project":project
			});
	
			action.setCallback(this,function(response){			
				if(response.getState() == 'SUCCESS'){
					var resultFromSFDC = response.getReturnValue();	
					component.set('v.project',resultFromSFDC);	
				}							
			});
	
			$A.enqueueAction(action);
		}

	},

	openContactPage : function(component,event,helper){
		var contactId = event.currentTarget.dataset.contactid;
		if(contactId){	
			var pageReference= {
				type: 'standard__recordPage',
				attributes: {
					objectApiName:'Contact',
					actionName:'view',
					recordId : contactId 
				},
			};			
			var navigationService = component.find("navigationService");
			navigationService.navigate(pageReference);
		}		
	},

	drawCostDiagram : function (component, event, helper) {	      
		var currentDiagram = document.getElementById("doughnutChart");         
        var initialBudget = component.get("v.project.Initial_Budget__c");
		var plannedCost = component.get("v.project.Planned_Cost__c");
		var actualCost = component.get("v.project.Actual_Cost__c");
        
		if(currentDiagram){
			currentDiagram.remove(); 
		} 
		
		document.getElementById("canvas").innerHTML = "<canvas id='doughnutChart' width='50' height='50'></canvas>";
		currentDiagram = document.getElementById("doughnutChart"); 
		helper.createCanvasCostDiagram(currentDiagram,initialBudget,plannedCost,actualCost);
	} 	
})