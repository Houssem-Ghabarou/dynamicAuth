import Joi from 'joi';

export function validateForm(fields, data) {
  const errors = {};

  fields?.forEach((field) => {
    let fieldSchema = Joi.any();
    let isRequired = false;

    Object.entries(field).forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`, 'field');

      switch (key) {
        case 'type':
          if (value === 'string' || value === 'text' || value === 'password') {
            fieldSchema = Joi.string();
          } else if (value === 'number') {
            fieldSchema = Joi.number();
          } else if (value === 'email') {
            fieldSchema = Joi.string().email();
          }
          break;
        case 'required':
          isRequired = value === true;
          break;
        case 'min':
          fieldSchema = fieldSchema?.min(parseInt(value));
          break;
        case 'max':
          fieldSchema = fieldSchema?.max(parseInt(value));
          break;

        //case numberToString length

        case 'length':
          fieldSchema = fieldSchema?.length(parseInt(value));
          break;
        case 'pattern':
          fieldSchema = fieldSchema?.pattern(new RegExp(value));
          break;
      }
    });

    if (isRequired) {
      fieldSchema = fieldSchema.required();
    }

    const { error } = fieldSchema?.validate(data?.[field?.name], {
      abortEarly: false,
      messages: {
        'any.required': `${field?.name} is required`,
        'string.empty': `${field?.name} cannot be empty`,
        'string.min': `${field?.name} should have at least {#limit} characters`,
        'string.max': `${field?.name} should have at most {#limit} characters`,
        'string.length': `${field?.name} should be exactly {#limit} characters long`,
        'string.pattern.base': `${field?.name} fails to match the required pattern`,
        'number.base': `${field?.name} must be a number`,
        //number must be a string
        'number.string': `${field?.name} must be a number`,

        'number.min': `${field?.name} should be greater than or equal to {#limit}`,
        'number.max': `${field?.name} should be less than or equal to {#limit}`,
        'string.email': `${field?.name} must be a valid email`,
      },
    });

    if (error) {
      errors[field?.name] = error?.details?.map((detail) => detail?.message);
    }
  });

  return Object.keys(errors).length > 0
    ? { isValid: false, errors }
    : { isValid: true };
}
