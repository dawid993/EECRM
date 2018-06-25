public with sharing class EECRM_SRV_ProjectsService {

    private static EECRM_SRV_ProjectsService serviceInstance;

    private EECRM_SRV_ProjectsService(){ }

    public static EECRM_SRV_ProjectsService getInstance(){
        if(serviceInstance == null){
            serviceInstance = new EECRM_SRV_ProjectsService();   
        }     
        return serviceInstance;
    }

    public List<EECRM_Project__c> getProjectsByNames(Set<String> names){
        return [SELECT Id,Project_Name__c FROM EECRM_Project__c WHERE Project_Name__c IN :names];
    }

    public void save(EECRM_Project__c project){
        if(project != null){       
            save(new List<EECRM_Project__c>{project}); 
        }
    }

    public void save(List<EECRM_Project__c> projects){       
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork( new List<SObjectType>{EECRM_Project__c.sObjectType} );
        save(projects,uow);
        commitWork(uow);     
    }

    public void save(EECRM_Project__c project,fflib_SObjectUnitOfWork uow){
        if(project != null){
            save(new List<EECRM_Project__c>{project},uow);
        }
    }

    public void save(List<EECRM_Project__c> projects,fflib_SObjectUnitOfWork uow){

        try{
            for(EECRM_Project__c project : projects){
                if(project.ID == null){
                   uow.registerNew(project);
                }else{
                   uow.registerDirty(project);  
                }         
            } 
        }catch(Exception ex){
            throw new EECRM_ServiceException('Exception occured during sObject\'s registration. Please see error messages.',ex);
        }
    } 

    public void saveWithTasks(Map<EECRM_Project__c,List<EECRM_Reported_Task__c>> projectsWithTasks){        
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork( 
            new List<SObjectType>{EECRM_Project__c.sObjectType, EECRM_Reported_Task__c.sObjectType});
        saveWithTasks(projectsWithTasks,uow);
        commitWork(uow);          
    }

    public void saveWithTasks(Map<EECRM_Project__c,List<EECRM_Reported_Task__c>> projectsWithTasks,fflib_SObjectUnitOfWork uow){
        if(projectsWithTasks == null || projectsWithTasks.isEmpty()){
            return;
        }

        try{

            for(EECRM_Project__c project : projectsWithTasks.keySet()){
                save(project,uow);
                for(EECRM_Reported_Task__c currentTask : projectsWithTasks.get(project)){
                    if(currentTask.ID == null){
                        uow.registerNew(currentTask,EECRM_Reported_Task__c.Project__c,project);
                    }else{
                        uow.registerDirty(currentTask); 
                    }
                }
            }

        }catch(Exception ex){
            throw new EECRM_ServiceException('Exception occured during sObject\'s registration. Please see error messages.',ex);
        }
    }

    private void commitWork(fflib_SObjectUnitOfWork uow){
        try{
            uow.commitWork(); 
        }catch(Exception ex){
            throw new EECRM_ServiceException('Exception occured during commiting. Please see error messages.',ex);
        }
    }
}