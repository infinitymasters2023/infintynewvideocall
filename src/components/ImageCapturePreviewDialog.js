import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { usePubSub, useMeeting } from "@videosdk.live/react-sdk";
import Tesseract from 'tesseract.js';
import React, { useEffect } from 'react';
import { uploadFileAPI } from "../services/meeting_api";
const ImageCapturePreviewDialog = ({ open, setOpen }) => {
  const { meetingId , participantName } = useMeeting();
  const [imageSrc, setImageSrc] = useState(null);

  const imagesMessages = {};
  // subscribe imageTransfer
  const generateImage = (messages) => {
    // Getting src of image
    const srcImage = messages
      .sort((a, b) => parseInt(a.index) - parseInt(b.index))
      .map(({ chunkdata }) => chunkdata)
      .join("");

    // Setting src of image
    setImageSrc(srcImage);
  };

  usePubSub(`IMAGE_TRANSFER`, {
    onMessageReceived: ({ message }) => {
      const { id, index, totalChunk } = message.data;

      // If you select multiple images, then it will store images on basis of id in imagesMessages object
      if (imagesMessages[id]) {
        imagesMessages[id].push(message.data);
      } else {
        imagesMessages[id] = [message.data];
      }

      // Check whether the index of chunk and totalChunk is same, it means it is last chunk or not
      if (index + 1 === totalChunk) {
        generateImage(imagesMessages[id]);
      }
    },
  });

  // end subscribe imageTransfer

  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [cropButtonClicked, setCropButtonClicked] = useState(false);
  const [imageCropped, setImageCropped] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };
  const handleCropButtonClick = () => {
    if (!imageCropped) {
      setCropButtonClicked(true);
      getCropData();
    } else {
      setCropButtonClicked(false);
      setImageCropped(true);
      setOpen(false);
    }
  };

  const handleZoomIn = () => {
    cropper.zoom(0.1); // You can adjust the zoom factor as needed
  };

  const handleZoomOut = () => {
    cropper.zoom(-0.1); // You can adjust the zoom factor as needed
  };
  const handleRotateLeft = () => {
    cropper.rotate(-90); // Rotate 90 degrees to the left
  };

  const handleRotateRight = () => {
    cropper.rotate(90); // Rotate 90 degrees to the right
  };

  const handleRevertToOriginal = () => {
    if (cropper) {
      cropper.reset();
    }
  };
  const view = () => {

  }
  const handleFileUpload = async () => {
    const ticketNo = localStorage.getItem('ticketNo');
    setOpen(false);
    const formData = new FormData();
    formData.append('file', cropData);
    formData.append('ticketNo', ticketNo);
    formData.append('createdBy', participantName);
    await uploadFileAPI(formData).then((response) => {
      if (response && response.isSuccess && response.statusCode == 200 && response.data) {
        return response.data
      }
      else {
        return response.data
      }
    }).catch((error) => {
      return error
    })
  }



  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { }}>
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  style={{
                    maxHeight: `calc(100vh - 150px)`,
                  }}
                  className="w-9/12 transform relative overflow-y-auto rounded bg-gray-750 p-4 text-left align-middle flex flex-col items-center shadow-xl transition-all"
                >
                  {/* Move the "Upload" and "Cancel" buttons here */}
                  <div className="mt-6 flex w-full justify-end gap-2">
                    <button
                      type="button"
                      className="rounded border border-white bg-transparent px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white bg-transparent px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                      onClick={handleFileUpload}
                    >
                      Upload
                    </button>
                  </div>

                  <Dialog.Title className="text-base font-medium text-white w-full">
                    Preview
                  </Dialog.Title>
                  <div className="flex items-start justify-end w-full mt-2">
                    <button
                      className="bg-white text-black px-2 py-1 rounded"
                      onClick={handleCropButtonClick}
                    >
                      {imageCropped ? "View" : "Crop Image"}
                    </button>
                  </div>
                  <div className="flex mt-8 items-center justify-center h-full w-full">
                    {imageSrc ? (
                      <img src={imageSrc} width={300} height={300} />
                    ) : (
                      <div width={300} height={300}>
                        <p className=" text-white  text-center">
                          Loading Image...
                        </p>
                      </div>
                    )}
                    {/* Conditionally render the Cropper based on button click */}
                    {cropButtonClicked && (
                      <>


                        <Cropper
                          className="ml-4"
                          style={{
                            height: '33.33%',
                            width: '33.33%',
                            objectFit: 'contain',
                          }}
                          zoomTo={0.5}
                          initialAspectRatio={1}
                          preview=".img-preview"
                          src={imageSrc}
                          viewMode={1}
                          minCropBoxHeight={10}
                          minCropBoxWidth={10}
                          background={false}
                          responsive={true}
                          autoCropArea={1}
                          checkOrientation={false}
                          onInitialized={(instance) => {
                            setCropper(instance);
                          }}
                          guides={true}
                          crossOrigin="anonymous"
                        />
                        <button
                          className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                          onClick={handleZoomIn}
                        >
                          Zoom In
                        </button>
                        <button
                          className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                          onClick={handleZoomOut}
                        >
                          Zoom Out
                        </button>
                        <button
                          className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                          onClick={handleRotateLeft}
                        >
                          Rotate Left
                        </button>
                        <button
                          className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                          onClick={handleRotateRight}
                        >
                          Rotate Right
                        </button>

                        <button
                          className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                          onClick={handleRevertToOriginal}
                        >
                          Revert to Original
                        </button>
                      </>
                    )}
                  </div>

                  {/* Your "Crop Image" button */}
                  <div className="flex items-start justify-end w-full mt-6 fixed top-0">

                  </div>
                  {cropData && cropButtonClicked && (
                    <div className="flex flex-col w-full">
                      <span className="text-white font-semibold">
                        After Crop Image
                      </span>
                      <img
                        className="object-contain h-1/3 w-1/3 mt-3"
                        src={cropData}
                        alt="cropped"
                      />

                    </div>

                  )}
                  {cropButtonClicked && (
                    <button
                      type="button"
                      className="rounded border border-white bg-transparent px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Upload
                    </button>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ImageCapturePreviewDialog;
