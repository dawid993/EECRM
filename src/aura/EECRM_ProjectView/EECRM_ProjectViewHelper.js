({
	createPicklist : function(project,container){
    	$A.createComponent(
            "c:EECRM_ProjectDetails",
            {
            	"project" : project,
                                
            },function(newComponent, status, errorMessage){
            	if (status === "SUCCESS") {                    
                    container.set("v.body",newComponent);                
                }
            })
    }
})