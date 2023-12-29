import React, { Fragment, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

export function LeaveScreen({ setIsMeetingLeft, setWebcamOn, setMicOn }) {
  const handleLeaveMeeting = () => {
    setIsMeetingLeft(false);
    setWebcamOn(true)
    setMicOn(true)
  }
  return (
    <div className="bg-gray-800 h-screen flex flex-col flex-1 items-center justify-center">
      <h1 className="text-white text-4xl">You left the  meeting!</h1>
      <div className="mt-12">
        <button
          className="`w-full  bg-purple-350 text-white px-16 py-3 rounded-lg text-sm"
          onClick={handleLeaveMeeting}
        >
          Rejoin the Meeting
        </button>
      </div>
    </div>
  );
}
