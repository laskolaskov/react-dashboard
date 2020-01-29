//React
import React, { useEffect, useReducer, useRef, useCallback } from 'react'

//reducer
import {
    actions
} from './reducer'

//other
import {
    makeChart,
} from './data'

import {
    availableSymbols
} from './priceSummaryFeed/feed'

//Material UI Components
import { Button } from '@material-ui/core'

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
                        <Button
                            key={i}
                            variant="contained"
                            color="primary"
                            style={
                                { margin: 2 + 'px' }
                            }
                            fullWidth={true}
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
                            }}>
                            Switch to {symbol}
                        </Button>
                    )
                })
            }
        </div>
    )
})

const ControlWidget = React.memo((props) => {
    return (
        <Button
            variant="contained"
            color="secondary"
            fullWidth={true}
            onClick={() => {
                props.dispatch({
                    type: actions.NOTIFICATION_ADD,
                    payload: {
                        id: Date.now(),
                        text: 'CUSTOM',
                        status: 'ehaaa'
                    }
                })
                props.dispatch({
                    type: actions.THEME_SWITCH_MODE
                })
            }}
        >
            Add Notification
                    </Button>
    )
})

//export
export {
    NotificationsContainer,
    Notification,
    ChartContainer,
    SymbolSwitch,
    ControlWidget
}