import {Constants,createScreenShareVideoTrack,useMeeting,usePubSub} from "@videosdk.live/react-sdk";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import recordingBlink from "../../static/animations/recording-blink.json";
import useIsRecording from "../../hooks/useIsRecording";
import RecordingIcon from "../../icons/Bottombar/RecordingIcon";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import MicOffIcon from "../../icons/Bottombar/MicOffIcon";
import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import WebcamOffIcon from "../../icons/Bottombar/WebcamOffIcon";
import ScreenShareIcon from "../../icons/Bottombar/ScreenShareIcon";
import ChatIcon from "../../icons/Bottombar/ChatIcon";
import ParticipantsIcon from "../../icons/Bottombar/ParticipantsIcon";
import EndIcon from "../../icons/Bottombar/EndIcon";
import RaiseHandIcon from "../../icons/Bottombar/RaiseHandIcon";
import { OutlinedButton } from "../../components/buttons/OutlinedButton";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import { MobileIconButton } from "../../components/buttons/MobileIconButton";
import { FaInfoCircle } from "react-icons/fa";

import {
  meetingModes,
  participantModes,
  sideBarModes,
} from "../../utils/common";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { useMeetingAppContext } from "../../context/MeetingAppContext";
import useMediaStream from "../../hooks/useMediaStream";
import { toast } from "react-toastify";
import { nameTructed, trimSnackBarText } from "../../utils/helper";
import OutlineIconTextButton from "../../components/buttons/OutlineIconTextButton";
import SpeakerIcon from "../../icons/Bottombar/SpeakerIcon";
import SpeakerOffIcon from "../../icons/Bottombar/SpeakerOffIcon";
import useCustomTrack from "../../utils/useCustomTrack";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import './Bottombar.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { stopRecordingAPI, endMeetingAPI, leaveMeetingAPI } from "../../services/meeting_api";
import DisplayTimer from "../../components/DisplayTimer";
import RecordingDisplayTimer from "../../components/RecordingDisplayTimer";
import html2canvas from "html2canvas";
const MicBTN = () => {
  const { selectedMicDevice, setSelectedMicDevice } = useMeetingAppContext();
  const { getCustomAudioTrack } = useCustomTrack();
  const mMeeting = useMeeting();
  const [mics, setMics] = useState([]);
  const localMicOn = mMeeting?.localMicOn;
  const changeMic = mMeeting?.changeMic;

  const getMics = async (mGetMics) => {
    const mics = await mGetMics();

    const micArr = mics.filter(
      (d) => d.deviceId !== "default" && d.deviceId !== "communications"
    );

    const newMics = new Map();

    micArr.map((device) => {
      if (!newMics.has(device.deviceId)) {
        newMics.set(device.deviceId, device);
      }
    });

    micArr && micArr?.length && setMics(newMics);
  };

  const mouseOver = false;

  let bgColor = localMicOn ? "bg-gray-750" : "bg-white";
  let borderColor = localMicOn && "#ffffff33";
  let isFocused = localMicOn;
  let focusIconColor = localMicOn && "white";
  let Icon = localMicOn ? MicOnIcon : MicOffIcon;
  const iconSize = 24 * 1;

  return (
    <>
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center  rounded-lg ${
                bgColor ? `${bgColor}` : isFocused ? "bg-white" : "bg-gray-750"
              } ${
                mouseOver
                  ? "border-2 border-transparent border-solid"
                  : borderColor
                  ? `border-2 border-[${borderColor}] border-solid`
                  : bgColor
                  ? "border-2 border-transparent border-solid"
                  : "border-2 border-solid border-[#ffffff33]"
              } md:m-2 m-1`}
            >
              <button
                className={`cursor-pointer flex items-center justify-center`}
                onClick={(e) => {
                  e.stopPropagation();
                  mMeeting.toggleMic();
                }}
              >
                <div className="flex items-center justify-center p-1 m-1 rounded-lg">
                  <Icon
                    style={{
                      color: isFocused ? focusIconColor || "#1C1F2E" : "#fff",
                      height: iconSize,
                      width: iconSize,
                    }}
                    fillcolor={isFocused ? focusIconColor || "#1C1F2E" : "#fff"}
                  />
                </div>
              </button>
              <button
                className="mr-1"
                onClick={(e) => {
                  getMics(mMeeting.getMics);
                }}
              >
                <ChevronDownIcon
                  className="h-4 w-4"
                  style={{
                    color: mMeeting.localMicOn ? "white" : "black",
                  }}
                />
              </button>
            </Popover.Button>
            {mics.size > 0 && (
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  style={{ zIndex: 9999 }}
                  className="absolute md:left-1/2 left-full bottom-full  mt-0 w-80 max-w-md -translate-x-1/2 transform px-4 sm:px-0 pb-2"
                >
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className={" bg-gray-750 py-1"}>
                      <div>
                        <div className="flex items-center p-3 pb-0">
                          <p className="ml-3 text-sm text-gray-900">
                            {"MICROPHONE"}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          {[...mics.values()].map(
                            ({ deviceId, label }, index) => {
                              return (
                                <div
                                  className={`px-3 py-1 my-1 pl-6 text-white text-left ${
                                    deviceId === selectedMicDevice.deviceId &&
                                    "bg-gray-150"
                                  }`}
                                >
                                  <button
                                    className={`flex flex-1 w-full ${
                                      deviceId === selectedMicDevice.deviceId &&
                                      "bg-gray-150"
                                    }`}
                                    key={`mics_${deviceId}`}
                                    onClick={async () => {
                                      setSelectedMicDevice({
                                        deviceId,
                                        label,
                                      });
                                      try {
                                        const stream =
                                          await getCustomAudioTrack({
                                            selectMicDeviceId:
                                              selectedMicDevice.id,
                                            encoderConfig: "speech_standard",
                                            useNoiseSuppression: true,
                                          });

                                        changeMic(stream);
                                      } catch (error) {
                                        console.log(error);
                                      }
                                      setTimeout(() => {
                                        close();
                                      }, 200);
                                    }}
                                  >
                                    {label || `Mic ${index + 1}`}
                                  </button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            )}
          </>
        )}
      </Popover>
    </>
  );
};


const OutputMicBTN = () => {
  const { selectedOutputDevice, setSelectedOutputDevice } =
    useMeetingAppContext();
  const [outputmics, setOutputMics] = useState([]);

  const { muteSpeaker, setMuteSpeaker } = useMeetingAppContext();

  const getOutputDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputMics = devices.filter(
      (d) =>
        d.kind === "audiooutput" &&
        d.deviceId !== "default" &&
        d.deviceId !== "communications"
    );

    const outputs = new Map();

    outputMics.map((device) => {
      if (!outputs.has(device.deviceId)) {
        outputs.set(device.deviceId, device);
      }
    });

    outputMics && outputMics?.length && setOutputMics(outputs);
  };

  let bgColor = muteSpeaker ? "bg-gray-750" : "bg-white";
  let borderColor = muteSpeaker && "#ffffff33";
  let isFocused = muteSpeaker;
  let focusIconColor = muteSpeaker && "white";
  let Icon = muteSpeaker ? SpeakerIcon : SpeakerOffIcon;
  const iconSize = 24 * 1;

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center  rounded-lg ${
              bgColor ? `${bgColor}` : isFocused ? "bg-white" : "bg-gray-750"
            } ${
              borderColor
                ? `border-2 border-[${borderColor}] border-solid`
                : bgColor
                ? "border-2 border-transparent border-solid"
                : "border-2 border-solid border-[#ffffff33]"
            } md:m-2 m-1`}
          >
            <button
              className={`cursor-pointer flex items-center justify-center`}
              onClick={(e) => {
                e.stopPropagation();
                setMuteSpeaker(!muteSpeaker);
              }}
            >
              <div className="flex items-center justify-center p-1 m-1 rounded-lg">
                <Icon
                  style={{
                    color: isFocused ? focusIconColor || "#1C1F2E" : "#fff",
                    height: iconSize,
                    width: iconSize,
                  }}
                  fillcolor={isFocused ? focusIconColor || "#1C1F2E" : "#fff"}
                />
              </div>
            </button>
            <button
              className="mr-1"
              onClick={(e) => {
                getOutputDevices();
              }}
            >
              <ChevronDownIcon
                className="h-4 w-4"
                style={{
                  color: muteSpeaker ? "white" : "black",
                }}
              />
            </button>
          </Popover.Button>
          {outputmics && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                style={{ zIndex: 9999 }}
                className="absolute left-1/2 bottom-full  mt-0 w-72 -translate-x-1/2 transform px-4 sm:px-0 pb-2"
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className={" bg-gray-750 py-1"}>
                    <div>
                      <div className="flex items-center p-3 pb-0">
                        <p className="ml-3 text-sm text-gray-900">
                          {"SPEAKER"}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        {[...outputmics.values()].map(
                          ({ deviceId, label }, index) => {
                            return (
                              <div
                                className={`px-3 py-1 my-1 pl-6 text-white text-left ${
                                  deviceId === selectedOutputDevice.id &&
                                  "bg-gray-150"
                                }`}
                              >
                                <button
                                  className={`flex flex-1 w-full ${
                                    deviceId === selectedOutputDevice.id &&
                                    "bg-gray-150"
                                  }`}
                                  key={`mics_${deviceId}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSelectedOutputDevice({
                                      id: deviceId,
                                    });

                                    setTimeout(() => {
                                      close();
                                    }, 200);
                                  }}
                                >
                                  {label || `Mic ${index + 1}`}
                                </button>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </>
      )}
    </Popover>
  );
};


const WebCamBTN = ({ isMobile }) => {
  const { selectedWebcamDevice, setSelectedWebcamDevice } =
    useMeetingAppContext();
  const mMeeting = useMeeting();
  const [webcams, setWebcams] = useState([]);

  const localWebcamOn = mMeeting?.localWebcamOn;
  const changeWebcam = mMeeting?.changeWebcam;
  const disableWebcam = mMeeting?.disableWebcam;

  const getWebcams = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const webcams = devices.filter(
      (d) =>
        d.kind === "videoinput" &&
        d.deviceId !== "default" &&
        d.deviceId !== "communications"
    );

    webcams && webcams?.length && setWebcams(webcams);
  };

  const { getVideoTrack } = useMediaStream();
  const {
    useVirtualBackground,
    setUseVirtualBackground,
    allowedVirtualBackground,
    setCameraFacingMode,
  } = useMeetingAppContext();

  let bgColor = localWebcamOn ? "bg-gray-750" : "bg-white";
  let borderColor = localWebcamOn && "#ffffff33";
  let isFocused = localWebcamOn;
  let focusIconColor = localWebcamOn && "white";
  let Icon = localWebcamOn ? WebcamOnIcon : WebcamOffIcon;
  const iconSize = 24 * 1;

  const { publish: switchCameraPublish } = usePubSub(
    `SWITCH_PARTICIPANT_CAMERA_${mMeeting?.localParticipant?.id}`,
    {
      onMessageReceived: async ({ message }) => {
        setCameraFacingMode({
          facingMode: message.facingMode,
        });
      },
    }
  );

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center  rounded-lg ${
              bgColor ? `${bgColor}` : isFocused ? "bg-white" : "bg-gray-750"
            } ${
              borderColor
                ? `border-2 border-[${borderColor}] border-solid`
                : bgColor
                ? "border-2 border-transparent border-solid"
                : "border-2 border-solid border-[#ffffff33]"
            } md:m-2 m-1`}
          >
            <button
              className={`cursor-pointer flex items-center justify-center`}
              onClick={async (e) => {
                e.stopPropagation();
                let track;
                if (!localWebcamOn) {
                  if (allowedVirtualBackground && useVirtualBackground) {
                    track = await getVideoTrack({
                      webcamId: selectedWebcamDevice.id,
                      useVirtualBackground: useVirtualBackground,
                    });
                  } else {
                    track = await getVideoTrack({
                      webcamId: selectedWebcamDevice.id,
                    });
                  }
                }
                mMeeting.toggleWebcam(track);
              }}
            >
              <div className="flex items-center justify-center p-1 m-1 rounded-lg">
                <Icon
                  style={{
                    color: isFocused ? focusIconColor || "#1C1F2E" : "#fff",
                    height: iconSize,
                    width: iconSize,
                  }}
                  fillcolor={isFocused ? focusIconColor || "#1C1F2E" : "#fff"}
                />
              </div>
            </button>
            <button
              className="mr-1"
              onClick={(e) => {
                getWebcams(mMeeting?.getWebcams);
              }}
            >
              <ChevronDownIcon
                className="h-4 w-4"
                style={{
                  color: localWebcamOn ? "white" : "black",
                }}
              />
            </button>
          </Popover.Button>
          {webcams.length > 0 && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                style={{ zIndex: 9999 }}
                className="absolute left-1/2 bottom-full  mt-0 w-72 -translate-x-1/2 transform px-4 sm:px-0 pb-2"
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className={" bg-gray-750 py-1"}>
                    <div>
                      <div className="flex items-center p-3 pb-0">
                        <p className="ml-3 text-sm text-gray-900">{"WEBCAM"}</p>
                      </div>
                      <div className="flex flex-col">
                        {webcams.map(({ deviceId, label }, index) => (
                          <div
                            className={`px-3 py-1 my-1 pl-6 text-white text-left ${
                              deviceId === selectedWebcamDevice.id &&
                              "bg-gray-150"
                            }`}
                          >
                            <button
                              className={`flex flex-1 w-full ${
                                deviceId === selectedWebcamDevice.id &&
                                "bg-gray-150"
                              }`}
                              key={`output_webcams_${deviceId}`}
                              onClick={async () => {
                                setSelectedWebcamDevice({
                                  id: deviceId,
                                  label,
                                });
                                const facingMode =
                                  label.toLowerCase().includes("front") ||
                                  label.toLowerCase().includes("back");
                                const value =
                                  label.toLowerCase().match(/\bfront\b/i) ||
                                  label.toLowerCase().match(/\bback\b/i);

                                if (facingMode) {
                                  switchCameraPublish(
                                    {
                                      facingMode: value[0],
                                      isChangeWebcam: false,
                                    },
                                    {
                                      persist: true,
                                    }
                                  );
                                }

                                if (
                                  allowedVirtualBackground &&
                                  useVirtualBackground
                                ) {
                                  const track = await getVideoTrack({
                                    webcamId: deviceId,
                                    useVirtualBackground: useVirtualBackground,
                                  });
                                  changeWebcam(track);
                                } else {
                                  await disableWebcam();
                                  let customTrack = await getVideoTrack({
                                    webcamId: deviceId,
                                  });

                                  changeWebcam(customTrack);
                                }
                                setTimeout(() => {
                                  close();
                                }, 200);
                              }}
                            >
                              {label || `Webcam ${index + 1}`}
                            </button>
                          </div>
                        ))}
                      </div>
                      {allowedVirtualBackground && !isMobile && (
                        <button
                          className="flex items-center p-3"
                          onClick={async () => {
                            const track = await getVideoTrack({
                              useVirtualBackground: !useVirtualBackground,
                            });
                            setUseVirtualBackground(!useVirtualBackground);
                            changeWebcam(track);
                            setTimeout(() => {
                              close();
                            }, 200);
                          }}
                        >
                          {useVirtualBackground ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-150" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-[1px] border-gray-500 " />
                          )}

                          <p className="ml-3 text-sm text-gray-900">
                            {"Virtual Background"}
                          </p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </>
      )}
    </Popover>
  );
};

export function BottomBar({ bottomBarHeight }) {
  const { sideBarMode, setSideBarMode, participantMode } =
    useMeetingAppContext();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [adminId, setAdminId] = useState("");
  const isRecording = useIsRecording();
  useEffect(() => {
    setUserId(uuidv4());
    ;
  }, []);
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const userJoinId = urlSearchParams.get("userId");
    if (userJoinId) {
      setAdminId(userJoinId);
    }
  }, [location.search]);
  console.log('user', userId)
  console.log('admin', adminId)
  const isAdminUser = adminId == '' && userId !== '' && adminId !== userId;


  const RaiseHandBTN = ({ isMobile, isTab }) => {
    const { publish } = usePubSub("RAISE_HAND");
    const RaiseHand = () => {
      publish("Raise Hand");
    };

    return isMobile || isTab ? (
      <MobileIconButton
        id="RaiseHandBTN"
        tooltipTitle={"Raise hand"}
        Icon={RaiseHandIcon}
        onClick={RaiseHand}
        buttonText={"Raise Hand"}
      />
    ) : (
      <OutlinedButton
        onClick={RaiseHand}
        tooltip={"Raise Hand"}
        Icon={RaiseHandIcon}
      />
    );
  };

  const RecordingBTN = ({ isMobile, isTab }) => {
    const { startRecording, stopRecording, recordingState, meetingId } = useMeeting();
    const [recordingDisabled,setRecordingDisabled]=useState(false)
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: recordingBlink,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      height: 64,
      width: 160,
    };

    const isRecording = useIsRecording();
    const isRecordingRef = useRef(isRecording);

    useEffect(() => {
      isRecordingRef.current = isRecording;
    }, [isRecording]);

    const _handleClick = async () => {
 
      const isRecording = isRecordingRef.current;

      if (isRecording) {
        setRecordingDisabled(false)
        await stopRecording();
        setTimeout(function () {
          stopRecordingAPI({ roomId: meetingId })
        }, 3000)
      } else {
        setRecordingDisabled(true)
        startRecording();
        
      }
    };

    return isMobile || isTab ? (
      <MobileIconButton
        Icon={RecordingIcon}
        onClick={_handleClick}
        isFocused={isRecording}
        buttonText={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
            ? "Starting Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ? "Start Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ? "Stopping Recording"
            : "Start Recording"
        }
        tooltip={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
            ? "Starting Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ? "Start Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ? "Stopping Recording"
            : "Start Recording"
        }
        lottieOption={isRecording ? defaultOptions : null}
      />
    ) : (
      <OutlinedButton
        Icon={RecordingIcon}
        onClick={_handleClick}
        isFocused={isRecording}
        disabled={recordingDisabled}
        tooltip={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
            ? "Starting Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ? "Start Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ? "Stopping Recording"
            : "Start Recording"
        }
        lottieOption={isRecording ? defaultOptions : null}
      />
    );
  };
 
  const PrintScreenListener = () => {
    const handleKeyDown = (event) => {
      // Check if the Print Screen key is pressed
      if (event.key === 'PrintScreen') {
        // Provide a message or guide the user on how to capture a screenshot manually
        alert('To capture a screenshot, press the Print Screen key and paste it into an image editor.');
      }
    };
  
    useEffect(() => {
      // Add event listener when the component mounts
      window.addEventListener('keydown', handleKeyDown);
  
      // Remove event listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []); // Empty dependency array ensures that the effect runs only once on mount
  
    return (
      <div>
        <p>Press the Print Screen key to capture a screenshot.</p>
      </div>
    );
  };
  
  

  const EndBTN = () => {
    const { end, localParticipant, meetingId } = useMeeting();

    return (
      <OutlineIconTextButton
        onClick={() => {
          toast(
            `${trimSnackBarText(
              nameTructed(localParticipant.displayName, 15)
            )} end the meeting.`,
            {
              position: "bottom-left",
              autoClose: 4000,
              hideProgressBar: true,
              closeButton: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          end();
          endMeetingAPI({ roomId: meetingId })
        }}
        buttonText={"End Meeting"}
        tooltip={"End Meeting"}
      />
    );
  };

  const ScreenShareBTN = ({ isMobile, isTab }) => {
    const { localScreenShareOn, toggleScreenShare, presenterId } = useMeeting();

    return isMobile || isTab ? (
      <MobileIconButton
        id="screen-share-btn"
        tooltipTitle={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        buttonText={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        isFocused={localScreenShareOn}
        Icon={ScreenShareIcon}
        onClick={async () => {
          let customTrack = await createScreenShareVideoTrack({
            optimizationMode: "text",
            encoderConfig: "h720p_15fps",
          });
          toggleScreenShare(customTrack);
        }}
        disabled={
          presenterId
            ? localScreenShareOn
              ? false
              : true
            : isMobile
              ? true
              : false
        }
      />
    ) : (
      <OutlinedButton
        Icon={ScreenShareIcon}
        onClick={async () => {
          let customTrack = await createScreenShareVideoTrack({
            optimizationMode: "text",
            encoderConfig: "h720p_15fps",
          });
          toggleScreenShare(customTrack);
        }}
        isFocused={localScreenShareOn}
        tooltip={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        disabled={presenterId ? (localScreenShareOn ? false : true) : false}
      />
    );
  };


  const CustomModal = ({ side, title, show, handleClose, children }) => {
    return (
      <Modal show={show} onHide={handleClose} className={`modal-${side} fade`}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`modal-body-${side}`}>{children}</Modal.Body>
      </Modal>
    );
  };




  const LeaveBTN = () => {
    const { leave, localParticipant, meetingId, stopRecording, end } = useMeeting();
    const isRecording = useIsRecording();
    return (
      <OutlinedButton
        Icon={EndIcon}
        bgColor="bg-red-150"
        onClick={async () => {
          toast(
            `${trimSnackBarText(
              nameTructed(localParticipant.displayName, 15)
            )} left the meeting.`,
            {
              position: "bottom-left",
              autoClose: 4000,
              hideProgressBar: true,
              closeButton: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          if (isRecording) {
            stopRecording();
          }
          leave();
          if (isAdminUser) {
            setTimeout(() => {
              endMeetingAPI({ roomId: meetingId })
            }, 2000);
          }
          else {
            leaveMeetingAPI({ roomId: meetingId })
          }
        }}
        tooltip="Leave Meeting"
      />
    );
  };
 
  

  const SidebarModalDemo = ({ participantName }) => {
    const [rightModalShow, setRightModalShow] = useState(false);
    const [meetingLink, setMeetingLink] = useState('');
    const { meetingId } = useMeeting();

    useEffect(() => {
      // Retrieve the link from local storage
      const storedLink = localStorage.getItem('meetingLink');
      if (storedLink) {
        setMeetingLink(storedLink);
      }
    }, []);

    const handleRightModalClose = () => setRightModalShow(false);
    const handleRightModalShow = () => setRightModalShow(true);
    return (
      <div className="sidebar-modal-demo">
        <div className="text-center">
          <button
            type="button"
            className="btn btn-demo text-base font-medium text-white"
            onClick={handleRightModalShow}
          >
            <FaInfoCircle />
          </button>
        </div>

        <CustomModal
          side="right"
          title="Info"
          show={rightModalShow}
          handleClose={handleRightModalClose}
        >
          <div className="card-panel">
            <div className="card">
              <div className="body">
                <div className="title m-0">Infinity Assurance Meeting</div>
              </div>
              <ul className="list pl-0">
                <li className="list-item py-1 border-0">
                  <div className="d-flex">
                    <div className="name col-5 px-0">Host</div>
                    <div className="value col-7 px-0">{participantName}</div>
                  </div>
                  <hr className="break-line break-line-list" />
                </li>
                <li className="list-item py-1 border-0"></li>
                <li className="list-item py-1 border-0">
                  <div className="d-flex">
                    <div className="name px-0 col-5">Meeting ID:</div>
                    <div className="value px-0 col-7">{meetingId}</div>
                  </div>
                </li>
                <li className="list-item py-1 border-0"></li>
                <li className="list-item py-1 border-0 grid-column-assign">
                  <div className="d-flex">
                    <div className="name col-3 px-0">Invitation Link:</div>
                    <div className="value col-6 px-3 link url-value">
                      {meetingLink}
                    </div>
                  </div>
                </li>
              </ul>
              <div className="card-body text-right copy-btns center-content">
                <button className="btn card-link">
                  <img alt="" src="assets/images/copy-url.svg" />
                  <span className="pl-2">Copy Link</span>
                </button>
                <button className="btn card-link">
                  <img alt="" src="assets/images/copy-invi.svg" />
                  <span className="pl-2">Copy Invitation</span>
                </button>
              </div>
            </div>
          </div>
       /</CustomModal>
      </div>
    );
  };


  const ChatBTN = ({ isMobile, isTab }) => {
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Chat"}
        buttonText={"Chat"}
        Icon={ChatIcon}
        isFocused={sideBarMode === sideBarModes.CHAT}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CHAT ? null : sideBarModes.CHAT
          );
        }}
      />
    ) : (
      <OutlinedButton
        Icon={ChatIcon}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CHAT ? null : sideBarModes.CHAT
          );
        }}
        isFocused={sideBarMode === "CHAT"}
        tooltip="View Chat"
      />
    );
  };

  const ParticipantsBTN = ({ isMobile, isTab }) => {
    const { participants } = useMeeting();
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Participants"}
        isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
        buttonText={"Participants"}
        disabledOpacity={1}
        Icon={ParticipantsIcon}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
          );
        }}
        badge={`${new Map(participants)?.size}`}
      />
    ) : (
      <OutlinedButton
        Icon={ParticipantsIcon}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
          );
        }}
        isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
        tooltip={"Participants"}
        badge={`${new Map(participants)?.size}`}
      />
    );
  };

  const MeetingIdCopyBTN = () => {
    const [meetingLink, setMeetingLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
      // Retrieve the link from local storage
      const storedLink = localStorage.getItem('meetingLink');
      if (storedLink) {
        setMeetingLink(storedLink);
      }
    }, []);

    return isAdminUser ? (
      <div className="flex items-center justify-center lg:ml-0 ml-4 mt-4 xl:mt-0">
        <div className="flex border-2 border-gray-850 p-2 rounded-md items-center justify-center ">
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingLink);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>
    ) : null;
  };

  const tollTipEl = useRef();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const [open, setOpen] = useState(false);

  const handleClickFAB = () => {
    setOpen(true);
  };

  const handleCloseFAB = () => {
    setOpen(false);
  };

  const BottomBarButtonTypes = useMemo(
    () => ({
      END_CALL: "END_CALL",
      CHAT: "CHAT",
      PARTICIPANTS: "PARTICIPANTS",
      SCREEN_SHARE: "SCREEN_SHARE",
      WEBCAM: "WEBCAM",
      MIC: "MIC",
      RAISE_HAND: "RAISE_HAND",
      RECORDING: "RECORDING",
      MEETING_ID_COPY: "MEETING_ID_COPY",
      SCREEN_SHARE_MODE_BUTTON: "SCREEN_SHARE_MODE_BUTTON",
      END_MEETING: "END_MEETING",
      SPEAKER: "SPEAKER",
    }),
    []
  );

  const otherFeatures = [
    { icon: BottomBarButtonTypes.RAISE_HAND },
    { icon: BottomBarButtonTypes.SCREEN_SHARE },
    { icon: BottomBarButtonTypes.CHAT },
    { icon: BottomBarButtonTypes.RECORDING },
    { icon: BottomBarButtonTypes.PARTICIPANTS },
    { icon: BottomBarButtonTypes.MEETING_ID_COPY },
    { icon: BottomBarButtonTypes.SCREEN_SHARE_MODE_BUTTON },
    { icon: BottomBarButtonTypes.END_MEETING },
  ];

  function getBrowserName(userAgent) {
    if (userAgent.includes("Firefox")) {
      return "Mozilla Firefox";
    } else if (userAgent.includes("SamsungBrowser")) {
      return "Samsung Internet";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      return "Opera";
    } else if (userAgent.includes("Edge")) {
      return "Microsoft Edge (Legacy)";
    } else if (userAgent.includes("Edg")) {
      return "Microsoft Edge (Chromium)";
    } else if (userAgent.includes("Chrome")) {
      return "Google Chrome or Chromium";
    } else if (userAgent.includes("Safari")) {
      return "Apple Safari";
    } else if (userAgent.includes("Brave")) {
      return "Brave Browser";
    } else if (userAgent.includes("Vivaldi")) {
      return "Vivaldi";
    } else {
      return "unknown";
    }
  }

  const browserName = getBrowserName(navigator.userAgent);

  // if (
  //   browserName !== "Google Chrome or Chromium" ||
  //   browserName !== "Microsoft Edge (Legacy)" ||
  //   browserName !== "Opera"
  // ) {
  //   // remove recording button
  //   otherFeatures.splice(3, 1);
  // }

  if (participantMode !== participantModes.AGENT) {
    // remove recording button
    otherFeatures.splice(3, 1);
  }

  return isMobile || isTab ? (
    <div
      className="flex items-center justify-center"
      style={{ height: bottomBarHeight }}
    >
      <LeaveBTN />
      <MicBTN />
      <WebCamBTN isMobile={isMobile} />
      {(browserName === "Google Chrome or Chromium" ||
        browserName === "Microsoft Edge (Legacy)" ||
        browserName === "Opera") && <OutputMicBTN />}
      <OutlinedButton Icon={EllipsisHorizontalIcon} onClick={handleClickFAB} />
      <Transition appear show={Boolean(open)} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 9999 }}
          onClose={handleCloseFAB}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100 scale-100"
            leaveTo="translate-y-full opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-hidden">
              <div className="flex h-full items-end justify-end text-center">
                <Dialog.Panel className="w-screen transform overflow-hidden bg-gray-800 shadow-xl transition-all">
                  <div className="grid container bg-gray-800 py-6">
                    <div className="grid grid-cols-12 gap-2">
                      {otherFeatures.map(({ icon }) => {
                        return (
                          <div
                            className={`grid items-center justify-center  ${
                              icon === BottomBarButtonTypes.MEETING_ID_COPY ||
                              icon ===
                                BottomBarButtonTypes.SCREEN_SHARE_MODE_BUTTON
                                ? "col-span-7 sm:col-span-5 md:col-span-3 lg:col-sapn-2"
                                : "col-span-4 sm:col-span-3 md:col-span-2"
                            }`}
                          >
                            {icon === BottomBarButtonTypes.RAISE_HAND ? (
                              <RaiseHandBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon === BottomBarButtonTypes.SCREEN_SHARE ? (
                              <ScreenShareBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.CHAT ? (
                              <ChatBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon === BottomBarButtonTypes.PARTICIPANTS ? (
                              <ParticipantsBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.RECORDING ? (
                              <RecordingBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon ===
                              BottomBarButtonTypes.MEETING_ID_COPY ? (
                              <MeetingIdCopyBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            )  : icon === BottomBarButtonTypes.END_MEETING &&
                              participantMode === participantModes.AGENT ? (
                              <EndBTN />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  ) : (
  <div className="md:flex lg:px-2 xl:px-6 pb-2 px-2 hidden">
     
      <DisplayTimer />
      { isRecording && <RecordingDisplayTimer /> }
      <div className="flex flex-1 items-center justify-center" ref={tollTipEl}>
        {participantMode === participantModes.AGENT && (
          <><RecordingBTN isTab={isTab} isMobile={isMobile} />
          </>
        )}

        <RaiseHandBTN isMobile={isMobile} isTab={isTab} />
        <MicBTN />

        <WebCamBTN />
        {(browserName === "Google Chrome or Chromium" ||
          browserName === "Microsoft Edge (Legacy)" ||
          browserName === "Opera") && <OutputMicBTN />}
        <ScreenShareBTN isMobile={isMobile} isTab={isTab} />
        {participantMode === participantModes.AGENT && (
          <>
           
            <EndBTN />
          </>
        )}

        <LeaveBTN />
      </div>

      <div className="flex items-center justify-center">
        <ChatBTN isMobile={isMobile} isTab={isTab} />
        <ParticipantsBTN isMobile={isMobile} isTab={isTab} />
      </div>
    </div>
  );
}