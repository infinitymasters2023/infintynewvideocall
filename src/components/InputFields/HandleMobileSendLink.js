import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { allowOnlyMobileNumber, allowOnlyEmailAddresses } from '../../utils/helper'
import { useFormik, getIn } from 'formik';
import { ValidateMobileSchema } from '../../validation/send_link_validation';
import InputTextField from './InputTextField'

const HandleMobileSendLink = ({ mobiles, setMobiles }) => {

    const refArray = Array(2).fill(null).map(() => (null));
    const [MobileRef] = refArray;
    const handleSubmit = async () => {
        if (!getIn(formik.errors, 'mobile')) {
            mobiles.push(formik.values.mobile)
            await formik.setFieldValue('mobile', '')
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { mobile: '' },
        validationSchema: ValidateMobileSchema,
        onSubmit: handleSubmit,
    });

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        const transformValue = await allowOnlyMobileNumber(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
    }

    const handleRemoveMobile = async (item) => {
        const updatedMobiles = mobiles.filter((number) => number !== item);
        setMobiles(updatedMobiles)
    };

    return (
        <>
            {
                Array.isArray(mobiles) && mobiles.map((mobile, index) => {
                    return (
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text"
                                value={mobile}
                                className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 "
                                readOnly />
                            <a className="px-2 flex-shrink-0 inline-flex justify-center items-center " onClick={() => handleRemoveMobile(mobile)}>
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} />
                            </a>
                        </div>
                    )
                })
            }
            <label className="block text-sm font-medium leading-6 text-gray-600">Mobile:</label>
            <div className="flex rounded-lg shadow-sm">
                <InputTextField key="MobileInput"
                    fieldName="mobile"
                    value={formik.values.mobile}
                    placeholder="Enter Mobile"
                    inputFieldRef={MobileRef}
                    handleOnChange={handleInputChange}
                    maxLength={10}
                    minLength={10}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false} />
                <a className="px-2 flex-shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 " disabled={!formik.isValid || formik.isSubmitting} onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faPlus} style={{ color: 'black' }} />
                </a>
            </div>
            {getIn(formik.touched, `mobile`) && getIn(formik.errors, `mobile`) && <h4 className="text-xs text-red-700 px-2">{getIn(formik.errors, `mobile`)}</h4>}
        </>
    );
}

export default HandleMobileSendLink