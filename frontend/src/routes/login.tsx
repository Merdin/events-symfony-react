import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useMutation} from "@tanstack/react-query";
import {login as loginAPI} from "../api/auth";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAuth} from "../components/AuthContext";

export const Route = createFileRoute('/login')({
    component: Login,
});

function Login() {
    const navigate = useNavigate()
    const { login, logout } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: loginAPI,
        onSuccess: ({ token }) => {
            login(token)
            navigate({ to: '/events' })
        },
        onError: (errorResponse: any)=> {
            logout()
            setError(errorResponse.message || 'Login failed')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate({ email, password })
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

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
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                    as="a"
                    disabled={mutation.isPending}
                    variant="link"
                    onClick={() => navigate({ to: '/register' })}
                >
                    Register
                </Button>
            </form>
        </div>
    );
}
