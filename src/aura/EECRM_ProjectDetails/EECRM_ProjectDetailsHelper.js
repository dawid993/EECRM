({
	validateProject : function(component) {	
		var projectValid = this.isPlannedStartDateValid(component);
		projectValid = this.isInitialBudgetValid(component) && projectValid;

		return projectValid;
	},

	isPlannedStartDateValid : function(component){
		var project = component.get("v.project")
		var startDate = project.Start_Date__c;
		var plannedStartDate = project.Planned_Start_Date__c;
		
		var valid = true;
		if(startDate > plannedStartDate){
			this.showError("startDateInput",component);		
			valid = false;
		} 

		return valid;
	},

	isInitialBudgetValid : function(component){
		var valid = true;
		var initialBudget = parseInt(component.get("v.project.Initial_Budget__c"));
		var maxBudget = parseInt(component.get("v.maxBudget"));
		console.log(initialBudget);
		console.log(maxBudget);
		console.log(initialBudget > maxBudget);
		if(initialBudget > maxBudget){			
			this.showError("initialBudgetInput",component);
			valid = false;
		}
		
		return valid;		
	},

	showError : function(fieldName,component){
		var fieldInput = component.find(fieldName);			
		var fieldInputError = component.find(fieldName+'-error');
		$A.util.addClass(fieldInput, 'slds-has-error');	
		$A.util.removeClass(fieldInputError, 'inActiveErrorMsg');
	},

	removeErrorClass : function(fieldNames,component){
		console.log(fieldNames)
		fieldNames.forEach(element => {
			var inputField = component.find(element);
			var inputFieldError = component.find(element+'-error');
			$A.util.removeClass(inputField, 'slds-has-error');
			$A.util.addClass(inputFieldError, 'inActiveErrorMsg');	
		});
	},

	setInitialBudgetLimit : function(component){
		var initialBudgetAction = component.get("c.getInitialBudgetLimit");
		initialBudgetAction.setParams({"priority" : component.get("v.project.Priority__c")});
		console.log(component.get("v.project.Priority__c"));		
		initialBudgetAction.setCallback(this,function(response){
			console.log(response.getReturnValue());
			component.set("v.maxBudget",response.getReturnValue());
		})

		$A.enqueueAction(initialBudgetAction);
	},
    
    createCanvasCostDiagram : function(canvasElement,initialBudget,plannedCost,actualCost){
        var myChart = new Chart(canvasElement, {
			type: 'bar',
			data: {
				labels: ["Initial Budget", "Planned Cost", "Actual Cost"],
				datasets: [{
					label: 'Project\'s cost',
					data: [initialBudget, plannedCost, actualCost],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)'						
					],
					borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)'						
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
    },
    
    createPicklist : function(sObjectName,sObjectFieldName,fieldLabel,selectedValues,containerId,cmp){
    	$A.createComponent(
            "c:PicklistComponent",
            {
            	"sObjectName" : sObjectName,
                "sObjectFieldName": sObjectFieldName,
                "fieldLabel": fieldLabel,
                "selectedValues": selectedValues                
            },function(newPicklist, status, errorMessage){
            	if (status === "SUCCESS") {
                    var body = cmp.find(containerId);
                    body.set("v.body",newPicklist);                
                }
            })
    }
})