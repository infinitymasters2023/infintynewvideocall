import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { allowOnlyEmailAddresses } from '../../utils/helper'
import { useFormik, getIn } from 'formik';
import { ValidateEmailSchema } from '../../validation/send_link_validation';
import InputTextField from './InputTextField'

const HandleEmailSendLink = ({ emails, setEmail }) => {
    const refArray = Array(2).fill(null).map(() => (null));
    const [EmailRef] = refArray;
    const handleSubmit = async () => {
        if (!getIn(formik.errors, 'email') && formik.values.email) {
            emails.push(formik.values.email)
            const updatedEmail = [...new Set(emails)];
            setEmail(updatedEmail)
            await formik.setFieldValue('email', '')
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { email: '' },
        validationSchema: ValidateEmailSchema,
        onSubmit: handleSubmit,
    });

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        const transformValue = await allowOnlyEmailAddresses(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
    }

    const handleRemoveEmail = async (item) => {
        const updatedEmail = emails.filter((number) => number !== item);
        setEmail(updatedEmail)
    };

    const handleOnBlur = async (event) => {
        const { name } = event.currentTarget;
        switch (name) {
            case 'email':
                if (!getIn(formik.errors, 'email') && formik.values.email) {
                    emails.push(formik.values.email)
                    const updatedEmail = [...new Set(emails)];
                    setEmail(updatedEmail)
                }
                break;
            default:
                break;
        }
    }
    return (
        <>
            {
                Array.isArray(emails) && emails.map((email, index) => {
                    return (
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text"
                                value={email}
                                className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 "
                                readOnly />
                            <a className="px-2 flex-shrink-0 inline-flex justify-center items-center " onClick={() => handleRemoveEmail(email)}>
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} />
                            </a>
                        </div>
                    )
                })
            }
            <label className="block text-sm font-medium leading-6 text-gray-600">Email:</label>
            <div className="flex rounded-lg shadow-sm">
                <InputTextField key="EmailInput"
                    fieldName="email"
                    value={formik.values.email}
                    placeholder="Enter Email"
                    inputFieldRef={EmailRef}
                    handleOnChange={handleInputChange}
                    handleOnBlur={handleOnBlur}
                    maxLength={100}
                    minLength={8}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false} />
                <a className="px-2 flex-shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 " disabled={!formik.isValid || formik.isSubmitting} onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faPlus} style={{ color: 'black' }} />
                </a>
            </div>
            {getIn(formik.touched, `email`) && getIn(formik.errors, `email`) && <h4 className="text-xs text-red-700 px-2">{getIn(formik.errors, `email`)}</h4>}
        </>
    );
}

export default HandleEmailSendLink