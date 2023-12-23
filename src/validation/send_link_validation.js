import * as Yup from 'yup';
import { requiredMobileValidation, mobileOptionalValidation } from './fields/mobile_validation';
import { requiredEmailValidation, emailOptionalValidation } from './fields/email_validation';

export const ValidateEmailSchema = Yup.object().shape({
    email: requiredEmailValidation('Email'),
});

export const ValidateMobileSchema = Yup.object().shape({
    mobile: requiredMobileValidation('Mobile No.'),
})

export const SendMeetLinkSchema = Yup.object().shape({
    userEmail: emailOptionalValidation('Email'),
    userMobile: mobileOptionalValidation('Mobile No.'),
    emailidaddress: emailOptionalValidation('Email'),
    mobileno: mobileOptionalValidation('Mobile No.'),
    alternateEmailID: emailOptionalValidation('Alternate Email'),
    landlineno: mobileOptionalValidation('Alternate Mobile No.'),
    proxyMobile1: mobileOptionalValidation('Proxy Mobile No.'),
    proxyMobile2: mobileOptionalValidation('Proxy2 Mobile No.'),
    serviceCenterEmail: emailOptionalValidation('Service Center Email'),
    serviceCenterMobile: mobileOptionalValidation('Service Center Mobile No.'),
    dealerEmailID: emailOptionalValidation('Dealer Email'),
    dealerMobileNo: mobileOptionalValidation('Dealer Mobile No.'),
    dealerEmailID2: emailOptionalValidation('Dealer Email2'),
    dealerMobileNo2: mobileOptionalValidation('Dealer Mobile No.'),
    otherEmail: Yup.array().of(requiredEmailValidation('Email')),
    otherMobile: Yup.array().of(requiredMobileValidation('Mobile No.')),
})

