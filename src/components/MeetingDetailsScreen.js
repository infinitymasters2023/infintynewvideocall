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
  console.log('urlMeetingId', urlMeetingId);
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
  const handleJoinMeeting = useCallback(async () => {
    // Function to get user's IP address
    const getIpAddress = async () => {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    };

    // Function to get user's device information
    const getDeviceInfo = () => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };
    };

    // Function to get user's tab information
    const getTabInfo = () => {
      return {
        title: document.title,
        url: window.location.href,
      };
    };

    try {

      const ipAddress = await getIpAddress();
      const deviceInfo = getDeviceInfo();
      const tabInfo = getTabInfo();

      const iData = {
        roomId: meetingId,
        fullName: participantName,
        mobile: ticketInfo.mobileno,
        email: ticketInfo.emailidaddress,
        ipAddress,
        deviceInfo,
        tabInfo,
      };
      await joinMeetingAPI(iData).then((response) => {
        console.log('Meeting joined successfully!', response);
        console.log('Meeting joined successfully!', response);
      console.log('IP Address:', ipAddress);
      console.log('Device Information:', deviceInfo);
      console.log('Tab Information:', tabInfo);
      });
    } catch (error) {
      console.error('Error joining the meeting:', error);
    }
  }, [meetingId, participantName, ticketInfo]);

    const handleCopyLink = () => {
      const link = `https://meetings.infyshield.com/${meetingId}`;
      navigator.clipboard.writeText(link);
      setIsCopied(true);
      localStorage.setItem('meetingLink', link);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  useEffect(() => {
    handleJoinMeeting();
  }, [handleJoinMeeting]);
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Allow letters, spaces, numbers, and hyphen
    const sanitizedInput = inputValue.replace(/\s\s+/g, ' ').replace(/[^a-zA-Z0-9\s-]/g, '');
    
    const isValidInput = /^[a-zA-Z0-9\s-]*$/.test(sanitizedInput);
  
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-[#f2f3f9] p-3 text-left align-middle shadow-xl transition-all">
                <div className="py-2">
                <a className="px-2 flex-shrink-0 inline-flex float-right " onClick={() => {
                        setModelOpen(false);
                      }}>
                                <FontAwesomeIcon icon={faXmark} style={{ color: 'red' }} />
                            </a>
            </div>
                  <SendMeetingLink key={'SendLink'} ticketInfo={ticketInfo} meetingId={meetingId} setModelOpen={setModelOpen} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

