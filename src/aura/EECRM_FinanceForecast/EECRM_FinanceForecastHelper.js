({
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
    
    groupBudgetTypes : function(budgetChanges){
    	const INITIAL_BUDGET = 'Initial';
    	const PLANNED_BUDGET = 'Planned';
    	const ACTUAL_BUDGET = 'Actual';
    	
    	var budgetByType = new Map();
    	budgetByType.set(INITIAL_BUDGET,[]);
    	budgetByType.set(PLANNED_BUDGET,[]);
    	budgetByType.set(ACTUAL_BUDGET,[]);
    	
    	budgetChanges.forEach(element => {
    		switch(element.Budget_Type__c){
    			case INITIAL_BUDGET :
    				budgetByType.get(INITIAL_BUDGET).push(element);
    				break;
    			case PLANNED_BUDGET :
    				budgetByType.get(PLANNED_BUDGET).push(element);
    				break;
    			case ACTUAL_BUDGET :
    				budgetByType.get(ACTUAL_BUDGET).push(element); 
    		}
    	});
    	
    	return budgetByType;    	
    },
    
    createXaxisForBudget : function(budgets){
    	const X_AXIS_LENGTH = 12;
    	var xAxis = new Array(X_AXIS_LENGTH);
    	xAxis.fill(null);    	
    	budgets.forEach(element => {
    		var createdDate = new Date(element.CreatedDate);
    		xAxis[createdDate.getMonth()] = element.New_Value__c;
    	});
    	
    	console.log(budgets);
    	var lastValue = budgets[budgets.length-1].New_Value__c;
    	
    	for(var i = X_AXIS_LENGTH-1;i>=0;i--){
    		if(xAxis[i] != null && xAxis[i] != lastValue){
    			lastValue = xAxis[i];
    		}
    		
    		xAxis[i] = lastValue;
    	}
    	
    	return xAxis;
    	
    },    
})