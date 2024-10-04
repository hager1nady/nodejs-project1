
import express from 'express'
import { Router } from 'express'
import { allAppForSpecificJobs,  createCompany, deleteCompny,  getCompanywithjobs,  searshByName, updateCompny } from './company.controller.js'
import { role } from '../../middleware/role.js'
import { auth } from '../../middleware/authentication.js'
import { checkOwnership } from '../../middleware/ownership.js'
import { companyHRandUser } from '../../middleware/companyHRAndUser.js'
import { errorHandler } from '../../middleware/error-handling.middleware.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import { allAppForSpecificJobsSchema, createCompanySchema, searchNameSchema } from './company.schema.js'


const companyRouter=Router()


companyRouter.post('/',auth(),role(),validationMiddleware(createCompanySchema),errorHandler(createCompany))
companyRouter.patch('/:id',auth(),role(),checkOwnership(),errorHandler(updateCompny))
companyRouter.delete('/delete/:id',auth(),role(),checkOwnership(),errorHandler(deleteCompny))
companyRouter.get('/companyJob/:id',auth(),role(),checkOwnership(),errorHandler(getCompanywithjobs))
companyRouter.get('/search',auth(),companyHRandUser(),validationMiddleware(searchNameSchema),errorHandler(searshByName))
companyRouter.get('/:jobId/applications',auth(),role(),validationMiddleware(allAppForSpecificJobsSchema),errorHandler(allAppForSpecificJobs))






export default companyRouter