import * as Yup from 'yup';
import { requiredTextValidation, optionalTextValidation } from './fields/text_validation';
import { requiredNumberStringValidation, optionalNumberStringValidation } from './fields/number_validation'
import { requiredTextAreaValidation, optionalTextAreaValidation } from './fields/textarea_validation'
export const UploadDocumentSchema = Yup.object().shape({
    ticketNo: requiredTextValidation('Ticket No'),
    Remarks: optionalTextAreaValidation('Remarks'),
    Status: optionalTextValidation('Status'),
    DocumentName: optionalNumberStringValidation('Document Name'),
});

