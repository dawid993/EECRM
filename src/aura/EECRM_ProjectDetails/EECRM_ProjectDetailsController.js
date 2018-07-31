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

	myAction: function (component, event, helper) {
		var ctx = document.getElementById("doughnutChart");
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
				datasets: [{
					label: '# of Votes',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
	}
})