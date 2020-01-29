//using simple reducer to manage local state with React 'useReducer' hook
//bigger application will require more robust solution like 'Redux'

import {
    createRandomNotification,
} from './data'

//initial state
const initState = {
    notifications: [
        {
            id: Date.now(),
            text: 'Example success notification !',
            status: 'success'
        }
    ],
    data: {
        symbol: 'BGN'
    },
    theme: {
        palette: {
            type: 'light'
        }
    }
}

//actions
const actions = {
    NOTIFICATION_ADD: '[notifications] add',
    NOTIFICATION_REMOVE: '[notifications] remove',
    DATA_SWITCH_SYMBOL: '[data] switch symbol',
    THEME_SWITCH_MODE: '[theme] switch mode'
}

//notifications reducer
const notificationsReducer = (state, action) => {
    switch (action.type) {
        case actions.NOTIFICATION_ADD:
            const n = action.payload ? action.payload : createRandomNotification()
            state.push(n)
            return [...state]
        case actions.NOTIFICATION_REMOVE:
            return state.filter(n => n.id !== action.payload ? true : false)
        default:
            return [...state]
    }
}

//data reducer
const dataReducer = (state, action) => {
    switch (action.type) {
        case actions.DATA_SWITCH_SYMBOL:
            return {
                ...state,
                symbol: action.payload,
            }
        default:
            return { ...state }
    }
}

//theme reducer
const themeReducer = (state, action) => {
    switch (action.type) {
        case actions.THEME_SWITCH_MODE:
            console.log('in reducer :: ', action)
            console.log('old state :: ', state)
            const newState = {
                ...state,
                palette: {
                    ...state.palette,
                    type: state.palette.type === 'light' ? 'dark' : 'light'
                },
            }
            console.log('new state :: ', newState)
            return newState
        default:
            return { ...state }
    }
}

//main reducer
const reducer = (state, action) => {
    const newState = {
        notifications: notificationsReducer(state.notifications, action),
        data: dataReducer(state.data, action),
        theme: themeReducer(state.theme, action)
    }
    return newState
}



//exports
export {
    reducer,
    actions,
    initState
}