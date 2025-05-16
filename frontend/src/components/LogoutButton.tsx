import {useNavigate} from "@tanstack/react-router";
import Button from 'react-bootstrap/Button'
import {useAuth} from "./AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate({ to: '/login' })
    }

    return (
        <Button onClick={() => handleLogout()}>Logout</Button>
    )
}
