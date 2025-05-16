import {createFileRoute} from '@tanstack/react-router';
import {useUsers} from "../../queries/useUsers";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {makeEmployee, removeEmployee} from "../../api/users";
import {useAuth} from "../../components/AuthContext";

export const Route = createFileRoute('/users/')({
    component: UsersIndex,
})

function UsersIndex() {
    const { user } = useAuth()
    const query = useUsers();

    const [bannerMessage, setBannerMessage] = useState<string | null>(null)

    const makeEmployeeMutation = useMutation({
        mutationFn: ([userId]: [string | number]) =>
            makeEmployee(userId),
        onSuccess: () => {
            query.refetch();
            setBannerMessage('Succesfully joined the event!')
        },
        onError: (errorResponse: any) => {
            setBannerMessage(errorResponse.message)
        }
    });

    const removeEmployeeMutation = useMutation({
        mutationFn: ([userId]: [string | number]) =>
            removeEmployee(userId),
        onSuccess: () => {
            query.refetch();
            setBannerMessage('Succesfully left the event. We will miss you!')
        },
        onError: (errorResponse: any) => {
            setBannerMessage(errorResponse.message)
        }
    });

    const handleMakeEmployeeEvent = (userId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault();
        makeEmployeeMutation.mutate([userId]);
    };

    const handleRemoveEmployeeEvent = (userId: string | number) => (e: React.MouseEvent) => {
        e.preventDefault();
        removeEmployeeMutation.mutate([userId]);
    };

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {query.data?.map((u: any) => (
                    <li key={u.id}>
                        {u.email}
                        {user?.isAdmin && (
                            <ul>
                                <li>
                                    {u?.roles?.includes(Role.Employee) ? (
                                        <Button as="a" onClick={handleRemoveEmployeeEvent(u.id)}>Remove employee</Button>
                                    ) : (
                                        <Button as="a" onClick={handleMakeEmployeeEvent(u.id)}>Make employee</Button>
                                    )}
                                </li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
