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
    ChartContainer,
    SymbolSwitch,
    ControlWidget
} from './Components'

//Material UI Components
import { Button, Paper, Box, createMuiTheme, ThemeProvider } from '@material-ui/core'

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

    //get theme configuration
    const themeConfig = createMuiTheme(state.theme)

    // layout for react-grid
    const layout = [
        { i: 'a', x: 0, y: 0, w: 4, h: 6 },
        { i: 'b', x: 4, y: 0, w: 4, h: 6 },
        { i: 'c', x: 0, y: 8, w: 4, h: 1 },
        { i: 'd', x: 4, y: 7, w: 4, h: 6 },
        { i: 'e', x: 8, y: 0, w: 4, h: 6 }
    ]

    return (
        <ThemeProvider theme={themeConfig}>
            <Paper>
                <h1>React-Dashboard</h1>
                <GridLayout className="layout" layout={layout} cols={12} rowHeight={40} width={1800}>
                    <Paper elevation={3} key="a">
                        <NotificationsContainer notifications={state.notifications} dispatch={dispatch} />
                    </Paper>
                    <Paper elevation={3} key="b">
                        <ChartContainer symbol={state.data.symbol} />
                    </Paper>
                    <Paper elevation={3} key="c">
                        <ControlWidget dispatch={dispatch} />
                    </Paper>
                    <Paper elevation={3} key="d">
                        <ChartContainer symbol="YEN" />
                    </Paper>
                    <Paper elevation={3} key="e">
                        <SymbolSwitch dispatch={dispatch} />
                    </Paper>
                </GridLayout>
            </Paper>
        </ThemeProvider>
    )
}

export default Dashboard