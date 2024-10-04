import Joi from "joi";



export const createCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required(),
        address:Joi.string().required(),
        description:Joi.string().required(),
        industry:Joi.string().required(),
        numberOfEmployees:Joi.required(),
        companyEmail:Joi.string().email(),
        companyHR:Joi.required()
     
    
    }).options({ presence: "required" }),
  };


  export const searchNameSchema = {
    body: Joi.object({
        companyName: Joi.string().required(),
       
     
    
    }).options({ presence: "required" }),
  };

  

  export const allAppForSpecificJobsSchema = {
    params: Joi.object({
        jobId:Joi.required()
       
     
    
    }).options({ presence: "required" }),
  };

