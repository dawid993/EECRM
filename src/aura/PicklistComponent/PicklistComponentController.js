({
	doInit : function(component, event, helper) {		
		var action = component.get("c.getPicklistValues");
        action.setParams({
            "sObjectName": component.get("v.sObjectName"),
            "sObjectFieldName": component.get("v.sObjectFieldName")            
        });
        
        var currentEntity = component.get("v.currentEntity");
           
        var selectedValuesSet = new Set();
        
        if(currentEntity){
        	selectedValuesSet.add(currentEntity[component.get("v.sObjectFieldName")]);
        }
        
        
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
            console.log('123');            
        }); 
             
        $A.enqueueAction(action);        	  
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