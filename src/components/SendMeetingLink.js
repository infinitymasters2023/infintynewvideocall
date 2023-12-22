import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { allowOnlyMobileNumber, allowOnlyEmailAddresses } from '../utils/helper'
import { sendMeetingLinkAPI } from '../services/meeting_api'
import AddMobileSendLink from './InputFields/HandleMobileSendLink'
import HandleEmailSendLink from './InputFields/HandleEmailSendLink'
import { useMeeting } from "@videosdk.live/react-sdk";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SendMeetLinkSchema } from '../validation/send_link_validation'
import { useFormik, getIn } from 'formik';

const SendMeetingLink = ({ ticketInfo, meetingId }) => {
    const handleInputChange = async (event) => {
        const { name, checked, value, type } = event.target;
        var transformValue = ''
        if (type === 'checkbox') {
            if (checked) {
                switch (name) {
                    case 'mobileno':
                    case 'landlineno':
                    case 'proxyMobile1':
                    case 'proxyMobile2':
                    case 'serviceCenterMobile':
                    case 'dealerMobileNo':
                    case 'dealerMobileNo2':
                        transformValue = await allowOnlyMobileNumber(value)
                        await formik.setFieldValue(name, transformValue)
                        await formik.setFieldTouched(name, true)
                        break;
                    case 'emailidaddress':
                    case 'alternateEmailID':
                    case 'serviceCenterEmail':
                    case 'dealerEmailID':
                    case 'dealerEmailID2':
                        transformValue = await allowOnlyEmailAddresses(value)
                        await formik.setFieldValue(name, transformValue)
                        await formik.setFieldTouched(name, true)
                        break;
                    default:
                        await formik.setFieldValue(name, value)
                        await formik.setFieldTouched(name, true)
                        break;
                }
            } else {
                await formik.setFieldValue(name, '')
                await formik.setFieldTouched(name, true)
            }
        }
        else {
            const parts = name.split('[');
            switch (parts[0]) {
                case 'otherMobile':
                    transformValue = await allowOnlyMobileNumber(value)
                    await formik.setFieldValue(name, transformValue)
                    await formik.setFieldTouched(name, true)
                    break;
                case 'otherEmail':
                    transformValue = await allowOnlyEmailAddresses(value)
                    await formik.setFieldValue(name, transformValue)
                    await formik.setFieldTouched(name, true)
                    break;
                default:
                    await formik.setFieldValue(name, value)
                    await formik.setFieldTouched(name, true)
                    break;
            }
        }
    };

    const handleSubmit = async () => {
        await sendMeetingLinkAPI(formik.values).then((response) => {
            if (response && response.isSuccess && response.statusCode === 200 && response.data) {
                formik.resetForm()
                
            }
        }).catch((error) => {
            console.log('error', error);
        })
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            emailidaddress: '',
            mobileno: '',
            alternateEmailID: '',
            landlineno: '',
            proxyMobile1: '',
            proxyMobile2: '',
            serviceCenterEmail: '',
            serviceCenterMobile: '',
            dealerEmailID: '',
            dealerMobileNo: '',
            dealerEmailID2: '',
            dealerMobileNo2: '',
            otherEmail: [],
            otherMobile: [],
            meetingLink : `https://meetings.infyshield.com/${meetingId}`
        },
        validationSchema: SendMeetLinkSchema,
        onSubmit: handleSubmit,
    });

    const handleRemoveEmail = async (item) => {
        const updatedEmail = formik.values.otherEmail.filter((number) => number !== item);
        formik.setFieldValue('otherEmail', updatedEmail)
    };

    const handleRemoveMobile = async (item) => {
        const updatedMobiles = formik.values.otherMobile.filter((number) => number !== item);
        formik.setFieldValue('otherMobile', updatedMobiles)
    };
    return (
        <form method="Post" onSubmit={formik.handleSubmit}>
            <h4 className="text-xs text-gray-700 px-2">Customer Name :<span className="text-gray-600 px-2">{ticketInfo?.customername}</span></h4>
            <div className="flex flex-row py-0">
                {ticketInfo?.emailidaddress &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.emailidaddress} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="emailidaddress"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.emailidaddress === formik.values.emailidaddress) ? true : false}
                                        value={ticketInfo?.emailidaddress}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `emailidaddress`) && getIn(formik.errors, `emailidaddress`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `emailidaddress`)}</h4>}
                    </div>
                }
                {ticketInfo?.mobileno &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.mobileno} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="mobileno"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.mobileno === formik.values.mobileno) ? true : false}
                                        value={ticketInfo?.mobileno}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `mobileno`) && getIn(formik.errors, `mobileno`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `mobileno`)}</h4>}
                    </div>
                }
            </div>
            <div className="flex flex-row py-0">
                {ticketInfo?.alternateEmailID &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Email Id</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.alternateEmailID} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="alternateEmailID"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.alternateEmailID === formik.values.alternateEmailID) ? true : false}
                                        value={ticketInfo?.alternateEmailID}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `alternateEmailID`) && getIn(formik.errors, `alternateEmailID`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `alternateEmailID`)}</h4>}
                    </div>
                }
                {ticketInfo?.landlineno &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.landlineno} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="landlineno"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.landlineno === formik.values.landlineno) ? true : false}
                                        value={ticketInfo?.landlineno}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `landlineno`) && getIn(formik.errors, `landlineno`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `landlineno`)}</h4>}
                    </div>
                }
            </div>
            <div className="flex flex-row py-1">
                {ticketInfo?.proxyMobile1 &&
                    <div className="basis-1/2 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Proxy Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.proxyMobile1} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="proxyMobile1"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.proxyMobile1 === formik.values.proxyMobile1) ? true : false}
                                        value={ticketInfo?.proxyMobile1}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `proxyMobile1`) && getIn(formik.errors, `proxyMobile1`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `proxyMobile1`)}</h4>}
                    </div>
                }
                {ticketInfo?.proxyMobile2 &&
                    <div className="basis-1/2 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Proxy Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.proxyMobile2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="proxyMobile2"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.proxyMobile1 === formik.values.proxyMobile1) ? true : false}
                                        value={ticketInfo?.proxyMobile2}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `proxyMobile2`) && getIn(formik.errors, `proxyMobile2`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `proxyMobile2`)}</h4>}
                    </div>
                }
            </div>
            <hr />
            <h4 className="text-xs text-gray-700 px-2">Service Center Name :<span className="text-gray-600 px-2">{ticketInfo?.serviceCenterName}</span></h4>
            <div className="flex flex-row">
                {ticketInfo?.serviceCenterEmail &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.serviceCenterEmail} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="serviceCenterEmail"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.serviceCenterEmail === formik.values.serviceCenterEmail) ? true : false}
                                        value={ticketInfo?.serviceCenterEmail}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `serviceCenterEmail`) && getIn(formik.errors, `serviceCenterEmail`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `serviceCenterEmail`)}</h4>}
                    </div>
                }
                {ticketInfo?.serviceCenterMobile &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.serviceCenterMobile} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="serviceCenterMobile"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.serviceCenterMobile === formik.values.serviceCenterMobile) ? true : false}
                                        value={ticketInfo?.serviceCenterMobile}
                                    />
                                </span>
                            </div>
                            {getIn(formik.touched, `serviceCenterMobile`) && getIn(formik.errors, `serviceCenterMobile`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `serviceCenterMobile`)}</h4>}
                        </div>
                    </div>
                }
            </div>
            <hr />
            <h4 className="text-xs text-gray-700 px-2">Dealer Name :<span className="text-gray-600 px-2">{ticketInfo?.dealerName}</span></h4>
            <div className="flex flex-row py-0">
                {ticketInfo?.dealerEmailID &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.dealerEmailID} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="dealerEmailID"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.dealerEmailID === formik.values.dealerEmailID) ? true : false}
                                        value={ticketInfo?.dealerEmailID}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `dealerEmailID`) && getIn(formik.errors, `dealerEmailID`) && <h4 className="block font-medium leading-6 text-xs text-red px-2">{getIn(formik.errors, `dealerEmailID`)}</h4>}
                    </div>
                }
                {ticketInfo?.dealerMobileNo &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.dealerMobileNo} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="dealerMobileNo"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.dealerMobileNo === formik.values.dealerMobileNo) ? true : false}
                                        value={ticketInfo?.dealerMobileNo}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `dealerMobileNo`) && getIn(formik.errors, `dealerMobileNo`) &&
                            <h4 className="block font-medium leading-6 text-xs text-red px-2">
                                {getIn(formik.errors, `dealerMobileNo`)}
                            </h4>
                        }
                    </div>
                }
            </div>
            <div className="flex flex-row py-0">
                {ticketInfo?.dealerEmailID2 &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.dealerEmailID2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="dealerEmailID2"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.dealerEmailID2 === formik.values.dealerEmailID2) ? true : false}
                                        value={ticketInfo?.dealerEmailID2}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `dealerEmailID2`) && getIn(formik.errors, `dealerEmailID2`) &&
                            <h4 className="block font-medium leading-6 text-xs text-red px-2">
                                {getIn(formik.errors, `dealerEmailID2`)}
                            </h4>
                        }
                    </div>
                }
                {ticketInfo?.dealerMobileNo2 &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" value={ticketInfo?.dealerMobileNo2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        name="dealerMobileNo2"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleInputChange}
                                        checked={(ticketInfo?.dealerEmailID2 === formik.values.dealerEmailID2) ? true : false}
                                        value={ticketInfo?.dealerMobileNo2}
                                    />
                                </span>
                            </div>
                        </div>
                        {getIn(formik.touched, `dealerMobileNo2`) && getIn(formik.errors, `dealerMobileNo2`) &&
                            <h4 className="block font-medium leading-6 text-xs text-red px-2">
                                {getIn(formik.errors, `dealerMobileNo2`)}
                            </h4>
                        }
                    </div>
                }
            </div>
            <hr />
            <h4 className="text-xs text-gray-700 px-2">Send To Others</h4>
            <div className="flex flex-row py-0">
                <div className="basis-7/12 px-2">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="col-start-1">
                            <label className="text-sm font-medium text-gray-600">Email Id:</label>
                        </div>
                        <div class="col-end-5 col-span-1">
                            <a className="px-2 py-1 rounded border" onClick={() => {
                                if (!getIn(formik.errors, 'otherEmail')) {
                                    const updatedEmail = [...new Set(formik.values.otherEmail), ''];
                                    formik.setFieldValue('otherEmail', updatedEmail)
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} style={{ color: 'black' }} />
                            </a>
                        </div>
                    </div>
                    {
                        Array.isArray(formik.values.otherEmail) && formik.values.otherEmail.map((email, emailIndex) => {
                            return (<div className="flex-row py-1" key={`email_${emailIndex}`}>
                                <div className="flex rounded-lg shadow-sm">
                                    <input type="text"
                                        name={`otherEmail[${emailIndex}]`}
                                        value={email}
                                        onChange={handleInputChange}
                                        className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 "
                                    />
                                    <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                        <span className="text-sm text-gray-500 dark:text-gray-600">
                                            <a className="px-2 flex-shrink-0 inline-flex justify-center items-center " onClick={() => handleRemoveEmail(email)}>
                                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} />
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                {getIn(formik.touched, `otherEmail.${emailIndex}`) && getIn(formik.errors, `otherEmail.${emailIndex}`) &&
                                    <h4 className="block font-medium leading-6 text-xs px-2" style={{ color: 'red' }} >
                                        {getIn(formik.errors, `otherEmail.${emailIndex}`)}
                                    </h4>
                                }
                            </div>)
                        })
                    }
                </div>
                <div className="basis-5/12 px-2">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="col-start-1">
                            <label className="text-sm font-medium text-gray-600">Mobile No:</label>
                        </div>
                        <div class="col-end-5 col-span-1">
                            <a className="px-2 py-1 rounded border" onClick={() => {
                                if (!getIn(formik.errors, 'otherMobile')) {
                                    const updatedMobile = [...new Set(formik.values.otherMobile), ''];
                                    formik.setFieldValue('otherMobile', updatedMobile)
                                }
                            }}>
                                <FontAwesomeIcon icon={faPlus} style={{ color: 'black' }} />
                            </a>
                        </div>
                    </div>
                    {
                        Array.isArray(formik.values.otherMobile) && formik.values.otherMobile.map((mobile, mobileIndex) => {
                            return (<div className="flex-row py-1" key={`mobile_${mobileIndex}`}>
                                <div className="flex rounded-lg shadow-sm">
                                    <input type="text"
                                        name={`otherMobile[${mobileIndex}]`}
                                        value={mobile}
                                        onChange={handleInputChange}
                                        className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 "
                                    />
                                    <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                        <span className="text-sm text-gray-500 dark:text-gray-600">
                                            <a className="px-2 flex-shrink-0 inline-flex justify-center items-center " onClick={() => handleRemoveMobile(mobile)}>
                                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} />
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                {getIn(formik.touched, `otherMobile.${mobileIndex}`) && getIn(formik.errors, `otherMobile.${mobileIndex}`) &&
                                    <h4 className="block font-medium leading-6 text-xs px-2" style={{ color: 'red' }} >
                                        {getIn(formik.errors, `otherMobile.${mobileIndex}`)}
                                    </h4>
                                }
                            </div>)
                        })
                    }
                </div>
            </div>
            <div className="py-2">
                <button type="submit"
                    disabled={!formik.isValid || formik.isSubmitting || !Object.values(formik.values).flat().some(value => value !== '')}
                    className="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 float-right">
                    Send Link
                </button>
            </div>
        </form>
    );
}

export default SendMeetingLink;