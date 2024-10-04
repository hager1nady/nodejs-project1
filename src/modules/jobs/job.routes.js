
import { Router } from 'express'
import { addJob,  applyJob, deleteJob, filtration, getAllJobsForSpecificCompany, getjobswithcompany, updateJob } from './job.controller.js'
import { auth } from '../../middleware/authentication.js'
import { role } from '../../middleware/role.js'
import { checkOwnership } from '../../middleware/ownership.js'
import { userRole } from '../../middleware/userRole.js'
import { errorHandler } from '../../middleware/error-handling.middleware.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import { createJobSchema, jobsForSpeciificSchema, updateJobSchema } from './jobs.schema.js'

const jobRouter=Router()

jobRouter.post('/',auth(),role(),validationMiddleware(createJobSchema),errorHandler(addJob))
jobRouter.patch('/:id',auth(),role(),validationMiddleware(updateJobSchema),errorHandler(updateJob))
jobRouter.delete('/:id',auth(),role(),errorHandler(deleteJob))
jobRouter.get('/getJobs/:id',auth(),errorHandler(getjobswithcompany))
jobRouter.get('/company/:name',auth(),validationMiddleware(jobsForSpeciificSchema),errorHandler(getAllJobsForSpecificCompany))
jobRouter.get('/filter',auth(),errorHandler(filtration))
jobRouter.post('/:id/apply',auth(),userRole(),errorHandler(applyJob))












export default jobRouter