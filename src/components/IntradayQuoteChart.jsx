import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, Label, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import moment from 'moment';

function IntradayQuoteChart(props) {
    const { symbol, previous, intraday } = props;

    const chartWidth = 400;
    const xAxisHeight = 20;
    const yAxisWidth = 45;   
    
    let [min,max,offset,prev] = [-1,1,0.5,0];
    const data = [];
    if ( previous !== null && intraday !== null && intraday.length > 0 ) {
        prev = previous.close;
        max = prev;
        min = prev;
        intraday.map( ( quote,i ) => {
            const point = {
                date: new Date(quote.timestamp).getTime(),
                price: quote.close,
                volumeUp: 0,
                volumeDown: 0
            }
            if ( quote.close >= prev ) {
                point.volumeUp = quote.volume;
            } else {
                point.volumeDown = quote.volume;
            }
            max = point.price !== null && point.price > max ? point.price : max;
            min = point.price !== null && point.price < min ? point.price : min;
            data.push(point);
        });
        offset = ( prev - min )/( max - min );
    }

    return (
        <>
            <AreaChart width={chartWidth} height={150} margin={{top:0,bottom:2,left:0,right:55}} 
                data={data} baseValue={prev} syncId={`${symbol}-chart`}>
                <XAxis dataKey="date"
                    type="number"
                    domain={['dataMin', 'dataMax']} 
                    scale="time"
                    tickFormatter={(timeValue) => {
                        return moment(timeValue).format('H:m');
                    }}
                    height={xAxisHeight} padding={{ left: 5, right: 5 }} />
                <YAxis
                    domain={[
                        dataMin => Math.min(dataMin,prev),
                        dataMax => Math.max(dataMax,prev)
                    ]}
                    tickFormatter={(value) => value.toFixed(2)}
                    width={yAxisWidth} padding={{top:5,bottom:5}}/>
                <CartesianGrid />
                <Tooltip content={<PriceToolTip prevClose={prev}/>} />
                <defs>
                    <linearGradient id={`splitColor-${symbol}`} x1="0" y1="1" x2="0" y2="0" >
                        <stop offset={offset} stopColor="red" stopOpacity={1} />
                        <stop offset={offset} stopColor="green" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <ReferenceLine y={prev} stroke="red" strokeDasharray="3 3">
                    <Label position="right" className="prev-close-tag">
                        Prev-close
                    </Label>
                </ReferenceLine>
                <Area type="linear" dataKey="price" connectNulls={true}
                    activeDot={{ stroke: 'green', strokeWidth: 1, r: 2 }} 
                    isAnimationActive={false} stroke="#8884d8" strokeWidth={2} 
                    fill={`url(#splitColor-${symbol})`} />
            </AreaChart>

            <BarChart width={chartWidth} height={100} margin={{top:0,bottom:2,left:0,right:55}}
                data={data} syncId={`${symbol}-chart`}>
                <XAxis dataKey="date"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    scale="time"
                    tickFormatter={(timeValue) => {
                        return moment(timeValue).format('H:m');
                    }}
                    height={xAxisHeight} padding={{ left: 5, right: 5 }} />
                <YAxis 
                    tickFormatter={(value) => (value / 1000).toFixed(2) + "k"} 
                    width={yAxisWidth} padding={{top:5,bottom:5}}/>
                <CartesianGrid />
                <Tooltip content={<VolumeToolTip prevClose={prev}/>} />
                <Bar dataKey="volumeDown" stackId="vol" fill="red" isAnimationActive={false} />
                <Bar dataKey="volumeUp" stackId="vol" fill="green" isAnimationActive={false} />
            </BarChart>
        </>
    );

}

function PriceToolTip(props) {

    const { prevClose, label, payload, active } = props;

    if (active && payload != null && payload.length > 0) {
        const spot = payload[0].value;
        const fontColor = spot < prevClose ? "price-down" : "price-up";
        return (
            <div className="recharts-custom-tooltip">
                <span>{moment(label).format('D MMM h:m A')} &nbsp;
                    <span className={fontColor}>{spot}</span>
                </span>
            </div>
        );
    } else {
        return [];
    }
}

function VolumeToolTip(props) {

    const { prevClose, label, payload, active } = props;

    if (active && payload != null && payload.length > 0) {
        const spot = payload[0].payload['price'];
        const fontColor = spot < prevClose ? "price-down" : "price-up";
        return (
            <div className="recharts-custom-tooltip">
                <span>{moment(label).format('D MMM h:m A')} &nbsp;
                    <span className={fontColor}>{payload[0].payload['volume']}</span>
                </span>
            </div>
        );
    } else {
        return [];
    }
}
export default IntradayQuoteChart;