

import  mongoose from "mongoose"
import { Schema,model} from "mongoose";
////////// create appSchema////////
const appSchema=new mongoose.Schema({
 
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      userTechSkills: {
        type: [String],
        required: true
      },
      userSoftSkills: {
        type: [String],
        required: true
      },
      // userResume: {
      //   type: String,
      //   required: true,
      //   validate: {
      //     validator: function(v) {
      //       return /^https?:\/\/res.cloudinary.com\/.*\.pdf$/.test(v);
      //     },
      //     message: props => `${props.value} is not a valid Cloudinary URL for a PDF file!`
      //   }
      // }
  

    
})

/////// create appModel////////
const appModel=mongoose.model("APP",appSchema)

export default appModel