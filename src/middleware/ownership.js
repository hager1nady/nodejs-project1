import companyModel from "../../DB/models/company.model.js";

// Middleware to check ownership
export const checkOwnership = () => {
    try{
        return async(req,res,next)=>{
            const company =await companyModel.findById(req.params.id)
            if(!company){
                return res.status(404).json({ msssssg: 'Company notttt found' })
            }
            next();
        }
    }catch(error){res.status(400).json({ msg: 'Error finding company' })};
  };



  