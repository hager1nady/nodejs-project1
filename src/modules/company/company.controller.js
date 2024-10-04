



import appModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/jobs.model.js";
import { ErrorClass } from "../../utils/error-class.utils.js";


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,newCompany}
 * @description create company
 */
const createCompany=async(req,res,next)=>{

    const { companyName, address,description,industry,numberOfEmployees,companyEmail,companyHR} = req.body;

    const company=await companyModel.findOne({companyName,address,description,industry,numberOfEmployees,companyEmail,companyHR})
    if (company){
        next(
          new ErrorClass(
              "error in create company name alredy exist",
              400,
              {company},
              "error exist api create company ",       
          )) 
      }
    const newCompany = await companyModel.create({companyName, address,description,industry,numberOfEmployees,companyEmail,companyHR})
  
    res.status(201).json({message:"created success",newCompany})
   
}

////////////////////////////////////////Update company data////////////////////////////////////////// 
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,updateCompny}
 * @description Update company data
 */
const updateCompny=async(req,res,next)=>{
    const userId = req.user._id;
    const companyId = req.params.id;
    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
      next(
        new ErrorClass(
            "Company not found",
            404,
            {company},
            "error exist api update company ",       
        )) 
    }
    // Check if the user is the owner of the company
    if (!company.companyHR.equals(userId)) {
      return   next(
        new ErrorClass(
            "You are not authorized to update this company",
            403,
            {company},
            "error exist api update company ",       
        )) 
    }
    // Update the company data
    const updates = req.body;
    delete updates.companyHR; // Prevent changing the owner via this route
    const updatedCompany = await companyModel.findByIdAndUpdate(companyId, updates, { new: true });
    res.status(200).json(updatedCompany);
  } 
///////////////////////////// delete company data/////////////////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message}
 * @description delete company data
 */
const deleteCompny=async(req,res,next)=>{

  const userId = req.user._id;
  const companyId = req.params.id;

  // Find the company
  const company = await companyModel.findById(companyId);
  if (!company) {
    next(
      new ErrorClass(
          "Company not found",
          404,
          {company},
          "error exist api update company ",       
      )) 
  }
  // Check if the user is the owner of the company
  if (!company.companyHR.equals(userId)) {
    return   next(
      new ErrorClass(
          "You are not authorized delete this company",
          403,
          {company},
          "error exist api delete company ",       
      )) 
  }
  // Delete the company
  await company.deleteOne();
  res.status(200).send('Company deleted successfully');
} 
////////////////////////////////////Get company data /////////////////////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,companyy,jobs}
 * @description Get company data
 */
const getCompanywithjobs=async(req,res,next)=>{
    const companyy=await companyModel.findById(req.params.id)
    if (!companyy) {
      return next(
          new ErrorClass(
              "Company not found",
              404,
              {companyy},
              "error exist api  get company data",       
          ))
      }
    const jobs=await  jobModel.find({ company: req.params.id })
    res.status(200).json({companyy,jobs})
}

/////////////////////////////////////Search for a company with a name//////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,companies}
 * @description Search for a company with a name
 */
const searshByName=async(req,res,next)=>{
   
      const { companyName } = req.body;
      if (!companyName) {
        // return res.status(400).send('Company name is required');
        next(
        new ErrorClass(
          "Company name is required'",
          400,
          {companyName},
          "error exist api  get search for company name",       
      ))
      }
      // Find companies matching the name (case-insensitive)
      const companies = await companyModel.find({ companyName: new RegExp(companyName, 'i') });
      res.status(200).json(companies);
    } 
/////////////////////////////////////// Get all applications for specific Jobs////////////////////////
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {message,applications}
 * @description Get all applications for specific Jobs
 */
const allAppForSpecificJobs=async(req,res,next)=>{
  
      const userId = req.user._id;
      const jobId = req.params.jobId;
  
      // Find the job
      const job = await jobModel.findById(jobId);
      if (!job) {
      return  next(
        new ErrorClass(
          "Job not found",
          404,
          {job},
          "error exist in Get all applications for specific Jobs",       
      ))
      }
      // Find the company of the job
      const company = await companyModel.findOne({ companyHR: userId });
      if (!company) {
      return  next(
          new ErrorClass(
            "Company not found",
            404,
            {job},
            "error exist in  Find the company of the job",       
        ))
      }
  
      // Check if the job belongs to the company
      const jobBelongsToCompany = await jobModel.findOne({ _id: jobId, addedBy: userId });
      if (!jobBelongsToCompany) {
      return  next(
          new ErrorClass(
            "You are not authorized to view applications for this job",
            403,
            {jobBelongsToCompany},
            "error exist in Check if the job belongs to the company",       
        ))
      }
  
      // Find the applications for the job
      const applications = await appModel.find({ jobId }).populate('userId'); 
  
      res.status(200).json({applications:applications});
    } 





export {
    createCompany,
    updateCompny,
    deleteCompny,
    getCompanywithjobs,
    searshByName,
    allAppForSpecificJobs,
    
}