const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])

    if (!bug) return <div>Loading...</div>
    return (
        <div className="bug-details main-layout">
            <h1>Bug Details 🐛</h1>
            <h2>{bug.title}</h2>
            <h3 style={{ fontWeight: 'bolder' }}>
                Severity:{' '}
                <span className={'severity' + bug.severity}>{bug.severity}</span>
            </h3>
            <h3>
                {bug.labels.join(', ')}
            </h3>
            <h3>
                {new Date(bug.createdAt).toLocaleDateString('he')}
            </h3>
            <p>
                Description: <span>{bug.description}</span>
            </p>
            <Link to="/bug">Back to List</Link>
        </div>
    )

}