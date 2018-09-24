({
	doInit : function(component,event,helper){
		var startChartDate;	
		startChartDate = new Date();
		startChartDate.setMonth(0);
		startChartDate.setDate(1);
		console.log(startChartDate);
		component.set("v.chartStartDate",startChartDate);
	},
	
	drawBudgetChangesDiagram : function (component, event, helper) {
		var fromDate = component.get("v.chartStartDate");
		helper.drawBudgetChangesDiagram(component,new Date(fromDate.getTime()));		
	},
	
	setOneYearBack : function(component,event,helper){
		var fromDate = component.get("v.chartStartDate");
		console.log(fromDate);
		fromDate.setFullYear(fromDate.getFullYear()-1);
		console.log(fromDate);
		component.set("v.chartStartDate",fromDate);	
		helper.drawBudgetChangesDiagram(component,new Date(fromDate.getTime()));			
        
	},
	
	setOneYearForward : function(component,event,helper){
		var fromDate = component.get("v.chartStartDate");
		fromDate.setFullYear(fromDate.getFullYear()+1);
		component.set("v.chartStartDate",fromDate);		
        helper.drawBudgetChangesDiagram(component,new Date(fromDate.getTime()));
	},
})