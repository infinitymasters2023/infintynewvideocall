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
        console.log('res', response);
        if (response && response.isSuccess && response.statusCode == 200 && response.data) {
            return response.data
        }
        else {
            return {}
        }
    })
};