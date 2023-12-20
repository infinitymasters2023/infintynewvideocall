import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FiZoomIn, FiZoomOut, FiRotateCw, FiRotateCcw, FiRefreshCw } from 'react-icons/fi';
import "cropperjs/dist/cropper.css";
import { usePubSub, useMeeting } from "@videosdk.live/react-sdk";
import { uploadFileAPI, getDocumentStatus, getDocumentMaster } from "../services/meeting_api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faMagnifyingGlassMinus,
  faMagnifyingGlassPlus, faArrowRotateRight,
  faArrowRotateLeft, faCrop, faCheck , faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { useFormik, getIn } from 'formik';
import { UploadDocumentSchema } from '../validation/upload_document';
import InputTextField from './InputFields/InputTextField'
import InputTextAreaField from './InputFields/InputTextAreaField'
import { allowOnlyTextInput } from '../utils/helper'
const ImageCapturePreviewDialog = ({ open, setOpen }) => {
  const { meetingId, participantName } = useMeeting();
  const [imageSrc, setImageSrc] = useState(null);
  const [drawingData, setDrawingData] = useState(null);
  const refArray = Array(4).fill(null).map(() => (null));
  const [TicketNoRef, RemarkRef, StatuRef, DocumentTitleRef] = refArray;
  const canvasRef = useRef(null);
  const [drawingContext, setDrawingContext] = useState(null);
  const [docstatus, setDocstatus] = useState([]);
  const [documentmaster, setDocumentmaster] = useState([]);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setDrawingContext(ctx);
    }
    fetchDocstatus()
    fetchDocumentmaster()
  }, []);

  const fetchDocstatus = useCallback(async () => {
      await getDocumentStatus().then(async (response) => {
        if (response && response.isSuccess && response.statusCode == 200) {
          setDocstatus(response.data)
        }
      })
        .catch((error) => {
        })
  }, []);
  const fetchDocumentmaster = useCallback(async () => {
    await getDocumentMaster().then(async (response) => {
      if (response && response.isSuccess && response.statusCode == 200) {
        setDocumentmaster(response.data)
      }
    })
      .catch((error) => {
      })
  })

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
    cropper.zoom(0.1);
  };

  const handleZoomOut = () => {
    cropper.zoom(-0.1);
  };
  const handleRotateLeft = () => {
    cropper.rotate(-90);
  };

  const handleRotateRight = () => {
    cropper.rotate(90);
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

  const handleSubmit = async () => {
    await uploadFileAPI(formik.values).then(async (response) => {
      if (response && response.isSuccess && response.statusCode == 200) {
        setDocumentmaster(response.data)
      }
    })
      .catch((error) => {
      })
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { mobile: '' },
    validationSchema: UploadDocumentSchema,
    onSubmit: handleSubmit,
  });

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    var transformValue = ''
    switch (name) {
      case 'ticketNo':
        transformValue = await allowOnlyTextInput(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
        break;
      case 'Remarks':
        transformValue = await allowOnlyTextInput(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
        break;
      case 'Status':
        transformValue = await allowOnlyTextInput(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
        break;
      case 'DocStatus':
      case 'Status':
        transformValue = await allowOnlyTextInput(value)
        await formik.setFieldValue(name, transformValue)
        await formik.setFieldTouched(name, true)
        break;
      default:
        break;
    }
  }

  const handleOnBlur = async (event) => {
    const { name } = event.currentTarget;
    switch (name) {
      case 'mobile':
        if (!getIn(formik.errors, 'mobile') && formik.values.mobile) {

        }
        break;
      default:
        break;
    }
  }
  return (
    <>
      {/* <Transition appear show={open} as={Fragment}>
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
                  <div className="mt-6 flex w-full justify-end gap-2">
                    <button
                      type="button"
                      className="rounded border border-white bg-transparent text-white hover:bg-gray-700 mr-2 px-3 text-sm"
                      style={{ height: '30px' }}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white bg-transparent px-4 text-sm font-medium text-white hover:bg-gray-700"
                      style={{ height: '30px' }}
                      onClick={handleFileUpload}
                    >
                      Upload
                    </button>

                    <>
                      {!cropButtonClicked && (
                        <div>
                          <span className="text-white font-semibold">Select Status:</span>
                          <select
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="ml-2 form-control"
                          >
                            <option value="">Select Status</option>
                            <option value="approve">Approve</option>
                            <option value="pending">Pending for Verification</option>
                            <option value="reject">Reject</option>
                          </select>

                          <div className="col-md-12 mt-3">
                            <span className="text-white font-semibold">Remarks:</span>
                            <textarea className="ml-2 form-control"></textarea>
                          </div>
                        </div>
                      )}
                    </>
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
                            <textarea
                              className="ml-2 form-control"
                            ></textarea>
                          </div>
                        </div>

                      </>
                    )}
                  </div>
                  <div className="flex items-start justify-end w-full mt-6 fixed top-0">
                  </div>
                  {cropData && cropButtonClicked && (
                    <div className="container">
                      <div className="row">
                        <div className="col-4"></div>
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
                    </div>

                  )}

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
          setOpen(false);
        }}>
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
            <div className="flex min-h-full items-center justify-center">
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
                  className="w-9/12 transform relative overflow-y-auto rounded bg-[#f2f3f9] p-3 text-left align-middle flex flex-col shadow-xl transition-all"
                >
                  <div className="w-full p-1 justify-end gap-2">
                    <a className="flex-shrink-0 inline-flex float-right "
                      onClick={() => {
                        setOpen(false);
                      }}><FontAwesomeIcon icon={faXmark} style={{ color: 'red' }} />
                    </a>
                  </div>
                  <div className="flex flex-row bg-[#f2f3f9]">
                    <div className="basis-1/2 box-border p-2">
                      <div className="flex flex-row">
                        <div className="basis-10/12 box-border p-2 border-1">
                          { 
                            (cropButtonClicked && cropData) ? <img src={cropData} className="w-96 h-96 rounded-lg shadow-xl" />
                            : imageSrc ? <Cropper
                            className="w-96 h-96 rounded-lg shadow-xl"
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={imageSrc}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={false}
                            autoCropArea={1}
                            checkOrientation={false}
                            onInitialized={(instance) => {
                              setCropper(instance);
                            }}
                            guides={true}
                            crossOrigin="anonymous"
                          /> : <div className="w-96 h-96 rounded-lg shadow-xl">
                          <p className="dark:text-gray-600 text-center">
                            Loading Image...
                          </p>
                        </div>}
                        </div>
                        <div className="basis-2/12 box-border p-2 border-1 text-center bg-[#f2f3f9]">
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2  shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleZoomIn}><FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                          </a>
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleZoomOut}><FontAwesomeIcon icon={faMagnifyingGlassPlus} />
                          </a>
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleRotateRight}><FontAwesomeIcon icon={faArrowRotateRight} />
                          </a>
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleRotateLeft}><FontAwesomeIcon icon={faArrowRotateLeft} />
                          </a>
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleCropButtonClick}><FontAwesomeIcon icon={faCrop} />
                          </a>
                          {/* <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={() => { }}><FontAwesomeIcon icon={faCheck} />
                          </a> */}
                          <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={() => {
                              setCropButtonClicked(false)
                             }}><FontAwesomeIcon icon={faPenToSquare} />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="basis-1/2 box-border p-2 border-4">
                      <form method="Post" onSubmit={formik.handleSubmit}>
                        <div className="flex flex-row">
                          <div className="basis-3/4 px-2">
                            <InputTextField key="ticketNoInput"
                              fieldName="ticketNo"
                              labelName="Ticket No"
                              value={formik.values.ticketNo}
                              placeholder="Enter Ticket No"
                              inputFieldRef={TicketNoRef}
                              handleOnChange={handleInputChange}
                              handleOnBlur={handleOnBlur}
                              maxLength={100}
                              minLength={8}
                              isDisabled={false}
                              isReadOnly={false}
                              isRequired={false} />
                            {getIn(formik.touched, `ticketNo`) && getIn(formik.errors, `ticketNo`) && <h4 className="text-red-600 px-2">{getIn(formik.errors, `ticketNo`)}</h4>}
                          </div>
                        </div>
                        <div className="flex flex-row mt-2">
                          <div className="basis-1/2 px-2">
                            <label className="block text-sm font-medium leading-6 text-gray-600 mb-1">Document Title</label>
                            <select
                              onChange={handleInputChange}
                              name="DocStatus"
                              className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600"
                              ref={DocumentTitleRef}
                            >
                              <option value="">Select Document</option>
                              {
                                Array.isArray(documentmaster) && documentmaster.map((document, index) => {
                                  return(<option key={document.DocumentName} value={document.DocumentName}>{document.DocumentName}</option>)
                                })
                              }
                            </select>
                            {getIn(formik.touched, `mobile`) && getIn(formik.errors, `mobile`) && <h4 className="text-red-600 px-2">{getIn(formik.errors, `mobile`)}</h4>}
                          </div>
                          <div className="basis-1/2 px-2">
                            <label className="block text-sm font-medium leading-6 text-gray-600 mb-1">Status</label>
                            <select
                              onChange={handleInputChange}
                              name="Status"
                              className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600"
                              ref={StatuRef}
                            >
                              {
                                Array.isArray(docstatus) && docstatus.map((status, index) => {
                                  return(<option key={status.docstatus} value={status.docstatus}>{status.docstatus}</option>)
                                })
                              }
                            </select>
                            {getIn(formik.touched, `Status`) && getIn(formik.errors, `Status`) && <h4 className="text-red-600 px-2">{getIn(formik.errors, `Status`)}</h4>}
                          </div>
                        </div>
                        <div className="flex flex-row mt-2">
                          <div className="basis-full px-2">
                            <InputTextAreaField key="InputRemark"
                              fieldName="Remarks"
                              labelName="Remarks"
                              value={formik.values.Remarks}
                              placeholder="Enter Remarks"
                              inputFieldRef={RemarkRef}
                              handleOnChange={handleInputChange}
                              handleOnBlur={handleOnBlur}
                              maxLength={100}
                              minLength={8}
                              isDisabled={false}
                              isReadOnly={false}
                              isRequired={false} />
                            {getIn(formik.touched, `Remarks`) && getIn(formik.errors, `Remarks`) && <h4 className="text-xs text-red px-2">{getIn(formik.errors, `Remarks`)}</h4>}
                          </div>
                        </div>
                        <div className="place-self-start md:place-self-end">
                          <button type="submit" className="py-2 px-2 inline-flex items-center gap-x-2 mt-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 float-right">
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
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