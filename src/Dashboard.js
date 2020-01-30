//react
import React, {
    useReducer,
    useEffect
} from 'react'

//react-grid-layout
import { Responsive, WidthProvider } from 'react-grid-layout'

//components
import {
    NotificationsContainer,
    ChartContainer,
    SymbolSwitchWidget,
    ControlWidget
} from './Components'

//Material UI Components
import {
    createMuiTheme,
    Paper,
    AppBar,
    Toolbar,
    Typography,
    ThemeProvider,
} from '@material-ui/core'

//reducer
import {
    reducer,
    initState,
    actions
} from './reducer'

//CSS
import './css/react-grid-styles.css'
import './css/react-resizable-styles .css'
//Fonts
import 'typeface-roboto'

//responsive grid component
const ResponsiveGridLayout = WidthProvider(Responsive)


const Dashboard = (props) => {
    //get state and dispatcher
    const [state, dispatch] = useReducer(reducer, initState)
    //subscribe to notifications feed
    useEffect(() => {
        const sub = props.notificationFeed.subscribe(
            (data) => {
                dispatch({
                    type: actions.NOTIFICATION_ADD,
                    payload: {id: Date.now(), text: data, status: 'info'}
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
        { i: 'a', x: 0, y: 0, w: 4, h: 15 },
        { i: 'b', x: 4, y: 2, w: 8, h: 13 },
        { i: 'c', x: 4, y: 0, w: 2, h: 2 },
        { i: 'd', x: 4, y: 9, w: 8, h: 8 },
        { i: 'e', x: 6, y: 0, w: 6, h: 2 }
    ]

    const layouts = { lg: layout }

    return (
        <ThemeProvider theme={themeConfig}>
            <Paper>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            React-Dashboard
                     </Typography>
                    </Toolbar>
                </AppBar>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    rowHeight={40}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                >
                    <Paper elevation={3} key="a">
                        <NotificationsContainer notifications={state.notifications} dispatch={dispatch} />
                    </Paper>
                    <Paper elevation={3} key="b">
                        <ChartContainer symbol={state.data.symbol} feed={props.mainFeed}/>
                    </Paper>
                    <Paper elevation={3} key="c">
                        <ControlWidget dispatch={dispatch} />
                    </Paper>
                    <Paper elevation={3} key="e">
                        <SymbolSwitchWidget symbol={state.data.symbol} dispatch={dispatch} />
                    </Paper>
                </ResponsiveGridLayout>
            </Paper>
        </ThemeProvider>
    )
}

export default Dashboard