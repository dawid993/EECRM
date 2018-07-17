({
	doInit : function(component, event, helper) {
		helper.getSObjectFromSfdc(component);
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
		var filterSObjects = component.get("v.filterSObjects");		
		sObjectEvent.fire(); 
		helper.getSObjectFromSfdc(component);
	} 
})