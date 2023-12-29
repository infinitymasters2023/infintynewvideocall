import React, { useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { MeetingAppProvider } from "./context/MeetingAppContext";
import  {useMeeting} from "@videosdk.live/react-sdk";
function MeetingView(props) {
  const { setIsHost } = props;
  const [joined, setJoined] = useState(null);
  const [requestedEntries, setRequestedEntries] = useState([]);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    onEntryRequested: (data) => {
      console.log("entry requested");
      const { participantId, name, allow, deny } = data;

      setRequestedEntries((s) => [...s, { participantId, name, allow, deny }]);
    },
    onEntryResponded(participantId, decision) {
      console.log("entry responded");

      setRequestedEntries((s) =>
        s.filter((p) => p.participantId !== participantId)
      );

      if (decision === "allowed") {
        // entry allowed
      } else {
        // entry denied
      }
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const joinHostMeeting = () => {
    setIsHost(true);
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          
          {requestedEntries.map(({ participantId, name, allow, deny }) => {
            return (
              <>
                <p>{name} wants to join Meeting</p>
                <button onClick={allow}>Allow</button>
                <button onClick={deny} style={{ marginLeft: 8 }}>
                  Deny
                </button>
              </>
            );
          })}
         
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : null}
    </div>
  );
}

const App = () => {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });

  const [speakerOn, setSpekerOn] = useState(true);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  const participantMode = searchParams.get("mode");


  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <>
    
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
          participantMode={participantMode}
          initialSpeakerOn={speakerOn}
        >
          <MeetingProvider
            config={{
              meetingId: meetingId,
              micEnabled: micOn,  
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",
              multiStream: false,
              priority : "PIN",
              
            }}
            token={token}
              
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setParticipantName("");
                setWebcamOn(false);
                setMicOn(false);
                setSpekerOn(false);
                setMeetingStarted(false);
                setIsMeetingLeft(true);
              }}
            />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} setWebcamOn={setWebcamOn} setMicOn={setMicOn} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          speakerEnabled={speakerOn}
          setSpekerOn={setSpekerOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft} 
        />
      )}  
    </>
  );
};


export default App;
