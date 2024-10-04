
   // Middleware to check role

export const role=()=>{
    try{
        return async(req,res,next)=>{        
            console.log(req.user.role);
            if (req.user.role ==="Company_HR") {
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
