const { ValidationError } = require("../helpers/errors");
const {
  postSchema,
  putSchema,
  patchSchema,
  userShema,
  subscriptionShema,
  emailShema,
  passwordShema,
} = require("../helpers/validationІSchemas");

const validation = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }
    next();
  };
};

const postValidation = validation(postSchema);

const putValidation = validation(putSchema);

const patchValidation = validation(patchSchema);

const userValidation = validation(userShema);

const subscriptionValidation = validation(subscriptionShema);

const emailValidation = validation(emailShema);

const passwordValidation = validation(passwordShema);

module.exports = {
  postValidation,
  putValidation,
  patchValidation,
  userValidation,
  subscriptionValidation,
  emailValidation,
  passwordValidation,
};
