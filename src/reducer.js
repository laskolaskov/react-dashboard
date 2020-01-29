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
    data: [
        { time: Date.now(), value: 230 },
        /* { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 }, */
    ]
}

//actions
const actions = {
    NOTIFICATION_ADD: '[notifications] add',
    NOTIFICATION_REMOVE: '[notifications] remove',
    DATA_APPEND: '[data] append'
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

//other reducer
const dataReducer = (state, action) => {
    switch (action.type) {
        case actions.DATA_APPEND:
            return [...state]
        default:
            return [...state]
    }
}

//main reducer
const reducer = (state, action) => {
    const newState = {
        notifications: notificationsReducer(state.notifications, action),
        data: dataReducer(state.data, action)
    }
    return newState
}



//exports
export {
    reducer,
    actions,
    initState
}