import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Container} from "react-bootstrap";
import {use, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteEvent, participateEvent, stopParticipatingEvent} from "../../api/events";
import {useEvent} from "../../queries/useEvents";
import Alert from "../../components/Alert";
import {useAuth} from "../../components/AuthContext";

export const Route = createFileRoute('/events/$eventId')({
    component: EventDetails,
})

function EventDetails() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {eventId} = Route.useParams()
    const query = useEvent(eventId);

    const [event, setEvent] = useState<null>(null)
    const [bannerMessage, setBannerMessage] = useState<string | null>(null)

    useEffect(() => {
        if (query.data) {
            setEvent(query.data);
        }
    }, [query.data])

    const joinEventMutation = useMutation({
        mutationFn: ([eventId]: [string | number]) =>
            participateEvent(eventId),
        onSuccess: () => {
            query.refetch();
            setBannerMessage('Succesfully joined the event!')
        },
        onError: (errorResponse: any) => {
            setBannerMessage(errorResponse.response.data.detail || errorResponse.message)
        }
    });

    const leaveEventMutation = useMutation({
        mutationFn: ([eventId]: [string | number]) =>
            stopParticipatingEvent(eventId),
        onSuccess: () => {
            query.refetch();
            setBannerMessage('Succesfully left the event. We will miss you!')
        },
        onError: (errorResponse: any) => {
            setBannerMessage(errorResponse.response.data.detail || errorResponse.message)
        }
    });

    const deleteEventMutation = useMutation({
        mutationFn: ([eventId]: [string | number]) =>
            deleteEvent(eventId),
        onSuccess: () => {
            query.refetch();
            setBannerMessage('Succesfully deleted the event.')
            navigate({to: '/events'})
        },
        onError: (errorResponse: any) => {
            setBannerMessage(errorResponse.response.data.detail || errorResponse.message)
        }
    });

    const handleJoinEvent = (eventId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault();

        if (user) {
            joinEventMutation.mutate([eventId]);
        } else {
            setBannerMessage('You need to login to join the event.')
        }
    };

    const handleLeaveEvent = (eventId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault();

        if (user) {
            leaveEventMutation.mutate([eventId]);
        } else {
            setBannerMessage('You need to login to join the event.')
        }
    };

    const handleDeleteEvent = (eventId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault();

        if (user?.isEmployee) {
            deleteEventMutation.mutate([eventId])
        }
    }

    return (
        <div>
            <Container>
                <Button as="a" variant='link' onClick={() => navigate({to: '/events'})}>
                    Back to events
                </Button>

                {bannerMessage &&
                    <Alert alert={{message: bannerMessage, variant: 'danger'}} onClose={() => setBannerMessage(null)}/>}

                <div className="mb-4">
                    <h1>{event?.title}</h1>
                    <h5>{event?.startsAt}</h5>
                    <h6>{event?.location}</h6>
                    {event?.past
                        ? <span>Ended: {event?.startsIn}</span>
                        : <span>Starts in: {event?.startsIn}</span>
                    }
                    <br/>

                    {event?.isParticipant ?
                        <Button onClick={handleLeaveEvent(event?.id)} disabled={event?.past}>Leave event</Button>
                        :
                        <Button onClick={handleJoinEvent(event?.id)} disabled={event?.past}>Join event</Button>
                    }
                </div>
                <div className="mb-5">{event?.description}</div>
                <div>
                    <h5>Deelnemers:</h5>
                    <ul>
                        {event?.participants['member'].map((p) => (
                            <li key={p.id}>{p.email}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    {user?.isEmployee &&
                        <Button onClick={handleDeleteEvent(event?.id)} variant='danger'>
                            Delete event
                        </Button>
                    }
                </div>
            </Container>
        </div>
    );
}
