import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { FaMobile, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import { Button as BootstrapButton, Form, Modal, Col, Container, Row } from 'react-bootstrap';
import MeetingScheduler from "./MeetingScheduler";
import MeetingForm from "./MeetingScheduler";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FiCopy } from 'react-icons/fi';
import { insertMeetingAPI, startMeetingAPI, joinMeetingAPI } from '../../src/services/meeting_api'
import { useMeeting } from "@videosdk.live/react-sdk";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}) {
  const location = useLocation();
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [ticketNo, setTicketNo] = useState("");
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [hasJoinedThroughLink, setHasJoinedThroughLink] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [systemToken, setSystemToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proxyEmail, setProxyEmail] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isSendLinkButtonDisabled, setIsSendLinkButtonDisabled] = useState(true);
  useEffect(() => {
    setUserId(uuidv4());
    const storedTicketNo = localStorage.getItem('ticketNo');
    if (storedTicketNo) {
      setTicketNo(storedTicketNo);
    }
  }, []);



  const fetchData = async () => {
    try {
      const response = await fetch('https://meetings.infyshield.com/api/data');
      const result = await response.json();
      console.log('Fetched data:', result);
    } catch (error) {
      console.log('Error fetching data', error);

    }
  };

  // const createMeeting = async () => {
  //   try {
  //     // First API call to get the access token
  //     const responseToken = await axios.post(
  //       'https://meetingsapi.infyshield.com/v1/meeting/tokenGeneration',
  //       {
  //         roomId: meetingId,
  //         participantId: '',
  //         roles: 'crawler',
  //       },
  //       {
  //         headers: {
  //           accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const { data: dataToken } = responseToken;

  //     if (dataToken.statusCode === 200) {
  //       // Store the access token in session storage
  //       const { accessToken } = dataToken.data;
  //       sessionStorage.setItem('accessToken', accessToken);

  //       // Generate formatted date (yy-mm-dd hh:mm:ss)
  //       const now = new Date();
  //       const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
  //         .toString()
  //         .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
  //         .getHours()
  //         .toString()
  //         .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
  //         .getSeconds()
  //         .toString()
  //         .padStart(2, '0')}`;

  //       // Second API call to create a meeting using the obtained access token
  //       const responseMeeting = await axios.post(
  //         'https://meetingsapi.infyshield.com/v1/room/create',
  //         {
  //           roomId: meetingId,
  //           customRoomId: meetingId + '_' + formattedDate,
  //           ticketNo:  meetingId, // Replace 'string' with the actual ticket number
  //         },
  //         {
  //           headers: {
  //             accept: 'application/json',
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
  //           },
  //         }
  //       );

  //       const { data: dataMeeting } = responseMeeting;

  //       if (dataMeeting.statusCode === 200) {
  //         console.log('Meeting created successfully:', dataMeeting.data);

  //         // You can store any relevant information in session storage or state if needed
  //         return dataMeeting.data.meetingId;
  //       } else {
  //         console.log('Failed to create meeting. Response:', responseMeeting);
  //         return null;
  //       }
  //     } else {
  //       console.log('Failed to get access token. Response:', responseToken);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error creating meeting:', error);
  //     return null;
  //   }
  // };

  // const createMeeting = async () => {
  //   try {
  //     await tokenGeneration({
  //       roomId: meetingId,
  //       participantId: '',
  //       roles: 'crawler',
  //     }).then((response) => {
  //       console.log('res', response);
  //     }).catch((error) => {
  //       console.log('error', error);
  //     })
  //   } catch (error) {
  //     console.error('Error creating meeting:', error);
  //     return null;
  //   }
  // };

  // const createVideoMeetingAPI = async () => {
  //   const apiEndpoint = 'https://meetingsapi.infyshield.com/v1/meeting/start_meeting';

  //   const accessToken = sessionStorage.getItem('accessToken');
  //   console.log('tokenvalue', accessToken);

  //   const requestData = {
  //     accessToken: accessToken,
  //     roomId: meetingId,
  //     ticketNo: ticketNo,
  //     mobile: mobileNumber,
  //     email: email,
  //     fullName: participantName,
  //   };

  //   try {
  //     const response = await axios.post(apiEndpoint, requestData, {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     console.log('Create Video Meeting API Response:', response);

  //     if (response.status === 200) {
  //       console.log('Video meeting created successfully');
  //     } else {
  //       console.log('Failed to create video meeting. Response:', response);
  //     }
  //   } catch (error) {
  //     console.log('Error creating video meeting', error);
  //   }
  // };
  const handleCreateMeeting = async () => {



    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <h1>Have you copied the link?</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}
                onClick={async () => {
                  onClose();
                  handleCopyLink();
                  await startMeetingAPI({
                    roomId: meetingId,
                    fullName: participantName,
                    mobile: mobileNumber,
                    email: email,
                  });
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                  localStorage.setItem('ticketNo', ticketNo);
                }}
              >
                <span style={{ marginRight: '5px' }}>Copy Link</span>
                <FiCopy size={16} color="#000" />
              </button>
              <button
                style={{ marginRight: '10px' }}
                onClick={async () => {
                  onClose();
                  await startMeetingAPI({
                    roomId: meetingId,
                    fullName: participantName,
                    mobile: mobileNumber,
                    email: email,
                  });
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                  localStorage.setItem('ticketNo', ticketNo);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        );
      },
    });
  };





  const handleJoinMeeting = async () => {
    if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
      const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;
      await startVideoRecordingAPI(link);
      await insertMeetingParticipantAPI();
      onClickJoin(meetingId);
    } else {
      setMeetingIdError(true);
    }
    localStorage.setItem('ticketNo', ticketNo);
  };

  const insertMeetingParticipantAPI = async () => {
    const apiEndpoint = 'https://meetingsapi.infyshield.com/v1/master/insert_meeting_participant';

    const requestData = {
      fullName: participantName,
      meetingId: meetingId,
      mobile: mobileNumber,
      email: email,
      systemToken: systemToken,
    };

    try {
      const response = await axios.post(apiEndpoint, requestData);

      console.log('Insert Meeting Participant API Response:', response);

      if (response.status === 200) {
        console.log('Meeting participant inserted successfully');
      } else {
        console.log('Failed to insert meeting participant. Response:', response);
      }
    } catch (error) {
      console.log('Error inserting meeting participant', error);
    }
  };


  const startVideoRecordingAPI = async (link) => {
    const apiEndpoint = 'https://meetingsapi.infyshield.com/v1/master/startVideoRecording';
    const requestData = {
      ticketNo: ticketNo,
      startTime: new Date().toISOString(),
      userid: userId,
      meetingId: meetingId,
      mobile: mobileNumber,
      email: email,
      meetingUrl: link,
    };

    try {
      const response = await axios.post(apiEndpoint, requestData);

      console.log('Start Video Recording API Response:', response);

      if (response.status === 200) {
        console.log('Video recording started successfully');
      } else {
        console.log('Failed to start video recording. Response:', response);
      }
    } catch (error) {
      console.log('Error starting video recording', error);
    }
  };

  const handleCheckboxChange = (contact) => {
    const updatedContacts = selectedContacts.includes(contact)
      ? selectedContacts.filter((c) => c !== contact)
      : [...selectedContacts, contact];

    setSelectedContacts(updatedContacts);
  };

  const handleSendLinkToSelected = async () => {
    for (const contact of selectedContacts) {
      const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;

      try {

        await axios.post('your_send_link_api_endpoint', {
          email: contact.email,
          mobile: contact.mobile,
          sendToOtp: "Email",
          meetingId: meetingId,
          ticket: ticketNo,
          meetingurl: link,
        });

        toast.success(`Link sent to ${contact.email || contact.mobile} successfully!`);
      } catch (error) {
        console.log('Error sending link', error);
        toast.error('Failed to send link');
      }
    }
  };



  const handleSendLinkToEmail = async () => {
    const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;

    try {
      const response = await axios.post(
        'https://retailerapi.infinitywarranty.in/v1/auth/send-meeting-link',
        {
          email: email,
          proxyEmail: proxyEmail,
          mobile: mobileNumber,
          sendToOtp: "Email",
          meetingId: meetingId,
          ticket: ticketNo,
          meetingurl: link,
        }
      );

      console.log('Request Payload:', {
        email: email,
        proxyEmail: proxyEmail,
        mobile: mobileNumber,
        sendToOtp: "Mobile",
        meetingId: meetingId,
        ticket: ticketNo,
        meetingurl: link,
      });

      console.log('Response:', response);

      if (response.status === 200) {
        console.log('Email sent successfully');
      } else {
        console.log('Failed to send email. Response:', response);
      }
    } catch (error) {
      console.log('Error sending email', error);
    }
    toast.success('Email link sent successfully!');
  };

  const handleSendLinkToMobile = async () => {
    const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;

    try {
      const response = await axios.post(
        'https://retailerapi.infinitywarranty.in/v1/auth/send-meeting-link',
        {
          email: email,
          mobile: mobileNumber,
          sendToOtp: "Mobile",
          meetingId: meetingId,
          ticket: ticketNo,
          meetingurl: link,
        }
      );
      if (response.status === 200) {
        console.log('Link sent to mobile number successfully');
      } else {
        console.log('Failed to send link to mobile number. Response:', response);
      }
    } catch (error) {
      console.log('Error sending link to mobile number', error);
    }
    toast.success(' link sent on Mobile successfully!');
  };

  useEffect(() => {
    fetchData();
    const urlSearchParams = new URLSearchParams(location.search);
    const urlMeetingId = urlSearchParams.get("meetingId");
    const urlTicketNo = urlSearchParams.get("ticket");
    const userJoinId = urlSearchParams.get("userId");
    if (userJoinId) {
      setAdminId(userJoinId);
    }
    if (urlMeetingId) {
      setMeetingId(urlMeetingId);
    }
    if (urlTicketNo) {
      setTicketNo(urlTicketNo);
    }

    if (urlMeetingId && urlTicketNo) {
      setHasJoinedThroughLink(true);
    }
    const urlEmail = urlSearchParams.get("email");
    const urlMobileNumber = urlSearchParams.get("mobileNumber");

    if (urlEmail) {
      setEmail(urlEmail);
    }
    if (urlMobileNumber) {
      setMobileNumber(urlMobileNumber);
    }

  }, [location.search]);

  const handleCopyLink = () => {
    const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;
    navigator.clipboard.writeText(link);
    setIsCopiedLink(true);
    localStorage.setItem('meetingLink', link);
    setTimeout(() => {
      setIsCopiedLink(false);
    }, 3000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  ;
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedInput = inputValue.replace(/\s\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');
    const isValidInput = /^[a-zA-Z\s]*$/.test(sanitizedInput);
    if (isValidInput) {
      setParticipantName(sanitizedInput);
      localStorage.setItem('participantName', sanitizedInput);
    }
  };


  return (
    <div className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}>
      {iscreateMeetingClicked || (isJoinMeetingClicked && hasJoinedThroughLink) ? (
        <>
          <input
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            placeholder="Enter ticket number"
            className="px-4 py-3 mt-3 bg-gray-650 rounded-xl text-white w-full text-center"
            readOnly
          />
          <input
            value={participantName}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="px-4 py-3 mt-3 bg-gray-650 rounded-xl text-white w-full text-center"
            maxLength={20}
          />

          {(adminId === '') ? (
            <button
              className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
                }  text-white px-2 py-3 rounded-xl mt-3`}
              onClick={handleCreateMeeting}
              disabled={participantName.length < 2}
            >
              Start a meeting
            </button>

          ) : (
            <button
              className={`w-full ${participantName.length > 2 ? "bg-purple-350" : "bg-yellow-650"
                } text-white px-2 py-3 rounded-xl mt-3`}
              onClick={async (e) => {
                await handleJoinMeeting();
                await joinMeetingAPI({ roomId: meetingId , fullName : participantName, mobile : mobileNumber, email : email  })
              }}
              disabled={participantName.length < 2}
            >
              Join a meeting
            </button>
          )}
          {adminId == '' && userId !== '' && participantName.length >= 3 && (
            <>
              <div className="flex items-center mt-3">
                <button className="flex items-center text-white" onClick={handleCopyLink}>
                  <p className="flex items-center">
                    Copy a link
                    {isCopiedLink ? (
                      <CheckIcon className="text-green-400 ml-4" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5 text-white ml-1" />
                    )}
                  </p>
                </button>
                <div className="flex-grow"></div>
                <button className="text-white text-sm cursor-pointer" onClick={openModal}>
                  Send Link
                </button>
                <Modal show={isModalOpen} onHide={closeModal} centered size="xl">
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '15px', fontWeight: '500' }} >
                      Send Link
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <div className="grid grid-cols-2 gap-1 md-1">

                        {/* Left Side: Email */}
                        <div>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label>Mobile No:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  value={mobileNumber}
                                  onChange={(e) => setMobileNumber(e.target.value)}

                                  className="text-center border-2 px-1 py-1 border-black rounded-md"
                                  readOnly
                                  style={{ width: '300px' }}
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label>Proxy Mobile No:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input

                                  className="text-center border-2 px-1 py-1 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                          {/* Additional Phone Numbers */}
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label>Proxy Mobile No 1:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input

                                  className="text-center px-1 py-1 border-2 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label>Proxy Mobile No 2:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  className="text-center px-1 py-1 border-2 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>ASC Phone No:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  className="text-center px-1 py-1 border-2 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                          {/* Service Center Phone Number */}
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Service Center Phone No:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  className="text-center border-2 px-1 py-1 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>

                          {/* Dealer Phone Number */}
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label className="my-2">Dealer Phone No:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input

                                  className="text-center border-2 px-1 py-1 border-black rounded-md"
                                  style={{ width: '300px' }}
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaMobile
                                  className={`ml- ${mobileNumber.length === 0 ? 'text-gray-200' : 'text-black'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToMobile}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=""
                                />
                              </div>
                            </div>
                          </Form.Group>
                        </div>

                        {/* Right Side: Phone Numbers */}
                        <div>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}

                                  className="w-full text-center rounded-md border-2 border-black px-1 py-1 my-2"
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaEnvelope
                                  className={`text-sm mt-3 ${email.length === 0 ? 'text-gray-200' : 'text-black-200'
                                    } cursor-pointer`}
                                  onClick={handleSendLinkToEmail}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className="mt-3"
                                />
                              </div>
                            </div>
                          </Form.Group>

                          {/* Alternate Email */}
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Alternate Email:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  className="w-full   px-1 py-1 text-center rounded-md border-2 border-black"
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaEnvelope
                                  className={`text-sm mt-3 ${email.length === 0 ? 'text-gray-200' : 'text-black-200'
                                    } cursor-pointer`}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className="mt-3"
                                />
                              </div>
                            </div>
                          </Form.Group>
                          {/* Service Center Email */}
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Service Center Email:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input
                                  className="w-full text-center rounded-md border-2  px-1 py-1 border-black"
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-1">
                                <FaEnvelope
                                  className={`text-sm mt-3 ${email.length === 0 ? 'text-gray-200' : 'text-black-200'
                                    } cursor-pointer`}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className=" mt-3"
                                />
                              </div>
                            </div>
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Dealer Email:</Form.Label>
                            <div className="row">
                              <div className="col-8">
                                <input

                                  className="w-full px-1 py-1 text-center rounded-md border-2 border-black"
                                  readOnly
                                />
                              </div>
                              <div className="col-2 mt-3">
                                <FaEnvelope
                                  className={`text-sm ${email.length === 0 ? 'text-gray-200' : 'text-black-200'
                                    } cursor-pointer`}
                                />
                              </div>
                              <div className="col-1">
                                <input
                                  type="checkbox"
                                  id="sendToMobile"
                                  className="mt-3"
                                />
                              </div>
                            </div>
                          </Form.Group>
                        </div>
                      </div>

                      <Form.Group controlId="sendToSelected">
                        <Form.Check
                          type="checkbox"
                          label="Send Link to Selected"
                          onChange={() => {
                            setIsSendLinkButtonDisabled(!isSendLinkButtonDisabled);
                          }}
                        />
                      </Form.Group>

                      <BootstrapButton
                        variant="primary"
                        disabled={isSendLinkButtonDisabled}
                        onClick={handleSendLinkToSelected}
                        className="mt-3"
                      >
                        Send Link
                      </BootstrapButton>
                    </Form>
                  </Modal.Body>
                </Modal>

              </div>

            </>
          )}
        </>
      ) : null}
      <div className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}>
        {!iscreateMeetingClicked && !isJoinMeetingClicked && (
          <>
            <div className="w-full md:mt-0 mt-4 flex flex-col">
              <div className="flex items-center justify-center flex-col w-full ">

                {adminId === '' && userId !== '' && (
                  <button
                    className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
                    onClick={async (e) => {
                      const meetingId = await _handleOnCreateMeeting();
                      setMeetingId(meetingId);
                      setIscreateMeetingClicked(true);
                      await insertMeetingAPI({
                        roomId: meetingId,
                        customRoomId: meetingId,
                        ticketNo: meetingId
                      });
                      // createMeeting()
                    }}
                  >
                    Create a meeting
                  </button>
                )}
                {adminId !== '' && userId !== '' && adminId !== userId && participantName.length < 3 && (
                  <button
                    className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-3"
                    onClick={(e) => {
                      setIsJoinMeetingClicked(true);
                    }}
                  >
                    Join a meeting
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}