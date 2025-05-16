import { apiClient } from './client';

export const getEvents = async () => {
    const { data } = await apiClient.get('/events');
    return data['member'];
};

export const getEventById = async (id: string | number) => {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
};

export const makeEvent = async (payload: { title: string, description: string, maxParticipants: number|null, location: string, startsAt: string })=> {
    const { data } = await apiClient.post('/events', payload);
    return data;
}


export const deleteEvent = async (id: string | number) => {
    const { data } = await apiClient.delete(`/events/${id}`);
    return data;
};

export const participateEvent = async (id: string | number) => {
    const { data } = await apiClient.post(`/events/${id}/participate`)
}


export const stopParticipatingEvent = async (id: string | number) => {
    const { data } = await apiClient.delete(`/events/${id}/participate`)
}
