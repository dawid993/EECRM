({
	drawBudgetChangesDiagram : function (component, event, helper) {	
		var fromDate = new Date(2018,0,1);
		var toDate = new Date(2018,11,31);
		
		var action = component.get("c.getBudgetChangeWrapperForProject");
		var project = component.get("v.project");
		
		action.setParams({
			"projectId" : project.Id,
			"fromDateString" : fromDate.toJSON(),
			"toDateString" : toDate.toJSON()
		});
		
		action.setCallback(this,function(response){		
			if(response.getState() == 'SUCCESS'){						
				helper.drawBudgetChangeDiagram(response,fromDate,toDate);		
			}else{
				console.log(response.getError());
			}		
			
		});
		
		$A.enqueueAction(action);		
	}
})