import React, { useContext, useEffect, useReducer, useRef } from 'react'
import { Card } from 'react-bootstrap'
import '../stockcard.css'
import IntradayQuoteChart from './IntradayQuoteChart';
import RealtimeQuotePanel from './RealtimeQuotePanel';
import StockProfilePanel from './StockProfilePanel';
import { ConfigContext } from './Utils';
import { moment } from 'moment';

function StockCard({symbol}) {

    const config = useContext(ConfigContext);
    const { apiHost, refreshInterval } = config;

    const initState = {
        profile: null,
        quote: null,
        previous: null,
        intraday: null
    };

    //
    //Reference es6 spread syntax
    //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    //
    const reducer = (state, action) => {
        let newState = { ...state };
        if (action.type === "fetch/profile") {
            newState = { ...state, profile: action.payload };
        } else if (action.type === "fetch/quote") {
            newState = { ...state, quote: action.payload };
        } else if (action.type === "fetch/intraday-init") {
            newState = { 
                ...state, 
                previous: action.payload.previous,
                intraday: action.payload.quote
            };
        } else if (action.type === "fetch/intraday-delta") {
            newState = { ...state, intraday: [ ...state.intraday, ...action.payload] };
        }
        return newState;
    };

    const [ state, dispatch ] = useReducer(reducer,initState);

    const { profile, quote, previous, intraday } = state;

    useEffect(() => {
        console.log("useEffect => fetchStockProfile");
        fetchStockProfile(symbol,apiHost,dispatch);
    },[])

    useEffect(() => {
        console.log("useEffect => fetchLatestQuote");
        if ( profile !== null && refreshInterval > 0 ) {
            const timerId = setInterval(() => {
                fetchLatestQuote(symbol,config.tradeDate,apiHost,dispatch);
            },refreshInterval*1000);
            return () => clearTimeout(timerId);
        }
    },[profile,refreshInterval])

    useEffect(() => {
        console.log("useEffect => initIntradayData");
        if ( profile !== null ) {
            initIntradayData(symbol,apiHost,dispatch);
        }
    },[profile])

    //
    //You will hit the stale closure issue if the intraday variable 
    //is directly reference in the setInterval callback function,
    //please refer to following link for refer:
    //
    // https://dmitripavlutin.com/react-hooks-stale-closures/
    // https://www.youtube.com/watch?v=eTDnfS2_WE4
    //
    const intradayRef = useRef();
    intradayRef.current = intraday;

    useEffect(() => {
        console.log("useEffect => fetchIntradayDelta");
        if ( previous !== null && refreshInterval > 0 ) {
            const timerId = setInterval(() => {
                let since;
                if (intradayRef.current.length > 0) {
                    since = intradayRef.current[intradayRef.current.length -1].timestamp;
                } else {
                    since = '2020-09-04T09:30';
                }
                fetchIntradayDelta(symbol,since,apiHost,dispatch);
            },refreshInterval*1000);
            return () => clearTimeout(timerId);
        }
    },[previous,refreshInterval])
    
    return (
        <Card className="stock-card">
            <Card.Header>{symbol}</Card.Header>
            <Card.Body>
                <Card.Title>
                    <StockProfilePanel profile={profile}/>
                </Card.Title>
                <RealtimeQuotePanel quote={quote}/>
                <IntradayQuoteChart
                    symbol={symbol}
                    previous={previous}
                    intraday={intraday}
                />
            </Card.Body>
        </Card>
    )
}

async function fetchStockProfile(symbol,apiHost,dispatch) {
    try {
        const response = await fetch(`https://${apiHost}/company?symbol=${symbol}`);
        const json = await response.json();
        dispatch({type:"fetch/profile",payload:json});
    } catch (err) {
        console.log("fetchStockProfile error:"+err);
    }
}

async function fetchLatestQuote(symbol,date,apiHost,dispatch) {
    try {
        const tradeDate = moment(date).format('YYYY-MM-DD');
        const response = await fetch(`https://${apiHost}/quote-demo?symbol=${symbol}&date=${tradeDate}`);
        const json = await response.json();
        dispatch({type:"fetch/quote",payload:json});
    } catch (err) {
        console.log("fetchLatestQuote error:"+err);
    }
}

async function initIntradayData(symbol,date,apiHost,dispatch) {
    try {
        const response = await fetch(`https://${apiHost}/intraday-init-demo?symbol=${symbol}&date=2020-09-04`);
        const json = await response.json();
        dispatch({type:"fetch/intraday-init",payload:json});
    } catch (err) {
        console.log("initIntradayData error:"+err);
    }
}

async function fetchIntradayDelta(symbol,since,apiHost,dispatch) {
    try {
        const response = await fetch(`https://${apiHost}/intraday-delta-demo?symbol=${symbol}&since=${since}`);
        const json = await response.json();
        if (Array.isArray(json) && json.length>0) {
            dispatch({type:"fetch/intraday-delta",payload:json});
        }        
    } catch (err) {
        console.log("fetchIntradayDelta error:"+err);
    }
}

export default StockCard
