import * as Yup from 'yup';
import { requiredTextValidation, optionalTextValidation } from './fields/text_validation';

export const UploadDocumentSchema = Yup.object().shape({
    ticketNo: requiredTextValidation('Ticket No'),
    Remarks: requiredTextValidation('Remarks'),
    Status: requiredTextValidation('Status'),
    DocStatus: optionalTextValidation('Doc Status'),
});

