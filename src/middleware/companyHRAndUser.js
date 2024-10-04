

   // Middleware to check role

   export const companyHRandUser=()=>{
    try{
        return async(req,res,next)=>{        
            console.log(req.user.role);
            if (req.user.role ===('Company_HR'|| 'User')) {
            next();
            } else {
            res.status(403).json({ msg: 'Unauthorizedd' });
            }
        }
    }
    catch(erroe){
    return res.status(400).json({message:"catch error"})
    }
   

}