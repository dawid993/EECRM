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

		var action = component.get("c.getSObjectsWrapper");
		action.setParams({
			"limitValue":pageLimit,
			"offsetValue":offsetValue,
			"sObjectType":sObjectType,
			"filterByIds":filterIds
		});

		action.setCallback(this,function(response){		
			var wrapperFromSfdc = response.getReturnValue();			
			var totalPages =  parseInt(wrapperFromSfdc.totalRecords / pageLimit);			
			totalPages += wrapperFromSfdc.totalRecords % pageLimit != 0 ? 1 : 0;			
			component.set("v.totalPages",totalPages);
			component.set("v.contacts", wrapperFromSfdc.filteredSObjectList);
		});

		$A.enqueueAction(action); 
	}	
})