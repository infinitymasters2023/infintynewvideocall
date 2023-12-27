import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useMeetingAppContext } from "../context/MeetingAppContext";
import MicOffSmallIcon from "../icons/MicOffSmallIcon";
import ScreenShareIcon from "../icons/ScreenShareIcon";
import SpeakerIcon from "../icons/SpeakerIcon";
import { nameTructed } from "../utils/helper";
import { CornerDisplayName } from "./ParticipantView";

export function PresenterView({ height }) {
  const mMeeting = useMeeting();
  const presenterId = mMeeting?.presenterId;

  const videoPlayer = useRef();

  const {
    webcamOn,
    micOn,
    isLocal,
    screenShareStream,
    screenShareAudioStream,
    screenShareOn,
    displayName,
    pin,
    unpin,
    pinState,
    isActiveSpeaker,
  } = useParticipant(presenterId);

  const { muteSpeaker, selectedOutputDevice } = useMeetingAppContext();

  const [mouseOver, setMouseOver] = useState(false);

  const mediaStream = useMemo(() => {
    if (screenShareOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  const audioPlayer = useRef();

  useEffect(() => {
    if (
      !isLocal &&
      audioPlayer.current &&
      screenShareOn &&
      screenShareAudioStream
    ) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareAudioStream.track);

      audioPlayer.current.srcObject = mediaStream;
      try {
        audioPlayer.current.setSinkId(selectedOutputDevice?.id);
      } catch (error) {
        console.log("error", error);
      }

      audioPlayer.current.play().catch((err) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [
    screenShareAudioStream,
    screenShareOn,
    isLocal,
    muteSpeaker,
    selectedOutputDevice,
  ]);

  return (
    <div
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      className={`video-cover bg-gray-750 rounded m-2 relative overflow-hidden w-full h-[${
        height - "xl:p-6 lg:p-[52px] md:p-[26px] p-1"
      }] `}
    >
      <audio
        id="audio"
        autoPlay
        playsInline={true}
        controls={false}
        ref={audioPlayer}
        muted={isLocal || !muteSpeaker}
      />

      <div className={"video-contain absolute h-full w-full"}>
        <ReactPlayer
          ref={videoPlayer}
          playsinline ={true}
          playIcon={<></>}
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={mediaStream}
          height={"100%"}
          width={"100%"}
          style={{
            filter: isLocal ? "blur(1rem)" : undefined,
          }}
          onError={(err) => {
            console.log(err, "presenter video error");
          }}
        />
        <div
          className="bottom-2 left-2 bg-gray-750 p-2 absolute rounded-md flex items-center justify-center"
          style={{
            transition: "all 200ms",
            transitionTimingFunction: "linear",
          }}
        >
          

          <p className="text-sm text-white">
            {isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`}
          </p>
        </div>
        {isLocal ? (
          <>
            <div className="p-10 rounded-2xl flex flex-col items-center justify-center absolute top-1/2 left-1/2 bg-gray-750 transform -translate-x-1/2 -translate-y-1/2">
              <ScreenShareIcon
                style={{ height: 48, width: 48, color: "white" }}
              />
              <div className="mt-4">
                <p className="text-white text-xl font-semibold">
                  You are presenting to everyone
                </p>
              </div>
              <div className="mt-8">
                <button
                  className="bg-purple-550 text-white px-4 py-2 rounded text-sm text-center font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    mMeeting.toggleScreenShare();
                  }}
                >
                  STOP PRESENTING
                </button>
              </div>
            </div>
            <CornerDisplayName
              {...{
                isLocal,
                displayName,
                micOn:true,
                webcamOn:true,
                pin,
                unpin,
                pinState,
                isPresenting: true,
                participantId: presenterId,
                mouseOver,
                isActiveSpeaker,
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
