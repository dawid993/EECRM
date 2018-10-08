({
	doInit : function(component, event, helper) {
		console.log("PICKLIST");
		var action = component.get("c.getPicklistValues");
        action.setParams({
            "sObjectName": component.get("v.sObjectName"),
            "sObjectFieldName": component.get("v.sObjectFieldName")            
        });
        
        var selectedValues = component.get("v.selectedValues");        
        var selectedValuesSet = new Set();
        selectedValuesSet.add(selectedValues);
        console.log(selectedValues);
        
        var opts=[];
        var picklistField = component.find("select-input");
        
        action.setCallback(this, function(a) {
            opts.push({
                class: "optionClass",
                label: "--- None ---",
                value: ""
            });
            for(var i=0;i< a.getReturnValue().length;i++){
            	var currentValue =  a.getReturnValue()[i];
                opts.push({"class": "optionClass", label: currentValue, value: currentValue, 
                	selected: selectedValuesSet.has(currentValue)});
            }
            picklistField.set("v.options", opts);
            console.log("PICKLIST3"); 
        });        
        $A.enqueueAction(action);
        console.log("PICKLIST2"); 
	},
    
    onPicklistChange : function(component, event, helper){     
        var event = component.getEvent("sendPicklistValue");
        var picklistInput = component.find('select-input');
        event.setParams({"picklistValue" : picklistInput.get("v.value"),
                        "sObjectName": component.get("v.sObjectName"),
                        "sObjectFieldName": component.get("v.sObjectFieldName")});
        event.fire();     
	}

})