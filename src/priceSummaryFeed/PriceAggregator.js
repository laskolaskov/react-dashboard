import { interval, merge } from 'rxjs'
import { map, publish, buffer } from 'rxjs/operators'

class PriceAggregator {
    constructor(initialPriceFeeds) {
        this.priceFeeds = []
        this.counter = 0
        if (Array.isArray(initialPriceFeeds)) {
            this.priceFeeds = initialPriceFeeds
        } else {
            this.priceFeeds.push(initialPriceFeeds)
        }
    }

    getFeedForTimeFrame(timeFrame) {
        //timer ticking every 'timeFrame' seconds
        const timer = interval(timeFrame * 1000)
        //create the aggregated feed
        const feed = merge(
            //augment all feeds output to include their extended PriceFeed props
            ...this.priceFeeds.map(
                pf => pf.pipe(
                    map(val => ({
                        symbol: pf.symbol,
                        providerName: pf.providerName,
                        commission: pf.commission,
                        ...val
                    }))
                )
            )).pipe(
                //buffer output between timer ticks
                buffer(timer),
                //aggregate the buffered output
                //uses custom aggregator function
                map(x => this.aggregator(x)),
                //publish as ConnectableObservable
                publish()
            )
        //console.log('FEED :: ', feed)
        return feed
    }

    addPriceFeed(priceFeed) {
        this.priceFeeds.push(priceFeed)
    }

    removePriceFeed(providerName) {

    }

    aggregator(input) {
        //console.log('input :: ', input);
        const reduced = input.reduce((result, pf) => {
            if (!result[`${pf.providerName}-${pf.symbol}`]) {
                result[`${pf.providerName}-${pf.symbol}`] = pf
            } else if (
                result[`${pf.providerName}-${pf.symbol}`].timestamp < pf.timestamp
            ) {
                result[`${pf.providerName}-${pf.symbol}`] = pf
            }
            return result
        }, {})
        //console.log('reduced :: ', reduced)
        //console.log('count :: ', Object.values(reduced).length)
        return Object.values(
            Object.values(reduced).reduce((summary, pf) => {
                //does symbol exists as key ?
                if (!summary[pf.symbol]) {
                    summary[pf.symbol] = this.initPriceSummary(pf)
                } else {
                    if (pf.value.buyPrice > summary[pf.symbol].bestBuyPrice.value) {
                        summary[pf.symbol].bestBuyPrice = {
                            value: pf.value.buyPrice,
                            spread: pf.value.buyPrice - pf.value.sellPrice,
                            provider: pf.providerName,
                        }
                    }
                    if (pf.value.sellPrice < summary[pf.symbol].bestSellPrice.value) {
                        summary[pf.symbol].bestSellPrice = {
                            value: pf.value.sellPrice,
                            spread: pf.value.sellPrice - pf.value.buyPrice,
                            provider: pf.providerName
                        }
                    }
                }
                return summary
            }, {})
        )
    }

    initPriceSummary(pf) {
        return {
            symbol: pf.symbol,
            timestamp: Date.now(),
            bestBuyPrice: {
                value: pf.value.buyPrice,
                spread: pf.value.buyPrice - pf.value.sellPrice,
                provider: pf.providerName,
            },
            bestSellPrice: {
                value: pf.value.sellPrice,
                spread: pf.value.sellPrice - pf.value.buyPrice,
                provider: pf.providerName
            }
        }
    }
}

export {
    PriceAggregator
}