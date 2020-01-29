//React
import React, { useEffect, useReducer, useRef, useCallback } from 'react'

//reducer
import {
    actions
} from './reducer'

//other
import {
    makeChart,
    createObservable
} from './data'

import {
    availableSymbols
} from './priceSummaryFeed/feed'

import './css/styles.css'

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

const Btn = React.memo((props) => {
    return (
        <button onClick={props.onClick}>{props.text}</button>
    )
})

const ChartContainer = React.memo((props) => {
    //get ref to the rendered child element
    const myRef = useRef()
    //use effects to create chart
    useEffect(() => {
        const el = myRef.current
        const cleanUp = makeChart(el, myRef.current.clientWidth, myRef.current.clientHeight, props.symbol, props.action)
        //clear
        return (() => {
            cleanUp()
        })
    })
    return (
        <div ref={myRef} className="lw-c" style={{ width: 'auto', height: 100 + '%' }}></div>
    )
})

const SymbolSwitch = React.memo((props) => {
    return (
        <div>
            {
                availableSymbols.map((symbol, i) => {
                    return (
                        <Btn
                            key={i}
                            text={`Switch to ${symbol}`}
                            onClick={() => {
                                props.dispatch({ type: actions.DATA_SWITCH_SYMBOL, payload: symbol })
                                props.dispatch({
                                    type: actions.NOTIFICATION_ADD,
                                    payload: {
                                        id: Date.now(),
                                        text: `Switched to ${symbol}`,
                                        status: 'success'
                                    }
                                })
                            }} />
                    )
                })
            }
        </div>
    )
})

//export
export {
    NotificationsContainer,
    Notification,
    Btn,
    ChartContainer,
    SymbolSwitch
}