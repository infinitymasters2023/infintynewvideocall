import { createContext, useContext, useState } from "react";
import { VirtualBackgroundProcessor } from "@videosdk.live/videosdk-media-processor-web";
import { participantModes } from "../utils/common";
import useIsMobile from "../hooks/useIsMobile";
import { useMeeting, createCameraVideoTrack } from "@videosdk.live/react-sdk";
export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const MeetingAppProvider = ({
  children,
  selectedMic,
  selectedWebcam,
  initialMicOn,
  initialWebcamOn,
  topbarEnabled,
  participantMode,
  initialSpeakerOn,
}) => {
  const isMobile = useIsMobile();

  const [sideBarMode, setSideBarMode] = useState(null);
  const [selectedWebcamDevice, setSelectedWebcamDevice] =
    useState(selectedWebcam);
  const [selectedMicDevice, setSelectedMicDevice] = useState(selectedMic);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
  const [useVirtualBackground, setUseVirtualBackground] = useState(
    participantMode !== participantModes.CLIENT && !isMobile
  );
  const [webCamResolution, setWebCamResolution] = useState("h480p_w640p");
  const [participantLeftReason, setParticipantLeftReason] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState({
    facingMode: "front",
  });
  const [meetingMode, setMeetingMode] = useState(null);
  const [muteSpeaker, setMuteSpeaker] = useState(initialSpeakerOn);
  const [selectedOutputDevice, setSelectedOutputDevice] = useState(selectedMic);

  const videoProcessor = new VirtualBackgroundProcessor();

  const isAgent =
    !!participantMode && participantMode !== participantModes.CLIENT;
    const handleStartVirtualBackground = async () => {
      // Initialize processor if not ready
      if (!videoProcessor.ready) {
        await videoProcessor.init();
      }
  
      // Configuration for starting processor
      const config = {
        type: "image", // "blur"
        imageUrl: "https://cdn.videosdk.live/virtual-background/cloud.jpeg",
        // Here is a list of background images you can use for your project.
        // imageUrl: "https://cdn.videosdk.live/virtual-background/beach.jpeg",
        // imageUrl: "https://cdn.videosdk.live/virtual-background/san-fran.jpeg",
        // imageUrl: "https://cdn.videosdk.live/virtual-background/paper-wall.jpeg",
      };
  
      // Getting stream from webcam
      const stream = await createCameraVideoTrack({});
      const processedStream = await videoProcessor.start(stream, config);
    };
  return (
    <MeetingAppContext.Provider
      value={{
        // default options
        initialMicOn,
        initialWebcamOn,
        participantMode,

        allowedVirtualBackground:isAgent, //isAgent && !isMobile,
        maintainVideoAspectRatio: isAgent,
        maintainLandscapeVideoAspectRatio: true,
        canRemoveOtherParticipant: isAgent,

        // states
        sideBarMode,
        selectedWebcamDevice,
        selectedMicDevice,
        raisedHandsParticipants,
        useVirtualBackground,
        participantLeftReason,
        meetingMode,
        muteSpeaker,
        selectedOutputDevice,
        webCamResolution,
        cameraFacingMode,

        // setters
        setSideBarMode,
        setSelectedMicDevice,
        setSelectedWebcamDevice,
        setRaisedHandsParticipants,
        setUseVirtualBackground,
        setParticipantLeftReason,
        setMeetingMode,
        setMuteSpeaker,
        setSelectedOutputDevice,
        setWebCamResolution,
        setCameraFacingMode,

        videoProcessor,
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
