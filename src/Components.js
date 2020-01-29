//React
import React, { useEffect, useReducer, useRef, useCallback } from 'react'

//reducer
import {
    reducer,
    initState,
    actions
} from './reducer'

//other
import {
    makeChart,
    createObservable
} from './data'
import { cleanup } from '@testing-library/react'

/*
 * Functional components.
 */
const NotificationsContainer = (props) => {
    return (
        <ul className='notifications-container'>
            {
                props.notifications
                    //get last 10 notifications
                    .slice(props.notifications.length > 10 ? props.notifications.length - 10 : 0, props.notifications.length)
                    //the last shows on top
                    .reverse()
                    //map to components
                    .map((n, k) => {
                        return (
                            <Notification
                                onClick={() => {
                                    console.log('click', n)
                                    props.dispatch({ type: actions.NOTIFICATION_REMOVE, payload: n.id })
                                }}
                                key={k}
                                value={`${n.id} : ${n.text} ==> ${n.status}`}
                            />
                        )
                    })
            }
        </ul>
    )
}

const Notification = (props) => (
    <li onClick={props.onClick}>{props.value}</li>
)

const AddNotificationBtn = React.memo((props) => {
    console.log('add n btn props :: ', props)
    return (
        <button className='addBtn' onClick={() => {
            props.dispatch({
                type: actions.NOTIFICATION_ADD,
                payload: {
                    id: Date.now(),
                    text: 'CUSTOM',
                    status: 'ehaaa'
                }
            })
        }}>Add Notification</button>
    )
})

const ChartContainer = React.memo((props) => {
    //get ref to the rendered child element
    const myRef = useRef()
    console.log('chart data source change :: ', props.data)
    //use effects to create chart
    useEffect(() => {
        console.log('ref ::', myRef)
        const el = myRef.current
        console.log('ref.current ::', el)
        const cleanUp = makeChart(el, myRef.current.clientWidth, myRef.current.clientHeight, props.symbol, props.action)
        //clear
        return (() => {
            cleanUp()
        })
    })
    return (
        <div ref={myRef} className="lw-c"></div>
    )
}, (prev, next) => {
    //simple check to compare received data props
    return JSON.stringify(prev.data) === JSON.stringify(next.data)
})

function Test(props) {
    console.log('test props :: ', props)
    return (
        <div className="TEST">{Math.random()}</div>
    )
}

//export
export {
    NotificationsContainer,
    Notification,
    AddNotificationBtn,
    ChartContainer,
    Test
}