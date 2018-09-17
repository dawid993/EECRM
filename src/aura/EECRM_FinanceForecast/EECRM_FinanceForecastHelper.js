({
	drawBudgetChangeDiagram : function(responseData,fromDate,toDate){
		var wrapperFromSFDC = responseData.getReturnValue();
		var currentDate = new Date();		
		var currentMonth = this.isDateBetween(fromDate,toDate,currentDate) ? currentDate.getMonth() : 100;		
		
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
			
			var canvas = document.getElementById('budgetChangeChart');
			this.createBudgetChangeDiagram(canvas,initialBudgetXaxis,plannedBudgetXaxis,actualBudgetXaxis,labels);
		}
	},
	
	createBudgetChangeDiagram : function(canvasElement,initialBudgetChanges,plannedCostChanges,actualCostChanges,labels){
       var options = {
    	scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                },
                scaleLabel: {
                     display: true,
                     labelString: 'Moola',
                     fontSize: 20 
                  }
            }]            
        }  
       }; 
       
       var data = {
		  labels: labels,
		  datasets: [{
		      label: "Planned Budget",
		      fill: false,
		      lineTension: 0.1,
		      backgroundColor: "rgba(225,0,0,0.4)",
		      borderColor: "red", // The main line color
		      borderCapStyle: 'square',
		      borderDash: [], // try [5, 15] for instance
		      borderDashOffset: 0.0,
		      borderJoinStyle: 'miter',
		      pointBorderColor: "black",
		      pointBackgroundColor: "white",
		      pointBorderWidth: 1,
		      pointHoverRadius: 8,
		      pointHoverBackgroundColor: "yellow",
		      pointHoverBorderColor: "brown",
		      pointHoverBorderWidth: 2,
		      pointRadius: 4,
		      pointHitRadius: 10,
		      // notice the gap in the data and the spanGaps: true
		      data: plannedCostChanges,
		      spanGaps: true,
		    }, {
		      label: "Actual Budget",
		      fill: false,
		      lineTension: 0.1,
		      backgroundColor: "rgba(167,105,0,0.4)",
		      borderColor: "rgb(167, 105, 0)",
		      borderCapStyle: 'butt',
		      borderDash: [],
		      borderDashOffset: 0.0,
		      borderJoinStyle: 'miter',
		      pointBorderColor: "white",
		      pointBackgroundColor: "black",
		      pointBorderWidth: 1,
		      pointHoverRadius: 8,
		      pointHoverBackgroundColor: "brown",
		      pointHoverBorderColor: "yellow",
		      pointHoverBorderWidth: 2,
		      pointRadius: 4,
		      pointHitRadius: 10,
		      // notice the gap in the data and the spanGaps: false
		      data: actualCostChanges,
		      spanGaps: false,
		    },{
			      label: "Initial Budget",
			      fill: false,
			      lineTension: 0.1,
			      backgroundColor: "rgba(117,225,0,0.4)",
			      borderColor: "rgb(117, 155, 0)",
			      borderCapStyle: 'butt',
			      borderDash: [],
			      borderDashOffset: 0.0,
			      borderJoinStyle: 'miter',
			      pointBorderColor: "white",
			      pointBackgroundColor: "black",
			      pointBorderWidth: 1,
			      pointHoverRadius: 8,
			      pointHoverBackgroundColor: "brown",
			      pointHoverBorderColor: "yellow",
			      pointHoverBorderWidth: 2,
			      pointRadius: 4,
			      pointHitRadius: 10,
			      // notice the gap in the data and the spanGaps: false
			      data: initialBudgetChanges,
			      spanGaps: false,
			    }				    
		  ]
		};
		
		var myBarChart = new Chart(canvasElement, {
		  type: 'line',
		  data: data,
		  options: options
		});
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
    }
})