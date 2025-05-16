import {createFileRoute, redirect} from "@tanstack/react-router";
import {useAuth} from "../components/AuthContext";

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ location }) => {
        const { user, logout } = useAuth();

        if (!user) {
            logout()

            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
})
