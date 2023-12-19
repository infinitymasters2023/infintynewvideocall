import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/helper";

const ChatMessage = ({ senderId, senderName, text, timestamp }) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSender = localParticipantId === senderId;
  const isLink = /^(https?:\/\/|www\.)\S+/i.test(text);

  const handleCopy = () => {
    if (isLink) {
      try {
        // Attempt to parse the link using the URL constructor
        const parsedURL = new URL(text);

        // Extract the pathname, which contains only the path without the protocol and base URL
        const pathWithoutBaseURL = parsedURL.pathname;

        // Create a temporary textarea element to facilitate copying
        const textarea = document.createElement('textarea');
        textarea.value = pathWithoutBaseURL;
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(textarea);

        // You can provide user feedback, such as a tooltip or a message
        alert('Link copied to clipboard!');
      } catch (error) {
        // Handle the case where the URL is invalid
        console.error('Invalid URL:', error.message);
      }
    }
  };

  const renderContent = () => {
    if (isLink) {
      return (
        <span
          onClick={handleCopy}
          style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}
        >
          {text}
        </span>
      );
    } else {
      return text;
    }
  };

  return (
    <div
      className={`flex ${localSender ? "justify-end" : "justify-start"} mt-4`}
      style={{
        maxWidth: "100%",
      }}
    >
      <div
        className={`flex ${
          localSender ? "items-end" : "items-start"
        } flex-col py-1 px-2 rounded-md bg-gray-700`}
      >
        <p style={{ color: "#ffffff80" }}>
          {localSender ? "You" : nameTructed(senderName, 15)}
        </p>
        <div>
  <p
    className="inline-block whitespace-pre-wrap break-words text-right text-white"
    style={{ cursor: 'pointer' }}
    onClick={handleCopy}
  >
  {renderContent()}
  </p>
</div>
        <div className="mt-1">
          <p className="text-xs italic" style={{ color: "#ffffff80" }}>
            {formatAMPM(new Date(timestamp))}
          </p>
        </div>
        
      </div>
    </div>
  );
};

const ChatInput = ({ inputHeight }) => {
  const [message, setMessage] = useState("");
  const { publish } = usePubSub("CHAT");
  const input = useRef();
  const isLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return urlRegex.test(text);
  };
  return (
    <div
      className="w-full flex items-center px-2"
      style={{ height: inputHeight }}
    >
      <div class="relative  w-full">
        <span class="absolute inset-y-0 right-0 flex mr-2 rotate-90 ">
          <button
            disabled={message.length < 2}
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
            onClick={() => {
              const messageText = message.trim();
              if (messageText.length > 0) {
                publish(messageText, { persist: true });
                setTimeout(() => {
                  setMessage("");
                }, 100);
                input.current?.focus();
              }
            }}
          >
            <PaperAirplaneIcon
              className={`w-6 h-6 -rotate-90 ${
                message.length < 2 ? "text-gray-500 " : "text-white"
              }`}
            />
          </button>
        </span>
        <input
        type="text"
        className={` px-2 py-4 text-base text-white bg-gray-750 border-[1px] border-gray-500 focus:outline-none focus:border-purple-350 rounded pr-10  w-full`}
        placeholder="Write your message"
        autocomplete="off"
        ref={input}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const messageText = message.trim();
      
            if (messageText.length > 0) {
              publish(messageText, { persist: true });
              setTimeout(() => {
                setMessage("");
              }, 100);
              input.current?.focus();
            }
          }
        }}
      />

      </div>
    </div>
  );
};

const ChatMessages = ({ listHeight }) => {
  const listRef = useRef();
  const { messages } = usePubSub("CHAT");

  const scrollToBottom = (data) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT") {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
        {messages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              {...{ senderId, senderName, text: message, timestamp }}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  );
};

export function ChatPanel({ panelHeight }) {
  const inputHeight = 72;
  const listHeight = panelHeight - inputHeight;

  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatInput inputHeight={inputHeight} />
    </div>
  );
}