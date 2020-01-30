import { map }  from 'rxjs/operators'

//custom
import { PriceAggregator } from './PriceAggregator.js'
import { PriceFeedFactory } from './PriceFeedFactory.js'

let feed = null

const getFeed = () => {
    if (feed) {
        return feed
    }
    const feedsCount = 60
    const feedsArr = Array(feedsCount).fill(null).map(() => PriceFeedFactory(Math.floor(Math.random() * (500 - 300) + 300)))

    const aggr = new PriceAggregator(feedsArr)

    const newFeed = aggr.getFeedForTimeFrame(2)
    /* const feedCon = */ newFeed.connect()
    //set the feed 
    feed = newFeed
    //return
    return newFeed
}

const getFeedForSymbol = (symbol) => {
    return getFeed().pipe(
        //reduce output to only the symbol from agrs
        map(x => x.reduce((acc, el) => {
            if (el.symbol === symbol) {
                acc = el
            }
            return acc
        }, null)),
    )
}

const availableSymbols = ['USD', 'BGN', 'GBR', 'YEN']

export {
    getFeed,
    getFeedForSymbol,
    availableSymbols
}