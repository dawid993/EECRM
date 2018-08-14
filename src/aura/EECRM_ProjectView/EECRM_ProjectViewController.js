({
	doInit : function(component, event, helper) {		
		var projectId = component.get("v.pageReference").state.id;	
	
		if(projectId){		
			var action = component.get("c.getProject");
			action.setParams({
				"projectId" : projectId 
			});
			
			action.setCallback(this,function(response){			
				var resultFromSFDC = response.getReturnValue();				
				component.set("v.project",resultFromSFDC);	
			});

			$A.enqueueAction(action);
		} 
	}
})