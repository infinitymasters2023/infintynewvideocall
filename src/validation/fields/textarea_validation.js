import * as Yup from 'yup';
export const requiredTextAreaValidation = (fieldName) => {
    return Yup.string()
        .required(`${fieldName} is required`)
        .trim()
        .transform((value, originalValue) => {
            return originalValue.trim();
        })
        .min(3, `${fieldName} must be at least 3 characters`)
        .max(500, `${fieldName} must not exceed 500 characters`)
        .test('not-all-numbers', `${fieldName} cannot consist of only numbers`, (value) =>
            !/^\d+$/.test(value)
        )
        .test('not-all-special-chars', `${fieldName} cannot consist of only special characters`, (value) =>
            !/^[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(value)
        )
        .test('has-alphabetical-character', `${fieldName} must contain character`,
            (value) => /[a-zA-Z]/.test(value)
        );

};
export const optionalTextAreaValidation = (fieldName) => {
    return Yup.string()
        .transform((originalValue) => {
            return originalValue?.trim() || '';
        })
        .min(3, `${fieldName} must be at least 3 characters`)
        .max(300, `${fieldName} must not exceed 300 characters`) // Corrected the message
        .test('not-all-numbers', `${fieldName} cannot consist of only numbers`, (value) =>
            !/^\d+$/.test(value || '')
        )
        .test(
            'not-all-special-chars',
            `${fieldName} cannot consist of only special characters`,
            (value) => !/^[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(value || '')
        );
};
