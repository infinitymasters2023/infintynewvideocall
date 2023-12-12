import { get, post, put, del } from "./instance";

export const tokenGeneration = async (iData) => {
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
export const createRoomMeeting = async (iData) => {
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

export const stopMeetingRecording = async (iData) => {
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