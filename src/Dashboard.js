//react
import React, {
    useReducer,
    useEffect
} from 'react'

//components
import {
    NotificationsContainer,
    AddNotificationBtn,
    ChartContainer,
    Test
} from './Components'

//reducer
import {
    reducer,
    initState,
    actions
} from './reducer'

import {
    createObservable,
} from './data'


const Dashboard = (props) => {
    //get state and dispatcher
    const [state, dispatch] = useReducer(reducer, initState)
    //subscribe to notifications feed
    useEffect(() => {
        const sub = createObservable().subscribe(
            (data) => {
                dispatch({
                    type: actions.NOTIFICATION_ADD,
                    payload: data
                })
            },
            (err) => console.error(err),
            () => console.log('Completed !')
        )
        return (() => {
            sub.unsubscribe()
        })
    })

    return (
        <div className="dashboard">
            <h1>React-Dashboard</h1>
            <NotificationsContainer notifications={state.notifications} dispatch={dispatch} />
            <AddNotificationBtn dispatch={dispatch} />
            <ChartContainer symbol="BGN" />
            <ChartContainer symbol="GBR" />
            <ChartContainer symbol="USD" />
            <ChartContainer symbol="YEN" />
        </div>
    )
}

export default Dashboard