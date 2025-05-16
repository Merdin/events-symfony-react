import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useEvents} from "../../queries/useEvents";
import {useState} from "react";
import Alert from "../../components/Alert";
import EventCard from "../../components/EventCard";
import {Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../components/AuthContext";

export const Route = createFileRoute('/events/')({
    component: EventsIndex,
})

function EventsIndex() {
    const { user } = useAuth();

    const navigate = useNavigate();
    const query = useEvents();

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleOpenEvent = (eventId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault()

        navigate({to: `/events/${eventId}`})
    }

    return (
        <div>
            { user?.isEmployee &&
            <div className="mb-4">
                <Button as="a" onClick={() => navigate({to: '/events/new'})}>Make event</Button>
            </div>
            }

            {errorMessage && (
                <Alert
                    alert={{message: errorMessage, variant: 'danger'}}
                    onClose={() => setErrorMessage(null)}
                />
            )}

            <h1>Events</h1>
            <Container fluid>
                <Row className="g-4">
                    {query.data?.pages.reduce((acc: JSX.Element[], page) => {
                        const elements = page.map((event: any) => (
                            <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
                                <EventCard event={event} onClick={handleOpenEvent(event.id)}/>
                            </Col>
                        ));
                        return acc.concat(elements);
                    }, [])}
                </Row>
            </Container>
        </div>
    );
}
