import * as Yup from 'yup';
export const requiredEmailValidation = (fieldName) => {    
    return Yup.string()
        .required(`${fieldName} is required`)
        .email(`Invalid ${fieldName}`)
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, `Invalid ${fieldName}`)
        .trim()
        .max(100, `${fieldName} must not exceed 100 characters`)
        .transform((value) => {
            if (value !== null && value !== undefined) {
                return value.trim();
            }
            return value;
        })        
};

export const emailOptionalValidation = (fieldName) => {
    return Yup.string()
        .email(`Invalid ${fieldName}`)
        .trim()
        .min(5, `${fieldName} must be at least 5 characters`)
        .max(100, `${fieldName} must not exceed 100 characters`)
        .transform((value) => {
            if (value !== null && value !== undefined) {
                return value.trim();
            }
            return value;
        });
};
