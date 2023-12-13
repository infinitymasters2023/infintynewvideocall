import { useMeeting } from "@videosdk.live/react-sdk";
import { VirtualBackgroundProcessor } from "@videosdk.live/videosdk-media-processor-web";
import {
    MeetingProvider,
    createCameraVideoTrack,
  } from "@videosdk.live/react-sdk";
const MeetingView = () => {
  // Instantiate VirtualBackgroundProcessor Class
  const videoProcessor = new VirtualBackgroundProcessor();

  const { changeWebcam, allowedVirtualBackground } = useMeeting({});

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
