public class EECRM_Projects extends fflib_SObjectDomain {
    public EECRM_Projects(List<EECRM_Project__c> sObjectList) {
        super(sObjectList);
    }

    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new EECRM_Projects(sObjectList);
        }
    }

    public override void onApplyDefaults(){
        
    }

    public override void onBeforeInsert(){
        assigneDefaultResponsiblePerson();
        calculateChecksum();
    }

    public override void onValidate(){
        validateProjectName();
    } 

    private void assigneDefaultResponsiblePerson(){
        for(SObject currentRecord : Records){
            if(currentRecord.get('Responsible_Person__c') == null){
                currentRecord.put('Responsible_Person__c',getDefaultResponsiblePerson().ID);
            }     
        }    
    } 

    private void validateProjectName(){
        Map<String,sObject> projects = new Map<String,sObject>();
        for(SObject currentRecord : Records){
            String projectName = (String) currentRecord.get('Project_Name__c');

            if(String.isBlank(projectName)){
                currentRecord.addError('Project Name is empty. Please fill it.');
            }           
            if(projects.containsKey(projectName)){
                currentRecord.addError('You are trying to duplicate projects names.');
            }else{
                projects.put(projectName,currentRecord);
            }   
        }

        List<sObject> duplicatedProjects = EECRM_SRV_ProjectsService.getInstance().getProjectsByNames(projects.keySet()); 
        System.debug(duplicatedProjects);       
        if(!projects.isEmpty()){
            for(sObject duplicatedProject : duplicatedProjects){
                String key = (String) duplicatedProject.get('Project_Name__c');
                if(projects.containsKey(key) && projects.get(key).ID != duplicatedProject.ID){
                    projects.get(key).addError('Duplicated Project Name : '+key); 
                }
            }            
        }
    } 

    private void calculateChecksum(){
        for(SObject currentRecord : Records){
            String hashTarget = buildHashTarget(currentRecord);            
            String hashBase64SHA1 = EECRM_UTL_Utils.generateHashBase64SHA1(hashTarget);
            currentRecord.put('Checksum__c',hashBase64SHA1);
        }   
    }
 
    private String buildHashTarget(SObject record){
        String category = (String) record.get('Category__c');      
        return EECRM_UTL_Utils.sortMultiPiclistAlphabetically(category) 
            + '' + record.get('Project_Name__c');
    }   

    private Contact getDefaultResponsiblePerson(){
        List<Contact> globalManager = [SELECT Id,UniqueId__c FROM Contact WHERE Global_Manager__c = true LIMIT 1];
        if(globalManager.isEmpty()){
            return new Contact();
        }else{
            return globalManager[0];
        }
        
    } 
}