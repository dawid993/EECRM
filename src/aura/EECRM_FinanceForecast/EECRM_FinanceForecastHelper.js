({
	drawBudgetChangeDiagram : function(responseData,fromDate,toDate){
		var wrapperFromSFDC = responseData.getReturnValue();
		var currentDate = new Date();		
		var currentMonth = this.isDateBetween(fromDate,toDate,currentDate) ? currentDate.getMonth() : 
			(this.isDateBefore(fromDate,currentDate) ? 100 : -1);		
		
		if(wrapperFromSFDC){
			var labels = this.createLabels(fromDate,toDate);				
			var budgetByType = this.groupBudgetByTypes(wrapperFromSFDC.budgetChanges);	
			
			var initialBudgetXaxis = this.createXaxisForBudget(budgetByType.get('Initial')
					,wrapperFromSFDC.initialValueBeforeFromDate						
					,currentMonth);
			
			var plannedBudgetXaxis = this.createXaxisForBudget(budgetByType.get('Planned')
					,wrapperFromSFDC.plannedValueBeforeFromDate						
					,currentMonth);
			
			var actualBudgetXaxis = this.createXaxisForBudget(budgetByType.get('Actual')
					,wrapperFromSFDC.actualValueBeforeFromDate						
					,currentMonth);		
			
			var currentDiagram = document.getElementById('budgetChangeChart');
			
			if(currentDiagram){
				currentDiagram = this.recreateDiagram(currentDiagram);
			}
			
			this.createBudgetChangeDiagram(currentDiagram,initialBudgetXaxis,plannedBudgetXaxis,actualBudgetXaxis,labels);
		}
	},
	
	recreateDiagram : function(currentDiagram){
		currentDiagram.remove(); 
		var canvasElement = "<canvas id='budgetChangeChart' width='50' height='50'></canvas>";
		document.getElementById("budgetChanges").innerHTML = canvasElement;
		return  document.getElementById('budgetChangeChart'); 		
	},
	
	createBudgetChangeDiagram : function(canvasElement,initialBudgetChanges,plannedCostChanges,actualCostChanges,labels){
       var options = JSON.parse(JSON.stringify(budgetTypeDiagramOptions));
       
       var data = {
		  labels: labels,
		  datasets: JSON.parse(JSON.stringify(budgetChangeChartDescription))
		};
		
       data.datasets[0].data = initialBudgetChanges;
       data.datasets[1].data = actualCostChanges;
       data.datasets[2].data = plannedCostChanges;
       
		var myBarChart = new Chart(canvasElement, {
		  type: 'line',
		  data: data,
		  options: options
		});
    },
    
    drawBudgetChangesDiagram : function (component,fromDate) {		
		var toDate = new Date(fromDate.getFullYear(),fromDate.getMonth()+11,31);		
		
		var action = component.get("c.getBudgetChangeWrapperForProject");
		var project = component.get("v.project");
		
		action.setParams({
			"projectId" : project.Id,
			"fromDateString" : fromDate.toJSON(),
			"toDateString" : toDate.toJSON()
		});
		
		action.setCallback(this,function(response){		
			if(response.getState() == 'SUCCESS'){						
				this.drawBudgetChangeDiagram(response,fromDate,toDate);		
			}else{
				console.log(response.getError());
			}		
			
		});
		
		$A.enqueueAction(action);		
	},
    
    createLabels : function(fromDate,toDate){
    	var labels = [];
    	
    	while(fromDate <= toDate){
    		var currentMonthLabel = (fromDate.getMonth()+1)+'/'+fromDate.getFullYear();
    		labels.push(currentMonthLabel);
    		fromDate.setMonth(fromDate.getMonth()+1);
    	}
    	
    	return labels; 
    
    },   
    groupBudgetByTypes : function(budgetChanges){    
    	var budgetByType = new Map();
    	
    	if(budgetChanges){
	    	budgetByType.set(globalValues.INITIAL_BUDGET,[]);
	    	budgetByType.set(globalValues.PLANNED_BUDGET,[]);
	    	budgetByType.set(globalValues.ACTUAL_BUDGET,[]);
	    	
	    	budgetChanges.forEach(element => {
	    		switch(element.Budget_Type__c){
	    			case globalValues.INITIAL_BUDGET :
	    				budgetByType.get(globalValues.INITIAL_BUDGET).push(element);
	    				break;
	    			case globalValues.PLANNED_BUDGET :
	    				budgetByType.get(globalValues.PLANNED_BUDGET).push(element);
	    				break;
	    			case globalValues.ACTUAL_BUDGET :
	    				budgetByType.get(globalValues.ACTUAL_BUDGET).push(element); 
	    		}
	    	});
    	}
    	
    	return budgetByType;    	
    },
    
    createXaxisForBudget : function(budgets,beforeFromDateValue,currentMonth){    	
    	const X_AXIS_LENGTH = 12;    	
    	var xAxis = new Array(X_AXIS_LENGTH);    	
    	
    	if(!budgets.length){
    		this.fillXAxisWith(xAxis,beforeFromDateValue,currentMonth,X_AXIS_LENGTH);
    		return xAxis;
    	}    
    	
    	xAxis.fill(null);    	
    	var lastValue = budgets[budgets.length-1].New_Value__c;   	
    	
    	this.fillXAxisWithMonthValues(budgets,xAxis); 
    	this.fillXAxisWith(xAxis,beforeFromDateValue,currentMonth,X_AXIS_LENGTH);
    	this.fillXAxisWithOldestValues(lastValue,xAxis,currentMonth);
    	this.fillConnectionsOnXAxis(xAxis,currentMonth);    	
    	
    	return xAxis;    	
    },    
    
    isDateBetween : function(fromDate,toDate,currentDate){
    	return (fromDate.getTime() <= currentDate.getTime()) && (toDate.getTime() >= currentDate.getTime());
    },
    
    isDateBefore : function(targetDate,currentDate){
    	return targetDate.getTime() < currentDate.getTime();
    },
    
    fillXAxisWith : function(xAxis,beforeFromDateValue,currentMonth){
    	var i = 0; 
    	if(xAxis){
	    	while(xAxis[i] == null && i < xAxis.length && i <= currentMonth ){
	    		xAxis[i++] = beforeFromDateValue;
	    	}    	
    	}
    },
    
    fillXAxisWithMonthValues : function(budgets,xAxis){    	
    	if(budgets && xAxis){
	    	budgets.forEach(element => {    		
	    		var createdDate = new Date(element.Change_Date__c);
	    		xAxis[createdDate.getMonth()] = element.New_Value__c;
	    	}); 
    	}
    },
    
    fillXAxisWithOldestValues : function(oldestValue,xAxis,currentMonth){
    	if(xAxis){
	    	var i = xAxis.length-1;
	        while(xAxis[i] == null && i>=0){
	            if(i <= currentMonth){
	                xAxis[i] = oldestValue;
	            }
	            i--;
	        }
    	}
    },
    
    fillConnectionsOnXAxis : function(xAxis,currentMonth){
    	if(xAxis){
	    	var lastValue = xAxis[0];
	    	for(var i = 0;i < xAxis.length;i++){
	    		lastValue = (xAxis[i] != null && xAxis[i] != lastValue) ? xAxis[i] : lastValue;  	
	    		if(i <= currentMonth){
	    			xAxis[i] = lastValue;
	    		}
	    	}
    	}
    },  
})