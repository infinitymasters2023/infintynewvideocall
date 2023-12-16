import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FiZoomIn, FiZoomOut, FiRotateCw, FiRotateCcw, FiRefreshCw } from 'react-icons/fi';
import "cropperjs/dist/cropper.css";
import { usePubSub, useMeeting } from "@videosdk.live/react-sdk";
import { uploadFileAPI } from "../services/meeting_api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCrop } from '@fortawesome/free-solid-svg-icons';

const ImageCapturePreviewDialog = ({ open, setOpen }) => {
  const { meetingId, participantName } = useMeeting();
  const [imageSrc, setImageSrc] = useState(null);
  const [drawingData, setDrawingData] = useState(null);


  const canvasRef = useRef(null);
  const [drawingContext, setDrawingContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setDrawingContext(ctx);
    }
  }, []);

  const imagesMessages = {};
  const generateImage = (messages) => {
    const srcImage = messages
      .sort((a, b) => parseInt(a.index) - parseInt(b.index))
      .map(({ chunkdata }) => chunkdata)
      .join("");
    setImageSrc(srcImage);
  };

  usePubSub(`IMAGE_TRANSFER`, {
    onMessageReceived: ({ message }) => {
      const { id, index, totalChunk } = message.data;
      if (imagesMessages[id]) {
        imagesMessages[id].push(message.data);
      } else {
        imagesMessages[id] = [message.data];
      }
      if (index + 1 === totalChunk) {
        generateImage(imagesMessages[id]);
      }
    },
  })

  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [cropButtonClicked, setCropButtonClicked] = useState(false);
  const [imageCropped, setImageCropped] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [brushWidth, setBrushWidth] = useState(5);
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

  const handleFileUpload = async () => {
    const ticketNo = localStorage.getItem('ticketNo');
    setOpen(false);
    const iData = {
      file: imageSrc,
      ticketNo: ticketNo,
      roomId: meetingId
    }
    await uploadFileAPI(iData).then((response) => {
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



  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };


  const handleRemarksChange = (e) => {
    if (e.target && e.target.value !== undefined) {
      setRemarks(e.target.value);
    }
  };
  const toggleDrawingMode = () => {
    setIsDrawing(!isDrawing);
  };

  const handleBrushColorChange = (color) => {
    setBrushColor(color.hex);
  };

  const handleBrushWidthChange = (width) => {
    setBrushWidth(width);
  };
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    drawingContext.beginPath();
    drawingContext.moveTo(offsetX, offsetY);
    setDrawingData({ tool: 'pen', points: [{ x: offsetX, y: offsetY }] });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    drawingContext.lineTo(offsetX, offsetY);
    drawingContext.stroke();
    setDrawingData((prevData) => ({
      ...prevData,
      points: [...prevData.points, { x: offsetX, y: offsetY }],
    }));
  };

  const handleMouseUp = () => {
    setDrawingData(null);
  };

  useEffect(() => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing]);

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
                  className="w-10/12 transform relative overflow-y-auto rounded bg-gray-750 text-left align-middle flex flex-col items-center shadow-xl transition-all"
                >
                  <div className="card w-full">
                    <div className="card-header">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="m-0"></h5>
                        </div>
                        <div className="text-end">
                          <div className="inline-flex rounded-md shadow-sm">
                            <button className="btn btn-sm" onClick={handleCropButtonClick}>
                              <FontAwesomeIcon icon={faCrop} style={{ color: 'black' }} />
                            </button>
                            <button className="btn btn-sm" onClick={() => {
                              setOpen(false);
                            }}>
                              <FontAwesomeIcon icon={faXmark} style={{ color: 'red' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body border-b py-3">
                      <div class="flex">
                        <div class="h-full w-2/4 flex-col">
                          {imageSrc ? <img src={imageSrc} /> : <p className="text-center">
                            Loading Image...
                          </p>}
                        </div>
                        <div class="h-full w-2/4 flex flex-col">
                          <div class="h-full w-2/4 flex-col">
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
                                background={true}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={true}
                                onInitialized={(instance) => {
                                  setCropper(instance);
                                }}
                                guides={true}
                                crossOrigin="anonymous"
                              />
                              <div className="col-md-4 ">
                                <span className="text-white font-semibold">Select Status:</span>
                                <select

                                  onChange={(e) => handleStatusChange(e.target.value)}
                                  className="ml-2 form-control "
                                >
                                  <option value="">Select Status</option>
                                  <option value="approve">Approve</option>
                                  <option value="pending">Pending for Verification</option>
                                  <option value="reject">Reject</option>
                                </select>
                                <div className="col-md-12 mt-3">
                                  <span className="text-white font-semibold">Remarks:</span>
                                  <input
                                    type="text"
                                    value={remarks}
                                    onChange={(e) => handleRemarksChange(e.target.value)}
                                    className="ml-2 form-control"
                                  />
                                </div>
                                {cropButtonClicked && (
                                  <button
                                    type="button"
                                    className="rounded border border-white bg-transparent px-3 py-2  mt-4 float-end text-sm font-medium text-white hover:bg-gray-700"
                                    onClick={() => {
                                      setOpen(false);
                                      handleFileUpload()
                                    }}
                                  >
                                    Upload
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                          </div>
                          <div class="w-2/4 flex-col">
                          </div>


                          {cropData && cropButtonClicked && (
                            <div className="container">
                              <div className="row">
                                <div className="col-6">
                                  <span className="text-white font-semibold">After Crop Image</span>
                                </div>
                                <div className="mt-2 float-end col-4">
                                  <button
                                    className="bg-white text-black px-2 py-1  rounded ml-2 text-sm"
                                    onClick={handleZoomIn}
                                  >
                                    <FiZoomIn />
                                  </button>
                                  <button
                                    className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                                    onClick={handleZoomOut}
                                  >
                                    <FiZoomOut />
                                  </button>
                                  <button
                                    className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                                    onClick={handleRotateLeft}
                                  >
                                    <FiRotateCcw />
                                  </button>
                                  <button
                                    className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                                    onClick={handleRotateRight}
                                  >
                                    <FiRotateCw />
                                  </button>
                                  <button
                                    className="bg-white text-black px-2 py-1 rounded ml-2 text-sm"
                                    onClick={handleRevertToOriginal}
                                  >
                                    <FiRefreshCw />
                                  </button>
                                </div>
                              </div>
                              {cropData && cropButtonClicked && (
                                <div className="row">
                                  <div className="col-md-6">
                                    <img
                                      className="object-contain mt-3"
                                      src={cropData}
                                      alt="cropped"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer border-b py-3">

                    </div>
                  </div>
                  {/* <div className="inline-flex rounded-md shadow-sm">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={() => {
                      setOpen(false);
                    }}>
                      Cancel
                    </button>
                    <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleFileUpload}>
                      Upload
                    </button>
                    <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleCropButtonClick}>
                      {imageCropped ? "View" : "Crop Image"}
                    </button>
                  </div> */}
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