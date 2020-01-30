//React
import React, { useEffect, useRef } from 'react'

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
import {
    Button,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormGroup,
    Switch,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    List,
    Avatar,
    IconButton,
    makeStyles
} from '@material-ui/core'

//Material Ui Icons
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Notifications'

import './css/styles.css'

//create styles
const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
    },
}))

/*
 * Functional components.
 */
const NotificationsContainer = (props) => {
    return (
        <List dense={false}>
            {props.notifications
                //get last 10 notifications
                .slice(props.notifications.length > 10 ? props.notifications.length - 10 : 0, props.notifications.length)
                //the last shows on top
                .reverse()
                //map to components
                .map((n, k) => {
                    let icon
                    switch (n.status) {
                        case 'error':
                            icon = <ErrorIcon />
                            break
                        case 'success':
                            icon = <DoneIcon />
                            break
                        default:
                            icon = <InfoIcon />
                    }
                    return (
                        <ListItem key={k}>
                            <ListItemAvatar>
                                <Avatar>
                                    {icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={n.text}
                                secondary={`${n.status} : ${new Date(n.id).toISOString()}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        console.log('click', n)
                                        props.dispatch({ type: actions.NOTIFICATION_REMOVE, payload: n.id })
                                    }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>

    )
}

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

const SymbolSwitchWidget = React.memo((props) => {
    const classes = useStyles()
    return (
        <div>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Switch Symbol</FormLabel>
                <RadioGroup
                    row
                    name="symbol"
                    value={props.symbol}
                    onChange={(e) => {
                        props.dispatch({ type: actions.DATA_SWITCH_SYMBOL, payload: e.target.value })
                        props.dispatch({
                            type: actions.NOTIFICATION_ADD,
                            payload: {
                                id: Date.now(),
                                text: `Switched to ${e.target.value}`,
                                status: 'success'
                            }
                        })
                    }}>
                    {availableSymbols.map((symbol, i) => {
                        return (
                            <FormControlLabel
                                key={i}
                                value={symbol}
                                control={<Radio color="primary" />}
                                label={symbol}
                            />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        </div>
    )
})

const ControlWidget = React.memo((props) => {
    //local state for switch position
    const [state, setState] = React.useState(true)
    return (
        <div>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={state}
                            onChange={(e) => {
                                props.dispatch({
                                    type: actions.THEME_SWITCH_MODE
                                })
                                setState(e.target.checked)
                            }}
                            value="dummy"
                            color="primary"
                        />
                    }
                    label="Switch Theme Mode"
                    labelPlacement="start"
                />
            </FormGroup>
            <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={() => {
                    props.dispatch({
                        type: actions.NOTIFICATION_ADD,
                        payload: {
                            id: Date.now(),
                            text: 'CUSTOM',
                            status: 'test'
                        }
                    })
                    /* props.dispatch({
                        type: actions.THEME_SWITCH_MODE
                    }) */
                }}
            >Add Notification</Button>
        </div>
    )
})

//export
export {
    NotificationsContainer,
    ChartContainer,
    SymbolSwitchWidget,
    ControlWidget
}