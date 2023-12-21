import * as Yup from 'yup';
import { requiredTextValidation, optionalTextValidation } from './fields/text_validation';
import { requiredNumberStringValidation } from './fields/number_validation'
import { requiredTextAreaValidation } from './fields/textarea_validation'
export const UploadDocumentSchema = Yup.object().shape({
    ticketNo: requiredTextValidation('Ticket No'),
    Remarks: requiredTextAreaValidation('Remarks'),
    Status: requiredTextValidation('Status'),
    DocumentName: requiredNumberStringValidation('Document Name'),
});

