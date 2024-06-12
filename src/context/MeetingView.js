import { useMeeting } from "@videosdk.live/react-sdk";
import { VirtualBackgroundProcessor } from "@videosdk.live/videosdk-media-processor-web";
import {
    MeetingProvider,
    createCameraVideoTrack,
  } from "@videosdk.live/react-sdk";
const MeetingView = (props) => {
  // Instantiate VirtualBackgroundProcessor Class
  const videoProcessor = new VirtualBackgroundProcessor();
  const { setIsHost } = props;
  function onEntryRequested(data) {
    const { participantId, name, allow, deny } = data;

    console.log(`${name} requested to join the meeting.`);

    // If you want to allow the entry request
    allow();

    // If you want to deny the entry request
    deny();
  }
  function onEntryResponded(participantId, decision) {
    // participantId will be the ID of the participant who requested to join the meeting

    if (decision === "allowed") {
      // Entry allowed
    } else {
      // Entry denied
    }
  }

  const { changeWebcam, allowedVirtualBackground, join, participants } = useMeeting({
    onEntryRequested,
    onEntryResponded,
    onSpeakerChanged: (activeSpeakerId) => {
      console.log("Active Speaker participantId", activeSpeakerId);
    },
  });

  const handleStartVirtualBackground = async () => {
    // Initialize processor if not ready
    if (!videoProcessor.ready) {
      await videoProcessor.init();
    }

    // Configuration for starting processor
    const config = {
      type: "image", // "blur"
      imageUrl: "https://cdn.videosdk.live/virtual-background/cloud.jpeg",
    };

    // Getting stream from webcam
    const stream = await createCameraVideoTrack({});
    const processedStream = await videoProcessor.start(stream, config);

    changeWebcam(processedStream);
  };

  // Check if virtual background is allowed
  if (allowedVirtualBackground) {
    handleStartVirtualBackground();
  }

  return <>...</>;
};
