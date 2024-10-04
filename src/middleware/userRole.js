



   // Middleware to check role

   export const userRole=()=>{
    try{
        return async(req,res,next)=>{        
            console.log(req.user.role);
            if (req.user.role =="User") {
            next();
            } else {
            res.status(403).json({ msg: 'Unauthorized' });
            }
        }
    }
    catch(erroe){
    return res.status(400).json({message:"catch error"})
    }
   

}