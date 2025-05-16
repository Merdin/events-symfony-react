import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import Button from "react-bootstrap/Button";
import {makeEvent} from "../../api/events";

export const Route = createFileRoute('/events/new')({
    component: NewEvent,
});

function NewEvent() {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [maxParticipants, setMaxParticipants] = useState<number | null>(null)
    const [location, setLocation] = useState('')
    const [startsAt, setStartsAt] = useState('')

    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: ({ title, description, maxParticipants, location, startsAt }: {
            title: string;
            description: string;
            maxParticipants: number | null;
            location: string;
            startsAt: string;
        }) => makeEvent({ title, description, maxParticipants, location, startsAt }),
        onSuccess: () => {
            navigate({ to: '/events' })
        },
        onError: (errorResponse: any)=> {
            setError(errorResponse.message || 'Event not created')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate({ title, description, maxParticipants, location, startsAt })
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Make event</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Maximum participants</label>
                    <input
                        type="number"
                        value={maxParticipants}
                        onChange={(e) => {
                            const val = e.target.value;
                            const value = val === '' ? null : Number(val)
                            setMaxParticipants(value)
                        }}
                    />
                </div>

                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Starts at</label>
                    <input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                        required
                    />
                </div>

                {error && <div>{error}</div>}

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Creating event...' : 'Create event'}
                </Button>
            </form>
        </div>
    );
}
