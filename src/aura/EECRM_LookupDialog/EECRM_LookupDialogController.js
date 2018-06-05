({
	doInit : function(component, event, helper) {
		var action = component.get("c.getSObjects");
		action.setParams({"limitValue":"10","offsetValue":"0","sObjectType":component.get("v.sObjectType")});
		action.setCallback(this,function(response){				
			component.set("v.contacts", response.getReturnValue());
		});

		$A.enqueueAction(action);
	},

	chooseContact : function(component, event, helper){
		var source = event.currentTarget;			
		var contacts = component.get("v.contacts");		
		var index = source.dataset.index;
		
		var sObjectEvent = component.getEvent('sendSObjectEntity');
		sObjectEvent.setParams(
			{
				"sObjectType" : component.get("v.sObjectType"),
				"sObjectEntity" : component.get("v.contacts")[index]
			});
		sObjectEvent.fire();
	} 
})