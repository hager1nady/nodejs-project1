
import Joi from "joi";
export const createJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().required(),
        jobLocation:Joi.string().required(),
        workingTime:Joi.required(),
        seniorityLevel:Joi.string().required(),
        jobDescription:Joi.string(),
        technicalSkills:Joi.string().required(),
        softSkills:Joi.required(),
        addedBy:Joi.required(),
        company:Joi.required()
     
    
    }).options({ presence: "required" }),
  };



  export const updateJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().required(),
        jobLocation:Joi.string().required(),
     
    
    }).options({ presence: "required" }),
  };



  export const jobsForSpeciificSchema = {
    body: Joi.object({
        jobTitle: Joi.string().required(),
        jobLocation:Joi.string().required(),
     
    
    }).options({ presence: "required" }),
  };



