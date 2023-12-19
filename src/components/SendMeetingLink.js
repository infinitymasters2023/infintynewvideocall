import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { allowOnlyMobileNumber, allowOnlyEmailAddresses } from '../utils/helper'
import { sendMeetingLinkAPI } from '../services/meeting_api'
import AddMobileSendLink from './InputFields/HandleMobileSendLink'
import HandleEmailSendLink from './InputFields/HandleEmailSendLink'
import { useMeeting } from "@videosdk.live/react-sdk";
const SendMeetingLink = ({ ticketInfo }) => {
    const {meetingId} = useMeeting();
    const [requestBody, setRequestBody] = useState([]);
    const [otherMobile, setOtherMobile] = useState([]);
    const [otherEmail, setOtherEmail] = useState([]);
    const handleSendMeetingLink = async (e) => {
        e.preventDefault();
        const sendids = [...requestBody, ...otherMobile, ...otherEmail];
        const iData = { sendTo: sendids, meetingLink: `https://meetings.infyshield.com/${meetingId}` }
        await sendMeetingLinkAPI(iData).then((response) => {
            if (response && response.isSuccess && response.statusCode === 200 && response.data) {
                setRequestBody([])
                setOtherMobile([])
                setOtherEmail([])
            }
        }).catch((error) => {
            console.log('error', error);
        })
    };
    const handleCheckboxChange = (event) => {
        const { checked, value } = event.target;
        const updatedRequestBody = [...requestBody];
        if (checked) {
            updatedRequestBody.push(value);
        } else {
            const indexToRemove = updatedRequestBody.indexOf(value);
            if (indexToRemove !== -1) {
                updatedRequestBody.splice(indexToRemove, 1);
            }
        }
        setRequestBody(updatedRequestBody);
    };

    return (
        <form method="Post" onSubmit={handleSendMeetingLink}>
            <h4 className="text-xs text-gray-700 px-2">Customer Name :<span className="text-gray-600 px-2">{ticketInfo?.customername}</span></h4>
            <div className="flex flex-row py-0">
                {ticketInfo?.emailidaddress &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="emailidaddress" value={ticketInfo?.emailidaddress} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.emailidaddress)}
                                        value={ticketInfo?.emailidaddress}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.mobileno &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="mobileno" value={ticketInfo?.mobileno} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.mobileno)}
                                        value={ticketInfo?.mobileno}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row py-0">
                {ticketInfo?.alternateEmailID &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Email Id</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="alternateEmailID" value={ticketInfo?.alternateEmailID} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.alternateEmailID)}
                                        value={ticketInfo?.alternateEmailID}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.landlineno &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="landlineno" value={ticketInfo?.landlineno} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.landlineno)}
                                        value={ticketInfo?.landlineno}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row py-1">
                {ticketInfo?.proxyMobile1 &&
                    <div className="basis-1/2 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Proxy Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="proxyMobile1" value={ticketInfo?.proxyMobile1} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.proxyMobile1)}
                                        value={ticketInfo?.proxyMobile1}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.proxyMobile2 &&
                    <div className="basis-1/2 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Proxy Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="proxyMobile2" value={ticketInfo?.proxyMobile2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.proxyMobile2)}
                                        value={ticketInfo?.proxyMobile2}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <hr/>
            <h4 className="text-xs text-gray-700 px-2">Service Center Name :<span className="text-gray-600 px-2">{ticketInfo?.serviceCenterName}</span></h4>
            <div className="flex flex-row">
                {ticketInfo?.serviceCenterEmail &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="serviceCenterEmail" value={ticketInfo?.serviceCenterEmail} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.serviceCenterEmail)}
                                        value={ticketInfo?.serviceCenterEmail}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.serviceCenterMobile &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="serviceCenterMobile" value={ticketInfo?.serviceCenterMobile} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.serviceCenterMobile)}
                                        value={ticketInfo?.serviceCenterMobile}
                                    />
                                </span>
                            </div>
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
                            <input type="text" name="dealerEmailID" value={ticketInfo?.dealerEmailID} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.dealerEmailID)}
                                        value={ticketInfo?.dealerEmailID}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.dealerMobileNo &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="dealerMobileNo" value={ticketInfo?.dealerMobileNo} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.dealerMobileNo)}
                                        value={ticketInfo?.dealerMobileNo}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row py-0">
                {ticketInfo?.dealerEmailID2 &&
                    <div className="basis-7/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Alternate Email Id:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="dealerEmailID2" value={ticketInfo?.dealerEmailID2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.dealerEmailID2)}
                                        value={ticketInfo?.dealerEmailID2}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
                {ticketInfo?.dealerMobileNo2 &&
                    <div className="basis-5/12 px-2">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Mobile No:</label>
                        <div className="flex rounded-lg shadow-sm">
                            <input type="text" name="dealerMobileNo2" value={ticketInfo?.dealerMobileNo2} className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 " readOnly />
                            <div className="px-2 inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-gray-200 dark:border-gray-600">
                                <span className="text-sm text-gray-500 dark:text-gray-600">
                                    <input type="checkbox"
                                        className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        onChange={handleCheckboxChange}
                                        checked={requestBody.includes(ticketInfo?.dealerMobileNo2)}
                                        value={ticketInfo?.dealerMobileNo2}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <hr />
            <h4 className="text-xs text-gray-700 px-2">Send To Others</h4>
            <div className="flex flex-row py-0">
                <div className="basis-5/12 px-2">
                    <AddMobileSendLink key={`MobileLink`} mobiles={otherMobile} setMobiles={setOtherMobile} />
                </div>
                <div className="basis-7/12 px-2">
                    <HandleEmailSendLink key={`EmailLink`} emails={otherEmail} setEmail={setOtherEmail} />
                </div>
            </div>
            <div className="py-2">
                <button type="submit" className="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 float-right">
                    Send Link
                </button>
            </div>
        </form>
    );
}

export default SendMeetingLink;