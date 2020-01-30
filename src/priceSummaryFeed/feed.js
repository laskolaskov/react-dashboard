//RXJS operators
import { map } from 'rxjs/operators'
//socket io client
//import io from 'socket.io-client'

const getFeed = () => {
    //console.log('returning feed :: ', aggregatorFeed.source)
    return null //aggregatorFeed.source

}

const getFeedForSymbol = (feed, symbol) => {
    return feed.pipe(
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
    //connectToServer,
    getFeed,
    getFeedForSymbol,
    availableSymbols
}