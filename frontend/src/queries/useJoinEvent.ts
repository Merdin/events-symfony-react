import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/events';

export const useJoinEvent = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    });
};
