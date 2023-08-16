const Joi = require("joi");

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(50).required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.pattern.base": `Password should be between 8 to 30 characters and contain letters or numbers only`,
                "string.empty": `Password cannot be empty`,
                "any.required": `Password is required`,
            }),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
            .required()
            .messages({
                "string.pattern.base": `Password should be between 8 to 30 characters and contain letters or numbers only`,
                "string.empty": `Password cannot be empty`,
                "any.required": `Password is required`,
            }),
    });
    return schema.validate(data);
};


const projectValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
  })

  return schema.validate(data);
}

const taskValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(1).max(35).required(),
        description: Joi.string().min(1).max(500).required(),
        due_date: Joi.date().required(),
        status: Joi.string().valid('To Do', 'In Progress', 'Done'),
        priority: Joi.string().valid('Low', 'Medium', 'High'),
        label: Joi.string(),

    });
    return schema.validate(data);
};


module.exports = {
    registerValidation,
    loginValidation,
    taskValidation,
    //   emailValidation
};