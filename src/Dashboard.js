//react
import React, {
    useReducer,
    useEffect
} from 'react'

//react-grid-layout
import GridLayout from 'react-grid-layout'

//components
import {
    NotificationsContainer,
    Btn,
    ChartContainer,
    SymbolSwitch
} from './Components'

//reducer
import {
    reducer,
    initState,
    actions
} from './reducer'

//data related functions
import {
    createObservable,
} from './data'

//CSS
import './css/react-grid-styles.css'
import './css/react-resizable-styles .css'


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

    // layout is an array of objects, see the demo for more complete usage
    const layout = [
        { i: 'a', x: 0, y: 0, w: 4, h: 6 },
        { i: 'b', x: 4, y: 0, w: 4, h: 6 },
        { i: 'd', x: 4, y: 7, w: 4, h: 6 },
        { i: 'e', x: 8, y: 0, w: 4, h: 6 }
    ]

    return (
        <div className="dashboard">
            <h1>React-Dashboard</h1>
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1800}>
                <div key="a">
                    <NotificationsContainer notifications={state.notifications} dispatch={dispatch} />
                </div>
                <div key="b">
                    <ChartContainer symbol={state.data.symbol} />
                </div>
                <div key="c">
                    <Btn
                        text='Add Notification'
                        onClick={() => {
                            dispatch({
                                type: actions.NOTIFICATION_ADD,
                                payload: {
                                    id: Date.now(),
                                    text: 'CUSTOM',
                                    status: 'ehaaa'
                                }
                            })
                        }}
                    />
                </div>
                <div key="d">
                    <ChartContainer symbol="YEN" />
                </div>
                <div key="e">
                    <SymbolSwitch dispatch={dispatch} />
                </div>
            </GridLayout>

        </div>
    )
}

export default Dashboard