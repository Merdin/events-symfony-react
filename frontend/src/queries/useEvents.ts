import {keepPreviousData, useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {getEventById, getEvents} from '../api/events';

export const useEvents = () => {
    return useInfiniteQuery({
        queryKey: ['events'],
        queryFn: getEvents,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });
};

export const useEvent = (id: string | number) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: !!id, // Prevents firing if id is undefined or null
    });
};
