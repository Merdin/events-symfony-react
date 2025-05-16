import { Card, Button } from "react-bootstrap";

interface CardProps {
    event: any,
    onClick: () => void
}

export default function EventCard({ event, onClick }: CardProps) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                    <Card.Title className="text-truncate" title={event.title}>
                        {event.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                        {event.startsAt}
                    </Card.Subtitle>
                    <Card.Subtitle className="text-muted small">
                        {event.location}
                    </Card.Subtitle>

                </div>
                <Button variant="primary" className="mt-2 align-self-start" onClick={onClick}>
                    Show details
                </Button>
            </Card.Body>
        </Card>
    );
}
