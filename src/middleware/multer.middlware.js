import multer from "multer"


export const multerMiddlware=()=>{
    // diskStorage multer will be store in disk storage
    
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'src/uploads')
        }
    })


    const fileUpload=multer({storage:storage})
    return fileUpload
}