import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <h3>Welcome!</h3>
            <h5>Project by: Merdin Kahrimanović</h5>

            <div>
                <span>I have used the following technologies:</span>
                <ul>
                    <li>
                        Symfony 6.4
                    </li>
                    <li>
                        API Platform
                    </li>
                    <li>
                        React + TypeScript
                    </li>
                    <li>
                        TanStack Router & Query
                    </li>
                </ul>
            </div>

            <div>
                How long did it take to build this project: 1.5/2 days
            </div>

            <div>
                Most challenging parts: learning the frameworks
            </div>
        </div>
    )
}
