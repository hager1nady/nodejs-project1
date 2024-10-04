


import  mongoose from "mongoose"
import { Schema,model} from "mongoose";
////////// create jobSchema////////
const jobSchema=new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
      },
      jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: true
      },
      workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        required: true
      },
      seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: true
      },
      jobDescription: {
        type: String,
        required: true
      },
      technicalSkills: {
        type: [String],
        required: true
      },
      softSkills: {
        type: [String],
        required: true
      },
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      company: { type: Schema.Types.ObjectId, ref: 'company', required: true }
    
})

/////// create jobkModel////////
const jobModel=mongoose.model("Job",jobSchema)

export default jobModel