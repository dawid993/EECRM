(function(w){ 

  var globalConstants = {
    "INITIAL_BUDGET" : "Initial",
    "PLANNED_BUDGET" : "Planned",
    "ACTUAL_BUDGET"  : "Actual"
  };
  
  var budgetChangeChartDescription = [{
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
      data: null,
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
      data: null,
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
	      data: null,
	      spanGaps: false,
	    }				    
  ];
  
  var budgetTypeDiagramOptions = {
	    	scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                },
	                scaleLabel: {
	                     display: true,
	                     labelString: 'Budget',
	                     fontSize: 20 
	                  }
	   }]            
	}
  };

  w.globalValues = globalConstants;
  w.budgetChangeChartDescription = budgetChangeChartDescription;
  w.budgetTypeDiagramOptions = budgetTypeDiagramOptions;

})(window);