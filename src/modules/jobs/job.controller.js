import appModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/jobs.model.js"
import { ErrorClass } from "../../utils/error-class.utils.js"
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @return {job}
 * @description Add Job to jobs model
 */

const addJob=async(req,res,next)=>{ 
        const ownerId = req.user._id;
        const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy,company } = req.body;
        // Create new job
        const job = await  jobModel.create({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy,company});
        res.status(201).json(job);
        next()
      } 

////////////////////////////update job//////////////////////////////////

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,job}
 * @description update job 
 */


const updateJob=async(req,res,next)=>{
    const { jobTitle, jobLocation} = req.body;
    const find1Job=await jobModel.findOne({jobTitle})
    const findJob=await jobModel.findOne({jobLocation})

    if (find1Job||findJob){
     return   next(
          new ErrorClass(
              "message error in create job title or location alredy exist",
              400,
              ([find1Job||findJob]),
              "error exist api update job",       
          )
       )
  
      }
    const job=await  jobModel.findByIdAndUpdate(req.params.id,{ jobTitle,jobLocation }, { new: true })
    res.status(200).json({message:"updated success",job})
}

////////////////////////  delete job//////////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message}
 */
const deleteJob=async(req,res,next)=>{
    
    const findJob=await jobModel.findById(req.params.id)
    if (!findJob){
        return  next(
          new ErrorClass(
              "job is not found",
              400,
             (findJob),
              "error exist api delete job",       
          )
  
      )}
    const job=await  jobModel.findByIdAndDelete(req.params.id, { new: true })
    res.status(200).json({message:"deleted success"})
}
////////////////////////////////////////Get all Jobs with their company’s information./////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {jobs}
 * @description Get all Jobs with their company’s information
 */
const getjobswithcompany=async(req,res,next)=>{      
        const jobs = await jobModel.find().populate('company');
        res.status(200).json({jobs:jobs});
        next()
      }
////////////////////////////////////////Get all Jobs for a specific company./////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,jobs}
 * @description Get all Jobs for a specific company
 */
const getAllJobsForSpecificCompany=async(req,res,next)=>{
        const companyName = req.params.name;
        if (!companyName) {
        return  next(
            new ErrorClass(
                "Company name is required",
                400,
                {findJob},
                "error exist api get all jobs for soesific company",       
            ))

        }
        // Find the company by name
        const company = await companyModel.findOne({companyName});
        if (!company) {
        return  next(
            new ErrorClass(
                "Company no found",
                400,
                {companyName},
                "error exist api get all jobs for spesific company",       
            ))
        }  
     
        // Find all jobs for the specific company      
        const jobs = await jobModel.find({company:company._id}).populate('company');
        res.status(200).json(jobs);
      } 

////////////////////////////filtraion////////////////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,jobs}
 * @description filtraion
 */

const filtration=async(req,res,next)=>{
   
        const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.body;
        const filter = {};
    
        if (workingTime) filter.workingTime = workingTime;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
        if (jobTitle) filter.title = new RegExp(jobTitle, 'i'); 
        if (technicalSkills) filter.technicalSkills = { $all: technicalSkills.split(',') }; 
        const jobs = await jobModel.find(filter).populate('company');
        if(jobs){
          return  next(
            new ErrorClass(
                "jobs not found",
                400,
                {filter},
                "error exist api filtration",       
            ))
        }
        res.status(200).json(jobs);
       
      } 
      

///////////////////////////////////////////////apply job/////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,application}
 * @description apply job
 */
const applyJob=async(req,res,next)=>{   
          const userId = req.user._id;
          const jobId = req.params.id;
          const { userTechSkills, userSoftSkills } = req.body;
      
          // Check if the job exists
          const job = await jobModel.findById(jobId);
          if (!job) {
            // return res.status(404).send('Job not found');
            return  next(
              new ErrorClass(
                  "jobs not found",
                  404,
                  {job},
                  "error exist api apply job",       
              ))
          }
          // Create new application
          const application = new appModel({
            jobId,
            userId,
            userTechSkills: userTechSkills.split(','), 
            userSoftSkills: userSoftSkills.split(','), 
            // userResume: userResume
          });
          await application.save();
          res.status(201).json({message:'Application submitted successfully',application});
        }







export {
    addJob,
    updateJob,
    deleteJob,
    getjobswithcompany,
    getAllJobsForSpecificCompany,
    filtration,
    applyJob,
    
}