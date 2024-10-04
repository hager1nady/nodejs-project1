``
import express from 'express'
import { Router } from 'express'
import { anotherProfile, deleteUser ,forgetPassword,getProfile,signIn, signUp,  updatePassword,  updateUser } from './user.controller.js'
import { auth } from '../../middleware/authentication.js'
import { errorHandler } from '../../middleware/error-handling.middleware.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import { anotherProfileSchema, SignInSchema, SignUpSchema, updateSchema } from './user.schema.js'

const userRouter=Router()

userRouter.post('/signup',validationMiddleware(SignUpSchema),errorHandler(signUp))
userRouter.post('/signin',validationMiddleware(SignInSchema),errorHandler(signIn))
userRouter.patch('/update/:id',auth(),validationMiddleware(updateSchema),errorHandler(updateUser))
userRouter.delete('/delete/:id',auth(),validationMiddleware(anotherProfileSchema),errorHandler(deleteUser))
userRouter.delete('/delete/:id',auth(),errorHandler(deleteUser))
userRouter.get('/profile',auth(),errorHandler(getProfile))
userRouter.get('/profile/:userId',auth(),errorHandler(anotherProfile))
userRouter.post('/forgetPassword',auth(),errorHandler(forgetPassword))
userRouter.post('/resetPassword',errorHandler(updatePassword))














export default userRouter