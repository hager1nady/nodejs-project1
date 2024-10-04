import Joi from "joi";
export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().required(),
    lastName:Joi.string().min(3).max(30).alphanum().required(),
    username:Joi.string().min(3).max(30).alphanum().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net", "org"] },
    }),

    DOB:Joi.date().required(),
    recoveryEmail:Joi.string().email(),
    role:Joi.string().required(),
    status:Joi.string(),
    mobileNumber:Joi.number().required(),

    password: Joi.string()
      .pattern(
        /^[1-9]{8}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must have at 8 numbers",
        "any.required": "You need to provide a password",
        "string.min": "Password should have a 8 numbers",
      }),
  }).options({ presence: "required" }),
};



export const SignInSchema = {
  body: Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net", "org"] },
    }),
    password: Joi.string()
      .pattern(
        /^[1-9]{8}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must have at 8 numbers",
        "any.required": "You need to provide a password",
        "string.min": "Password should have a 8 numbers",
      }),
  }).options({ presence: "required" }),
};


export const updateSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().required(),
    lastName:Joi.string().min(3).max(30).alphanum().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net", "org"] },
    }),
    mobileNumber:Joi.number().required(),
    recoveryEmail:Joi.string().email(),
  
  }).options({ presence: "required" }),
};


export const anotherProfileSchema = {
  params: Joi.object({
    userId:Joi.object()
  
  }).options({ presence: "required" }),
};



export const forgetPasswordSchema = {
  body: Joi.object({
    email:Joi.string().email()
  
  }).options({ presence: "required" }),
};


export const updatePasswordSchema = {
  body: Joi.object({
    email:Joi.string().email(),
    otp:Joi.required(),
    newPassword:Joi.number().required()
  
  }).options({ presence: "required" }),
};



