import { get, post } from "./instance";

export const tokenGenerationAPI = async (iData) => {
    return await post('meeting/tokenGeneration', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode === 200 && response.data) {
            const { accessToken } = response.data
            return accessToken
        }
        else {
            return ''
        }
    }).catch((error) => {
        console.log('error', error);
    })
};

export const validateMeetingRoomAPI = async (roomId) => {
    return await get(`room/validate/${roomId}`)
};
export const createRoomMeetingAPI = async (iData) => {
    return await post('room/create', iData).then((response) => {
        console.log('res', response);
        if (response && response.isSuccess && response.statusCode === 200 && response.data) {
            const { roomId } = response.data
            return roomId
        }
        else {
            return ''
        }
    })
};

export const insertMeetingAPI = async (iData) => {
    return await post('/meeting/create_meeting', iData)
};
export const startMeetingAPI = async (iData) => {
    return await post('meeting/start_meeting', iData)
};

export const stopRecordingAPI = async (iData) => {
    await post('recording/stop', iData).then((response) => {
        return response.data
    }).catch((error) => {
        return error
    })
};

export const joinMeetingAPI = async (iData) => {
    return await post('/meeting/join_meeting', iData)
};

export const leaveMeetingAPI = async (iData) => {
    return await post('/meeting/leave_meeting', iData).then((response) => {
        return response.data
    }).catch((error) => {
        return error
    })
};

export const endMeetingAPI = async (iData) => {
    return await post('/meeting/end_meeting', iData).then((response) => {
        return response.data
    }).catch((error) => {
        return error
    })
};

export const uploadFileAPI = async (iData) => {
    return await post('/meeting/upload-doc', iData)
}

export const serviceCallInfoAPI = async (iData) => {
    return await post('meeting/service_call_info', iData)
};

export const sendMeetingLinkAPI = async (iData) => {
    return await post('meeting/send_meeting_link', iData)
};

export const getDocumentStatus = async () => {
    return await get('master/status')
};

export const getDocumentMaster = async () => {
    return await get('master/document')
};