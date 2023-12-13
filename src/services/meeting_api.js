import { get, post, put, del } from "./instance";
import axios from 'axios';

export const tokenGenerationAPI = async (iData) => {
    return await post('meeting/tokenGeneration', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
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
export const createRoomMeetingAPI = async (iData) => {
    return await post('room/create', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            const { roomId } = response.data
            return roomId
        }
        else {
            return ''
        }
    })
};

export const insertMeetingAPI = async (iData) => {
    return await post('/meeting/create_meeting', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return response.data
        }
    }).catch((error) => {
        return error
    })
};
export const startMeetingAPI = async (iData) => {
    return await post('meeting/start_meeting', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode === 200 && response.data) {
            const { meetingId } = response.data;
            console.log('response', response);
            return meetingId;
        } else {
            console.error('Error starting the meeting:', response.error);
            return '';
        }
    }).catch((error) => {
        return error
    })
};


export const stopRecordingAPI = async (iData) => {
    await post('recording/stop', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return response.data
        }
    }).catch((error) => {
        return error
    })
};

export const joinMeetingAPI = async (iData) => {
    return await post('/meeting/join_meeting', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return response.data
        }
    }).catch((error) => {
        return error
    })
};

export const leaveMeetingAPI = async (iData) => {
    return await post('/meeting/leave_meeting', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return response.data
        }
    }).catch((error) => {
        return error
    })
};

export const endMeetingAPI = async (iData) => {
    return await post('/meeting/end_meeting', iData).then((response) => {
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return response.data
        }
    }).catch((error) => {
        return error
    })
};

export const uploadFileAPI = async (iData) => {
    // try {
    //     const accessToken = sessionStorage.getItem('accessToken');
    //     const response = await axios.post(`https://meetingsapi.infyshield.com/v1/meeting/upload-doc?ticketNo=${iData.ticketNo}`, iData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Authorization': `Bearer ${accessToken}`
    //         },
    //     });
    //     return response.data
    // } catch (error) {
    //     console.error('Upload error:', error);
    // }
    return await post(`meeting/upload-doc?ticketNo=${iData.ticketNo}`, iData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
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