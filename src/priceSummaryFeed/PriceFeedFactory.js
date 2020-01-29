import { interval } from 'rxjs'
import { map, publish } from 'rxjs/operators'

const PriceFeedFactory = (dataInterval) => {
    //create random type PricePoint = Timestamp<PriceOffer>
    const randomPricePoint = () => {
        return {
            value: {
                //Math.random() * (max - min) + min;
                buyPrice: Math.random() * (250 - 185) + 185,
                sellPrice: Math.random() * (250 - 185) + 185,
            },
            timestamp: Date.now()
        }
    };
    const getRandomElement = (arr) => {
        return arr[Math.floor((Math.random()*arr.length))];
    }
    const randomProviders = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const randomSymbols = ['USD', 'BGN', 'GBR', 'YEN']
    const pp$ = interval(dataInterval)
        .pipe(
            map(x => randomPricePoint()),
            publish()
        );
    //add the PriceFeed extension class props ? or add them to the output ???
    pp$.symbol = getRandomElement(randomSymbols)
    pp$.providerName = getRandomElement(randomProviders)
    pp$.commission = Math.random() * (0.1 - 0.03) + 0.03

    //should I connect immediately ?
    pp$.connect()
    //log
    //console.log('pp$ created :: ', pp$)
    //return
    return pp$
}

export {
    PriceFeedFactory
}