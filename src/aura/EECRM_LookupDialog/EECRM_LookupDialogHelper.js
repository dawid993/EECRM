({
	getSObjectFromSfdc : function(component) {
		var sObjectType = component.get("v.sObjectType");
		var filterSObjects = component.get("v.filterSObjects");
		var currentPage = component.get("v.currentPage");
		var pageLimit = component.get("v.pageLimit");
		var offsetValue = pageLimit * (currentPage - 1);

		var filterObjects = component.get("v.filterSObjects");
		var filterIds = [];

		filterObjects.forEach(element => {
			filterIds.push(element.Id);			
		});		

		var action = component.get("c.getSObjects");
		action.setParams({
			"limitValue":pageLimit,
			"offsetValue":offsetValue,
			"sObjectType":sObjectType,
			"filterByIds":filterIds
		});

		action.setCallback(this,function(response){				
			component.set("v.contacts", response.getReturnValue());
		});

		$A.enqueueAction(action);
	}
})