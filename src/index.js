import React from 'react'
import ReactDOM from 'react-dom'
import Dashboard from './Dashboard'
import * as serviceWorker from './serviceWorker'
//import { getFeed } from './priceSummaryFeed/feed'
//RXJS
import { fromEvent } from 'rxjs'
//socket io client
import io from 'socket.io-client'

const aggregatorFeed = {
    source: null,
    sub: null
}

const updateEvent = {
    source: null,
    sub: null
}


/**
 * Web Socket Stuff
 */

//connects to remote server
const socket = io('http://localhost:3000')

socket.on('connect', () => {
    console.log('Connected to server !')
    //create event observables
    aggregatorFeed.source = fromEvent(socket, 'aggregator')
    aggregatorFeed.sub = aggregatorFeed.source.subscribe(aggregatorObserver)
    updateEvent.source = fromEvent(socket, 'update')
    updateEvent.sub = updateEvent.source.subscribe(updateEventObserver)
    //Render the React App
    ReactDOM.render(<Dashboard mainFeed={aggregatorFeed.source} notificationFeed={updateEvent.source} />, document.getElementById('root'))
})

socket.on('disconnect', () => {
    console.error('Disconnected from server !')
    //unsub and clear the aggregated feed
    if (aggregatorFeed.source) {
        aggregatorFeed.sub.unsubscribe()
        console.log('Unsubscribed feed.')
        aggregatorFeed.source = null
    }
    //unsub and clear the update event
    if (updateEvent.source) {
        updateEvent.sub.unsubscribe()
        console.log('Unsubscribed update event.')
        updateEvent.source = null
    }

    //Render the React App
    ReactDOM.render(<h1>Disconnected !!! Waiting for server !</h1>, document.getElementById('root'))
})

const aggregatorObserver = {
    next: (data) => console.log('server feed :: ', data),
    error: (err) => console.log(err),
    complete: () => console.log('Aggregator Feed Completed !')
}

const updateEventObserver = {
    next: (data) => console.log('server event :: ', data),
    error: (err) => console.log(err),
    complete: () => console.log('Update Event Feed Completed !')
}

/**
 * Web Socket Stuff END
 */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
