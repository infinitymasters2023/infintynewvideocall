import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import {insertMeetingAPI, startMeetingAPI, joinMeetingAPI, serviceCallInfoAPI } from '../services/meeting_api'
import SendMeetingLink from "./SendMeetingLink"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const urlSegments = url.pathname.split('/');
  const urlMeetingId = urlSegments[urlSegments.length - 1]
  const mode = searchParams.get("mode");
  const participantMode = mode ? mode.toLowerCase() : '';
  const customRoomId = searchParams.get("qu");
  const userid = searchParams.get("userid");
  const [ticketInfo, setTicketInfo] = useState({});
  // const [participantInfo, setParticipantInfo] = useState({});

  useEffect(() => {
    if(urlMeetingId){
      setMeetingId(urlMeetingId)
    }
    if (customRoomId && userid) {
      fetchTicketInfo()
    }
  }, [urlMeetingId, customRoomId, userid]);

    const fetchTicketInfo = useCallback(async () => {
    if (customRoomId && userid) {
      const iData = { quNumber : customRoomId, userid : userid }
      await serviceCallInfoAPI(iData).then(async (response) => {
        if (response && response.isSuccess && response.statusCode == 200) {
          setTicketInfo(response.data)
        }
      })
        .catch((error) => {
        })
    }
  }, []);
  const handleMeetingCreate = useCallback(async (roomId) => {
    if(participantMode === 'agent'){
      const iData = {
        customRoomId: customRoomId,
        ticketNo: ticketInfo.TicketNO,
        roomId : roomId,
        userid : userid
      }
      await insertMeetingAPI(iData).then((response) => {
    }).catch((error) => {
      console.log('error', error);
    })
    }
  })

  const handleStartMeeting = useCallback(async (roomId) => {
    if(participantMode === 'agent'){
      const iData = {
        roomId: meetingId,
        fullName: participantName,
        mobile: ticketInfo.mobileno,
        email: ticketInfo.emailidaddress,
      }
      await startMeetingAPI(iData).then((response) => {
       
    }).catch((error) => {
      console.log('error', error);
    })
    }
  })
  const handleJoinMeeting = useCallback(async (roomId) => {
      const iData = {
        roomId: meetingId,
        fullName: participantName,
        mobile: ticketInfo.mobileno,
        email: ticketInfo.emailidaddress,
      }
      await joinMeetingAPI(iData).then((response) => {
       
    }).catch((error) => {
      console.log('error', error);
    })
  })

    const handleCopyLink = () => {
      const link = `https://meetings.infyshield.com/${meetingId}`;
      navigator.clipboard.writeText(link);
      setIsCopied(true);
      localStorage.setItem('meetingLink', link);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedInput = inputValue.replace(/\s\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');
    const isValidInput = /^[a-zA-Z\s]*$/.test(sanitizedInput);
    if (isValidInput) {
      setParticipantName(sanitizedInput);
    }
  };
  return (
    <div className={`flex flex-1 flex-col w-full md:p-[6px] sm:p-1 p-1.5`}>
      {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 flex items-center justify-center">
          <p className="text-white text-base mt-3 ">{`Ticket NO. : ${ticketInfo.TicketNO}`} </p>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={handleInputChange}
            maxlength={'20'}
            placeholder="Enter your name"
            className="px-4 py-3 mt-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
            }  text-white px-2 py-3 rounded-xl mt-2`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
                toast(`Join screen button clicked`, {
                  position: "bottom-left",
                  autoClose: 4000,
                  hideProgressBar: true,
                  closeButton: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                handleStartMeeting()
              } else {
                handleJoinMeeting()
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                  toast(`Join screen button clicked`, {
                    position: "bottom-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col justify-center h-full">
          { participantMode === 'agent' &&
          <button
            className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
            onClick={async (e) => {
              const meetingId = await _handleOnCreateMeeting();
              setMeetingId(meetingId);
              setIscreateMeetingClicked(true);
              handleMeetingCreate(meetingId)
            }}
          >
            Create a meeting
          </button>
          }
          { urlMeetingId !== '' &&
          <button
            className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
            onClick={(e) => {
              setIsJoinMeetingClicked(true);
              // handleJoinMeeting()
            }}
          >
            Join a meeting
          </button>
          }
        </div>
      )}
          {participantMode === 'agent' && participantName.length >= 3 && (
            <>
              <div className="flex items-center mt-3">
                <button className="flex items-center text-white" onClick={handleCopyLink}>
                  <p className="flex items-center">
                    Copy a link
                    {isCopied ? (
                      <CheckIcon className="text-green-400 ml-4" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5 text-white ml-1" />
                    )}
                  </p>
                </button>
                <div className="flex-grow"></div>
                <button className="text-white text-sm cursor-pointer" onClick={() => {
                        setModelOpen(true);
                      }}>
                  Send Link
                </button>
              </div>

            </>
  )}
  <Transition appear show={modelOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
                        setModelOpen(false);
                      }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="py-2">
                <a className="px-2 flex-shrink-0 inline-flex float-right " onClick={() => {
                        setModelOpen(false);
                      }}>
                                <FontAwesomeIcon icon={faXmark} style={{ color: 'red' }} />
                            </a>
            </div>
                  <SendMeetingLink key={'SendLink'} ticketInfo={ticketInfo} meetingId={meetingId} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

// import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
// import React, { useState, useEffect, useCallback } from "react";
// import { FaMobile, FaEnvelope } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import 'react-toastify/dist/ReactToastify.css';
// import { useLocation } from "react-router-dom";
// import { Button as BootstrapButton, Form, Modal } from 'react-bootstrap';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import { FiCopy } from 'react-icons/fi';
// import {createRoomMeetingAPI, insertMeetingAPI, startMeetingAPI, joinMeetingAPI, serviceCallInfoAPI } from '../services/meeting_api'
// import { useMeeting } from "@videosdk.live/react-sdk";
// import SendMeetingLink from "./SendMeetingLink"
// export function MeetingDetailsScreen({
//   onClickJoin,
//   _handleOnCreateMeeting,
//   participantName,
//   setParticipantName,
//   videoTrack,
//   setVideoTrack,
//   onClickStartMeeting,
// }) {
//   const location = useLocation();
//   const [meetingId, setMeetingId] = useState("");
//   const [meetingIdError, setMeetingIdError] = useState(false);
//   const [ticketNo, setTicketNo] = useState("");
//   const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
//   const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
//   const [isCopiedLink, setIsCopiedLink] = useState(false);
//   const [hasJoinedThroughLink, setHasJoinedThroughLink] = useState(false);
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [userId, setUserId] = useState("");
//   const [adminId, setAdminId] = useState("");
//   const [systemToken, setSystemToken] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [proxyEmail, setProxyEmail] = useState('');
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [isSendLinkButtonDisabled, setIsSendLinkButtonDisabled] = useState(true);
//   const [ticketInfo, setTicketInfo] = useState({});
//   const url = new URL(window.location.href);
//   const searchParams = new URLSearchParams(url.search);
//   const urlSegments = url.href.split('/');
//   const urlMeetingId = urlSegments[urlSegments.length - 1]
//   const mode = searchParams.get("mode");
//   const participantMode = mode ? mode.toLowerCase() : '';
//   const customRoomId = searchParams.get("qu");
//   const userid = searchParams.get("userid");

//   const fetchTicketInfo = useCallback(async () => {
//     if (customRoomId && userid) {
//       const iData = { quNumber : customRoomId, userid : userid }
//       await serviceCallInfoAPI(iData).then(async (response) => {
//         if (response && response.isSuccess && response.statusCode == 200) {
//           const {TicketNO } = response.data
//           setTicketInfo(response.data)
//           setTicketNo(TicketNO)
//         }
//       })
//         .catch((error) => {
//         })
//     }

//   }, []);

//   useEffect(() => {
//     setUserId(userid);
//     fetchTicketInfo()
//   }, []);



//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://meetings.infyshield.com/api/data');
//       const result = await response.json();
//       console.log('Fetched data:', result);
//     } catch (error) {
//       console.log('Error fetching data', error);

//     }
//   };

  


//   const handleCreateMeeting = async () => {
//     confirmAlert({
//       customUI: ({ onClose }) => {
//         return (
//           <div style={{ textAlign: 'center' }}>
//             <h1>Have you copied the link?</h1>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <button
//                 style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}
//                 onClick={async () => {
//                   onClose();
//                   handleCopyLink();
//                   await startMeetingAPI({
//                     roomId: meetingId,
//                     fullName: participantName,
//                     mobile: ticketInfo.mobileno,
//                     email: ticketInfo.emailidaddress,
//                   });
//                   if (videoTrack) {
//                     videoTrack.stop();
//                     setVideoTrack(null);
//                   }
//                   onClickStartMeeting();
//                   localStorage.setItem('ticketNo', ticketNo);
//                 }}
//               >
//                 <span style={{ marginRight: '5px' }}>Copy Link</span>
//                 <FiCopy size={16} color="#000" />
//               </button>
//               <button
//                 style={{ marginRight: '10px' }}
//                 onClick={async () => {
//                   onClose();
//                   await startMeetingAPI({
//                     roomId: meetingId,
//                     fullName: participantName,
//                     mobile: ticketInfo.mobileno,
//                     email: ticketInfo.emailidaddress,

//                   });
//                   if (videoTrack) {
//                     videoTrack.stop();
//                     setVideoTrack(null);
//                   }
//                   onClickStartMeeting();
//                   localStorage.setItem('ticketNo', ticketNo);
//                 }}
//               >
//                 Yes
//               </button>
//             </div>
//           </div>
//         );
//       },
//     });
//   };

//   const handleJoinMeeting = async () => {
//     if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
//       const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;
//       await startVideoRecordingAPI(link);
//       await insertMeetingParticipantAPI();
//       onClickJoin(meetingId);
//     } else {
//       setMeetingIdError(true);
//     }
//     localStorage.setItem('ticketNo', ticketNo);
//   };

//   const insertMeetingParticipantAPI = async () => {
//     const apiEndpoint = 'https://meetingsapi.infyshield.com/v1/master/insert_meeting_participant';

//     const requestData = {
//       fullName: participantName,
//       meetingId: meetingId,
//       mobile: mobileNumber,
//       email: email,
//       systemToken: systemToken,
//     };

//     try {
//       const response = await axios.post(apiEndpoint, requestData);

//       console.log('Insert Meeting Participant API Response:', response);

//       if (response.status === 200) {
//         console.log('Meeting participant inserted successfully');
//       } else {
//         console.log('Failed to insert meeting participant. Response:', response);
//       }
//     } catch (error) {
//       console.log('Error inserting meeting participant', error);
//     }
//   };


//   const startVideoRecordingAPI = async (link) => {
//     const apiEndpoint = 'https://meetingsapi.infyshield.com/v1/master/startVideoRecording';
//     const requestData = {
//       ticketNo: ticketNo,
//       startTime: new Date().toISOString(),
//       userid: userId,
//       meetingId: meetingId,
//       mobile: mobileNumber,
//       email: email,
//       meetingUrl: link,
//     };

//     try {
//       const response = await axios.post(apiEndpoint, requestData);

//       console.log('Start Video Recording API Response:', response);

//       if (response.status === 200) {
//         console.log('Video recording started successfully');
//       } else {
//         console.log('Failed to start video recording. Response:', response);
//       }
//     } catch (error) {
//       console.log('Error starting video recording', error);
//     }
//   };


//   useEffect(() => {
//     const urlSearchParams = new URLSearchParams(location.search);
//     const urlTicketNo = urlSearchParams.get("ticket");
//     const userJoinId = urlSearchParams.get("userId");
//     if (userJoinId) {
//       setAdminId(userJoinId);
//     }
//     if (urlMeetingId) {
//       setMeetingId(urlMeetingId);
//     }
//     if (urlTicketNo) {
//       setTicketNo(urlTicketNo);
//     }

//     if (urlMeetingId && urlTicketNo) {
//       setHasJoinedThroughLink(true);
//     }
//     const urlEmail = urlSearchParams.get("email");
//     const urlMobileNumber = urlSearchParams.get("mobileNumber");

//     if (urlEmail) {
//       setEmail(urlEmail);
//     }
//     if (urlMobileNumber) {
//       setMobileNumber(urlMobileNumber);
//     }

//   }, [location.search]);

//   const handleCopyLink = () => {
//     const link = `https://meetings.infyshield.com/?meetingId=${meetingId}&ticket=${ticketNo}&userId=${userId}&email=${email}&mobileNumber=${mobileNumber}`;
//     navigator.clipboard.writeText(link);
//     setIsCopiedLink(true);
//     localStorage.setItem('meetingLink', link);
//     setTimeout(() => {
//       setIsCopiedLink(false);
//     }, 3000);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
//   ;
//   const handleInputChange = (e) => {
//     const inputValue = e.target.value;
//     const sanitizedInput = inputValue.replace(/\s\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');
//     const isValidInput = /^[a-zA-Z\s]*$/.test(sanitizedInput);
//     if (isValidInput) {
//       setParticipantName(sanitizedInput);
//       localStorage.setItem('participantName', sanitizedInput);
//     }
//   };


//   return (
//     <div className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}>
//       {iscreateMeetingClicked || (isJoinMeetingClicked && hasJoinedThroughLink) ? (
//         <>
//           {(participantMode === 'agent') ? (
//             <input
//               value={ticketInfo.TicketNO}
//               onChange={(e) => setTicketNo(e.target.value)}
//               placeholder="Enter ticket number"
//               className="px-4 py-3 mt-3 bg-gray-650 rounded-xl text-white w-full text-center"
//               readOnly
//             />
//           ) : null}
//           <input
//             value={participantName}
//             onChange={handleInputChange}
//             placeholder="Enter your name"
//             className="px-4 py-3 mt-3 bg-gray-650 rounded-xl text-white w-full text-center"
//             maxLength={20}
//           />

//           {(participantMode === 'agent') ? (
//             <button
//               className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
//                 }  text-white px-2 py-3 rounded-xl mt-3`}
//               onClick={handleCreateMeeting}
//               disabled={participantName.length < 2}
//             >
//               Start a meeting
//             </button>

//           ) : (
//             <button
//               className={`w-full ${participantName.length > 2 ? "bg-purple-350" : "bg-yellow-650"
//                 } text-white px-2 py-3 rounded-xl mt-3`}
//               onClick={async (e) => {
//                 await handleJoinMeeting();
//                 await joinMeetingAPI({ roomId: meetingId, fullName: participantName, mobile: mobileNumber, email: email })
//               }}
//               disabled={participantName.length < 2}
//             >
//               Join a meeting
//             </button>
//           )}
//           {adminId == '' && userId !== '' && participantName.length >= 3 && (
//             <>
//               <div className="flex items-center mt-3">
//                 <button className="flex items-center text-white" onClick={handleCopyLink}>
//                   <p className="flex items-center">
//                     Copy a link
//                     {isCopiedLink ? (
//                       <CheckIcon className="text-green-400 ml-4" />
//                     ) : (
//                       <ClipboardIcon className="h-5 w-5 text-white ml-1" />
//                     )}
//                   </p>
//                 </button>
//                 <div className="flex-grow"></div>
//                 <button className="text-white text-sm cursor-pointer" onClick={openModal}>
//                   Send Link
//                 </button>
//                 <Modal show={isModalOpen} onHide={closeModal} centered size="md">
//                   <Modal.Header closeButton>
//                     <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '15px', fontWeight: '500' }} >
//                       Send Link
//                     </Modal.Title>
//                   </Modal.Header>
//                   <Modal.Body>
//                   <SendMeetingLink key={'SendLink'} ticketInfo={ticketInfo} />
//                   </Modal.Body>
//                 </Modal>

//               </div>

//             </>
//           )}
//         </>
//       ) : null}
//       <div className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}>
//         {!iscreateMeetingClicked && !isJoinMeetingClicked && (
//           <>
//             <div className="w-full md:mt-0 mt-4 flex flex-col">
//               <div className="flex items-center justify-center flex-col w-full ">

//                 {participantMode === 'agent' && urlMeetingId !== '' && (
//                   <button
//                     className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
//                     onClick={async (e) => {
//                       const meetingId = await _handleOnCreateMeeting();
//                       setMeetingId(meetingId);
//                       setIscreateMeetingClicked(true);
//                       await insertMeetingAPI({
//                         roomId: meetingId,
//                         customRoomId: customRoomId,
//                         ticketNo: ticketInfo.TicketNO,
//                         roomId : meetingId,
//                         userid : userid
//                       });
//                     }}
//                   >
//                     Create a meeting
//                   </button>
//                 )}
//                 {urlMeetingId !== '' && participantName.length < 3 && (
//                   <button
//                     className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-3"
//                     onClick={(e) => {
//                       setIsJoinMeetingClicked(true);
//                     }}
//                   >
//                     Join a meeting
//                   </button>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }