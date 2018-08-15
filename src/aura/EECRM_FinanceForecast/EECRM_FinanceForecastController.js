({
	drawBudgetChangesDiagram : function (component, event, helper) {	
		var fromDate = new Date(2018,0,1);
		var toDate = new Date(2018,11,31);
		
		var action = component.get("c.getBudgetChangesForProject");
		var project = component.get("v.project");
		
		action.setParams({
			"projectId" : project.Id,
			"fromDate" : fromDate,
			"toDate" : toDate
		});
		
		action.setCallback(this,function(response){
			if(response.getState() == 'SUCCESS'){
				console.log('cz');
				var labels = helper.createLabels(fromDate,toDate);
				console.log(labels);
				var budgetByType = helper.groupBudgetTypes(response.getReturnValue());
				console.log(budgetByType);
				var initialBudgetXaxis = [];
				var plannedBudgetXaxis = helper.createXaxisForBudget(budgetByType.get('Planned'));
				var actualBudgetXaxis = helper.createXaxisForBudget(budgetByType.get('Actual'));
				var canvas = document.getElementById('budgetChangeChart');
				helper.createBudgetChangeDiagram(canvas,initialBudgetXaxis,plannedBudgetXaxis,actualBudgetXaxis,labels);				
			}			
		});
		
		$A.enqueueAction(action);		
	}
})