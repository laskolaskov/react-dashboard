import { interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { createChart, LineStyle } from 'lightweight-charts'
import { getFeed } from './priceSummaryFeed/feed'

//create notifications feed
const createObservable = () => {
    return interval(2000).pipe(
        map(x => createRandomNotification())
    )
}

//create chart
const makeChart = (domEl, w, h, symbol) => {
    //get main feed
    const feed = getFeed().pipe(
        //reduce output to only the symbol from agrs
        map(x => x.reduce((acc, el) => {
            if (el.symbol === symbol) {
                acc = el
            }
            return acc
        }, null)),
    )
    //chart configuration
    const chart = createChart(domEl, {
        width: w ? w : 400,
        height: h ? h : 300,
        timeScale: {
            timeVisible: true,
            secondsVisible: true,
            borderColor: 'rgba(197, 203, 206, 0.4)',
        },
        layout: {
            backgroundColor: '#100841',
            textColor: '#ffffff',
        },
        grid: {
            vertLines: {
                color: 'rgba(197, 203, 206, 0.4)',
                style: LineStyle.Dotted,
            },
            horzLines: {
                color: 'rgba(197, 203, 206, 0.4)',
                style: LineStyle.Dotted,
            },
        },
    })
    //series
    const buySeries = chart.addAreaSeries({
        topColor: 'rgba(67, 83, 254, 0.7)',
        bottomColor: 'rgba(67, 83, 254, 0.3)',
        lineColor: 'rgba(67, 83, 254, 1)',
        lineWidth: 2,
    })
    const sellSeries = chart.addAreaSeries({
        topColor: 'rgba(255, 192, 0, 0.7)',
        bottomColor: 'rgba(255, 44, 44, 0.3)',
        lineColor: 'rgba(255, 44, 44, 1)',
        lineWidth: 2,
    })
    buySeries.setData([])
    sellSeries.setData([])
    //sub to the source
    const sub = feed.subscribe(
        (data) => {
            //update chart series
            if (data) {
                buySeries.update({ time: Math.floor(data.timestamp * 0.001), value: data.bestBuyPrice.value })
                sellSeries.update({ time: Math.floor(data.timestamp * 0.001), value: data.bestSellPrice.value })
            }
        },
        (err) => console.error(err),
        () => console.log('Data Feed Completed !')
    )
    //return cleanup function
    return () => {
        //remove chart with its DOM elements
        chart.remove()
        //unsub the feed
        sub.unsubscribe()
    }
}

//helpers
const createRandomNotification = () => ({
    id: Date.now(),
    text: 'some random text',
    status: getRandomArrayElement(['success', 'error', 'warning', 'info'])
})

const getRandomArrayElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

export {
    createObservable,
    createRandomNotification,
    makeChart,
}