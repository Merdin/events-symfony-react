import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useMutation} from "@tanstack/react-query";
import {register as registerAPI} from "../api/auth";
import {useState} from "react";
import Button from "react-bootstrap/Button";

export const Route = createFileRoute('/register')({
    component: Register,
});

function Register() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: registerAPI,
        onSuccess: () => {
            navigate({ to: '/login' })
        },
        onError: (errorResponse: any)=> {
            setError(errorResponse.message || 'Register account failed')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate({ email, password })
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Create your account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div>{error}</div>}

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </div>
    );
}
