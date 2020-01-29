//const { ConnectableObservable, Observable, Timestamp, fromEvent, interval } = require('rxjs');
//const { concatMap, takeUntil, take, map, publish } = require('rxjs/operators');

//custom
import { PriceAggregator } from './PriceAggregator.js'
import { PriceFeedFactory } from './PriceFeedFactory.js'

let feed = null

const getFeed = () => {
    if(feed) {
        //return feed
    }
    const feedsCount = 60
    const feedsArr = Array(feedsCount).fill(null).map(() => PriceFeedFactory(Math.floor(Math.random() * (500 - 300) + 300)))

    const aggr = new PriceAggregator(feedsArr)

    const newFeed = aggr.getFeedForTimeFrame(2)
    const feedCon = newFeed.connect()
    const feedSub = newFeed
    /* newFeed.subscribe(x => {
        console.log('feed :: ', x)
        //console.log(`TIME :: ${Date.now() - START} ms`)
    }) */
    //set the feed 
    feed = newFeed
    //return
    return newFeed
}

export {
    getFeed
}