public class EECRM_UTL_Utils {

    public static String generateHashBase64SHA1(String hashTarget){
        Blob targetBlob = Blob.valueOf(hashTarget);
        Blob hashSHA1 = Crypto.generateDigest('SHA1', targetBlob);
        return EncodingUtil.base64encode(hashSHA1);        
    }

    public static String sortMultiPiclistAlphabetically(String multiPicklistValue){        
        if(String.isBlank(multiPicklistValue)){
            return '';
        }

        List<String> splitedValues = multiPicklistValue.split(';');
        splitedValues.sort();
        return String.join(splitedValues,';');
    }
}