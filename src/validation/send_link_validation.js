import * as Yup from 'yup';
import { requiredMobileValidation } from './fields/mobile_validation';
import { requiredEmailValidation } from './fields/email_validation';

export const ValidateEmailSchema = Yup.object().shape({
    email: requiredEmailValidation('Email'),
});

export const ValidateMobileSchema = Yup.object().shape({
    mobile: requiredMobileValidation('Mobile No.'),
})

