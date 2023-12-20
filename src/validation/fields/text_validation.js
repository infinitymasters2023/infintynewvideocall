import * as Yup from 'yup';
export const requiredTextValidation = (fieldName) => {
    return Yup.string()
        .required(`${fieldName} is required`)
        .min(2, `${fieldName} must be at least 2 characters`)
        .max(50, `${fieldName} must not exceed 50 characters`)
        .transform((value) => {
            if (value !== null && value !== undefined) {
                return value.trim();
            }
            return value;
        });
};

export const optionalTextValidation = (fieldName) => {
    return Yup.string()
        .min(2, `${fieldName} must be at least 3 characters`)
        .max(50, `${fieldName} must not exceed 50 characters`)
        .transform((value) => {
            if (value !== null && value !== undefined) {
                return value.trim();
            }
            return value;
        });
};