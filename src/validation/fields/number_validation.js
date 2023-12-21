
import * as Yup from 'yup';
export const requiredNumberValidation = (fieldName) => {
    return Yup.number()
        .required(`${fieldName} is required`);
};

export const optionalNumberValidation = (fieldName) => {
    return Yup.number();
};

export const requiredNumberStringValidation = (fieldName) => {
    return Yup.string()
        .required(`${fieldName} is required`)
        .min(1, `Invalid ${fieldName}`)
        .max(10, `Invalid ${fieldName}`)
        .matches(/^\d+$/, `${fieldName} Must be a numeric value`)
        .transform((originalValue) => {
            return originalValue.trim();
        });
};

export const optionalNumberStringValidation = (fieldName) => {
    return Yup.string()
        .min(1, `Invalid ${fieldName}`)
        .max(10, `Invalid ${fieldName}`)
        .matches(/^\d+$/, 'Must be a numeric value')
        .transform((value) => {
    if (value !== null && value !== undefined) {
        return value.trim();
    }
    return value;
});
};

export const requiredAmountValidation = (fieldName) => {
    return Yup.string()
        .required(`${fieldName} is required`)
        .typeError(`${fieldName} must be a number`)
        .min(0, `${fieldName} must be a positive number`)
        .max(7, `${fieldName} cannot exceed 99,99,999`)
        .test(
            'is-decimal',
            `${fieldName} must have up to 2 decimal places`,
            (value) => /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
        );
};

export const optionalAmountValidation = (fieldName) => {
    return Yup.string()
        .typeError(`${fieldName} must be a number`)
        .min(0, `${fieldName} must be a positive number`)
        .max(1000000, `${fieldName} cannot exceed 1,000,000`)
        .test(
            'is-decimal',
            `${fieldName} must have up to 2 decimal places`,
            (value) => {
                if (!value) return true;
                return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
            }
        );
};


export const requiredSixDigitsValidation = (fieldName) => {
    return Yup.string()
        .required(`${fieldName} is required`)
        .matches(/^[0-9]{6}$/, `Invalid ${fieldName}`)
        .matches(/^\d+$/, `Invalid ${fieldName}`)
        .transform((originalValue) => {
            return originalValue.trim();
        });
};


export const mobileSixDigitsValidation = (fieldName) => {
    return Yup.string()
        .matches(/^[0-9]{6}$/, `Invalid ${fieldName}`)
        .matches(/^\d+$/, `Invalid ${fieldName}`)
        .transform((value) => {
    if (value !== null && value !== undefined) {
        return value.trim();
    }
    return value;
});
};

