import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { usePubSub, useMeeting } from "@videosdk.live/react-sdk";
import { uploadFileAPI, getDocumentStatus, getDocumentMaster, serviceCallInfoAPI } from "../services/meeting_api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faMagnifyingGlassMinus, faMagnifyingGlassPlus,
  faArrowRotateRight, faArrowRotateLeft, faCrop,
  faCheck, faPenToSquare, faArrowsRotate, faCropSimple,
  faSquareCheck,faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useFormik, getIn } from 'formik';
import { UploadDocumentSchema } from '../validation/upload_document';
import InputTextField from './InputFields/InputTextField'
import InputTextAreaField from './InputFields/InputTextAreaField'
import { allowOnlyTextInput } from '../utils/helper'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ImageCapturePreviewDialog = ({ open, setOpen }) => {
  const { meetingId } = useMeeting();
  const refArray = Array(4).fill(null).map(() => (null));
  const [TicketNoRef, RemarkRef, StatuRef, DocumentTitleRef] = refArray;
  const [capturedImage, setCapturedImage] = useState(null);
  const [toUploadImage, setToUploadImage] = useState(null);
  const [docstatus, setDocstatus] = useState([]);
  const [documentmaster, setDocumentmaster] = useState([]);
  const [ticketNo, setTicketNo] = useState('');
  
  const [displayIcon, setDisplayIcon] = useState({
    isCapture: false,
    isDefault: false,
    isReset: false,
    isFinalised: false,
    isCroped: false,
  });
  const [cropper, setCropper] = useState();
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imagesMessages, setImagesMessages] = useState({});
  const generateImage = (messages) => {
    const srcImage = messages
      .sort((a, b) => parseInt(a.index) - parseInt(b.index))
      .map(({ chunkdata }) => chunkdata)
      .join("");
    setImageSrc(srcImage);
    setToUploadImage(srcImage)
    setDisplayIcon({ ...displayIcon, isDefault: true })
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

  useEffect(() => {
    fetchDocstatus();
    fetchDocumentmaster();
  }, []);
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  const participantMode = searchParams.get("mode");
  const customRoomId = searchParams.get("qu");
  const userid = searchParams.get("userid");

  useEffect(() => {
    if (customRoomId && userid) {
      fetchTicketInfo()
    }
  }, [customRoomId, userid]);

  const fetchTicketInfo = useCallback(async () => {
    if (customRoomId && userid) {
      const iData = { quNumber : customRoomId, userid : userid }
      await serviceCallInfoAPI(iData).then(async (response) => {
        if (response && response.isSuccess && response.statusCode == 200) {
          const { TicketNO } = response.data
          setTicketNo(TicketNO)
        }
      })
        .catch((error) => {
        })
    }
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
  const handleCaptureImage = () => {
    setCapturedImage(cropper.getCroppedCanvas().toDataURL());
    setDisplayIcon({ ...displayIcon, isCapture: true, isCroped: false })
  };
  const handleResetImage = async() => {
    if (cropper) {
      await cropper.reset();
      setToUploadImage(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const handleZoomIn = async() => {
    await cropper.zoom(0.1);
    setToUploadImage(cropper.getCroppedCanvas().toDataURL());
  };

  const handleZoomOut = async() => {
    await cropper.zoom(-0.1);
    setToUploadImage(cropper.getCroppedCanvas().toDataURL());
  };
  const handleRotateLeft = async() => {
    await cropper.rotate(-90);
    setToUploadImage(cropper.getCroppedCanvas().toDataURL());
  };

  const handleRotateRight = async() => {
    await cropper.rotate(90);
    setToUploadImage(cropper.getCroppedCanvas().toDataURL());
  };
  const handleSubmit = async () => {
    await uploadFileAPI(formik.values).then(async (response) => {
      if (response && response.isSuccess && response.statusCode == 200) {
        handleUpload()
        formik.setFieldValue('Remarks', '')
        formik.setFieldTouched('Remarks', false)
        formik.setFieldValue('Status', '')
        formik.setFieldTouched('Status', false)
        formik.setFieldValue('DocumentName', '')
        formik.setFieldTouched('DocumentName', false)
      }
    })
      .catch((error) => {
      })
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roomId : meetingId,
      ticketNo: ticketNo,
      Remarks: '',
      Status: '',
      DocumentName: '',
      file: toUploadImage
    },
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
      case 'DocumentName':
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
      case 'ticketNo':
        if (!getIn(formik.errors, 'ticketNo') && formik.values.ticketNo) {

        }
        break;
      case 'Remarks':
        if (!getIn(formik.errors, 'Remarks') && formik.values.Remarks) {

        }
        break;
      case 'Status':
        if (!getIn(formik.errors, 'Status') && formik.values.Status) {

        }
        break;
      case 'DocStatus':
        if (!getIn(formik.errors, 'DocStatus') && formik.values.DocStatus) {

        }
        break;
      default:
        break;
    }
  }
  const handleUpload = async () => {
    toast.success('Image uploaded successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc; 
    link.download =  `${ticketNo}.png`; 
    document.body.appendChild(link);

  
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  };
  return (
    <>
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
                          {displayIcon.isDefault && imageSrc && <img src={imageSrc} className="w-96 h-96 rounded-lg shadow-xl" />}
                          {displayIcon.isCroped && <Cropper
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
                          />}
                          {displayIcon.isCapture && imageSrc && <img src={capturedImage} className="w-96 h-96 rounded-lg shadow-xl" />}
                          {displayIcon.isFinalised && imageSrc && <img src={toUploadImage} className="w-96 h-96 rounded-lg shadow-xl" />}
                        </div>
                        <div className="basis-2/12 box-border p-2 border-1 text-center bg-[#f2f3f9]">
                          {displayIcon.isDefault && <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={() => {
                              setDisplayIcon({ ...displayIcon, isCroped: true, isDefault: false })
                            }}><FontAwesomeIcon icon={faCrop} />
                          </a>
                          }
                          {
                            (displayIcon.isCroped) && <>
                            <a
                            className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleZoomIn}
                            title="Zoom In"
                          >
                            <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                          </a>
                              <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                                onClick={handleZoomOut}><FontAwesomeIcon icon={faMagnifyingGlassMinus}
                                title="Zoom Out"
                                />
                              </a>
                              <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                                onClick={handleRotateRight}><FontAwesomeIcon icon={faArrowRotateRight}
                                title="Rotate Right"
                                />
                              </a>
                              <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                                onClick={handleRotateLeft}><FontAwesomeIcon icon={faArrowRotateLeft}
                                title="Rotate Left"
                                />
                              </a>
                              <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                                onClick={handleResetImage}>
                                <FontAwesomeIcon icon={faArrowsRotate} 
                                title="Revert to original"
                                />
                              </a>
                              <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                                onClick={handleCaptureImage}>
                                <FontAwesomeIcon icon={faCheck}
                                title="Submit"
                                />
                              </a>
                              <a
                              type="button"
                              className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                              disabled={!formik.isValid || formik.isSubmitting}
                              onClick={handleDownload}
                            >
                              <FontAwesomeIcon icon={faDownload} className="text-lg" />
                            </a>
                            </>
                          }
                          {
                            (displayIcon.isCapture) &&                               
                            <a className="flex-shrink-0 inline-flex dark:text-gray-600 px-3 py-2 mb-2 dark:border-gray-700 dark:text-gray-700 dark:focus:ring-gray-600 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                            onClick={handleResetImage}>
                            <FontAwesomeIcon icon={faXmark} />
                          </a>
                          }
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
                              name="DocumentName"
                              value={formik.values.DocumentName}
                              className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600"
                              ref={DocumentTitleRef}
                              required={true}
                            >
                              <option value="">Select Document</option>
                              {
                                Array.isArray(documentmaster) && documentmaster.map((document, index) => {
                                  return (<option key={document.DocumentName} value={document.mid}>{document.DocumentName}</option>)
                                })
                              }
                            </select>
                            {getIn(formik.touched, `DocumentName`) && getIn(formik.errors, `DocumentName`) && <h4 className="text-red-600 px-2">{getIn(formik.errors, `DocumentName`)}</h4>}
                          </div>
                          <div className="basis-1/2 px-2">
                            <label className="block text-sm font-medium leading-6 text-gray-600 mb-1">Status</label>
                            <select
                              onChange={handleInputChange}
                              name="Status"
                              value={formik.values.Status}
                              className="py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600"
                              ref={StatuRef}
                              required={true}
                            >
                              <option value="">Select Status</option>
                              {
                                Array.isArray(docstatus) && docstatus.map((status, index) => {
                                  return (<option key={status.docstatus} value={status.docstatus}>{status.docstatus}</option>)
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
                        
                       
                          <button type="submit"
                            className="py-2 px-2 inline-flex items-center gap-x-2 mt-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 float-right"
                            disabled={!formik.isValid || formik.isSubmitting}
                            >
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