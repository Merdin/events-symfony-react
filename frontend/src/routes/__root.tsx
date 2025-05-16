import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../components/AuthContext";

export const Route = createRootRoute({
    component: () => {
        const { user } = useAuth();

        return (
            <>
                <div className="p-2 flex gap-2">
                    <Link to="/" className="[&.active]:font-bold">
                        Home
                    </Link>{' '}
                    <Link to="/events" className="[&.active]:font-bold">
                        Events
                    </Link>{' '}
                    <Link to="/users" className="[&.active]:font-bold">
                        Users
                    </Link>{' '}
                    {user ? (
                        <>
                            <span className="mx-3">Welcome, {user.email}</span>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link to="/login" className="[&.active]:font-bold">
                            Login
                        </Link>
                    )}
                </div>
                <hr />
                <Outlet />
                <TanStackRouterDevtools />
            </>
        );
    },
});
