import Joi from 'joi';

export function validateForm(fields, data) {
  const errors = {};

  fields?.forEach((field) => {
    let fieldSchema;
    let isRequired = false;

    // Initialize the schema based on the field type
    switch (field.type) {
      case 'string':
      case 'text':
      case 'password':
        fieldSchema = Joi.string();
        break;
      case 'number':
        fieldSchema = Joi.number();
        break;
      case 'email':
        fieldSchema = Joi.string().email();
        break;
      default:
        fieldSchema = Joi.any();
    }

    // Apply additional validations
    Object.entries(field).forEach(([key, value]) => {
      switch (key) {
        case 'required':
          isRequired = value === true;
          break;
        case 'min':
          if (typeof fieldSchema.min === 'function') {
            fieldSchema = fieldSchema.min(parseInt(value));
          }
          break;
        case 'max':
          if (typeof fieldSchema.max === 'function') {
            fieldSchema = fieldSchema.max(parseInt(value));
          }
          break;
        case 'length':
          if (field.type === 'number') {
            fieldSchema = fieldSchema.custom((val, helpers) => {
              if (val.toString().length !== parseInt(value)) {
                return helpers.error('number.length', { length: value });
              }
              return val;
            }, 'length validation');
          } else if (typeof fieldSchema.length === 'function') {
            fieldSchema = fieldSchema.length(parseInt(value));
          }
          break;
        case 'pattern':
          if (typeof fieldSchema.pattern === 'function') {
            fieldSchema = fieldSchema.pattern(new RegExp(value));
          }
          break;
      }
    });

    if (isRequired) {
      fieldSchema = fieldSchema.required();
    }

    const { error } = fieldSchema.validate(data?.[field?.name], {
      abortEarly: false,
      messages: {
        'any.required': `${field?.name} is required`,
        'string.empty': `${field?.name} cannot be empty`,
        'string.min': `${field?.name} should have at least {#limit} characters`,
        'string.max': `${field?.name} should have at most {#limit} characters`,
        'string.length': `${field?.name} should be exactly {#limit} characters long`,
        'string.pattern.base': `${field?.name} fails to match the required pattern`,
        'number.base': `${field?.name} must be a number`,
        'number.min': `${field?.name} should be greater than or equal to {#limit}`,
        'number.max': `${field?.name} should be less than or equal to {#limit}`,
        'number.length': `${field?.name} must be exactly {#length} digits long`,
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
