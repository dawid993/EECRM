({
	drawBudgetChangesDiagram : function (component, event, helper) {	
		var fromDate = new Date(2018,0,1);
		var toDate = new Date(2018,11,31);
		var currentDate = new Date();
		console.log(helper.isDateBetween(fromDate,toDate,currentDate)+' '+currentDate.getMonth())
		var currentMonth = helper.isDateBetween(fromDate,toDate,currentDate) ? currentDate.getMonth() : 100;
		
		console.log(currentMonth);
		var action = component.get("c.getBudgetChangeWrapperForProject");
		var project = component.get("v.project");
		
		action.setParams({
			"projectId" : project.Id,
			"fromDateString" : fromDate.toJSON(),
			"toDateString" : toDate.toJSON()
		});
		
		action.setCallback(this,function(response){		
			if(response.getState() == 'SUCCESS'){						
				var wrapperFromSFDC = response.getReturnValue();
				console.log(wrapperFromSFDC);
				var labels = helper.createLabels(fromDate,toDate);				
				var budgetByType = helper.groupBudgetTypes(wrapperFromSFDC.budgetChanges);				
				var initialBudgetXaxis = [];
				var plannedBudgetXaxis = helper.createXaxisForBudget(budgetByType.get('Planned')
						,wrapperFromSFDC.plannedValueBeforeFromDate						
						,currentMonth);
				var actualBudgetXaxis = helper.createXaxisForBudget(budgetByType.get('Actual')
						,wrapperFromSFDC.actualValueBeforeFromDate						
						,currentMonth);
				console.log(plannedBudgetXaxis);
				console.log(actualBudgetXaxis);
				var canvas = document.getElementById('budgetChangeChart');
				helper.createBudgetChangeDiagram(canvas,initialBudgetXaxis,plannedBudgetXaxis,actualBudgetXaxis,labels);				
			}else{
				console.log(response.getError());
			}		
			
		});
		
		$A.enqueueAction(action);		
	}
})