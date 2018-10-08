({
	doInit : function(component, event, helper) {		
	console.log("PROJECTVIEW");
		var projectId = component.get("v.pageReference").state.id;	
	
		if(projectId){		
			var action = component.get("c.getProject");
			action.setParams({
				"projectId" : projectId 
			});
			
			action.setCallback(this,function(response){			
				var resultFromSFDC = response.getReturnValue();				
				component.set("v.project",resultFromSFDC);
				helper.createPicklist(resultFromSFDC,component.find('project-container'));
				console.log("PROJECTVIEW3");	
			});

			$A.enqueueAction(action);
		}
		
		console.log("PROJECTVIEW2"); 
	}
})