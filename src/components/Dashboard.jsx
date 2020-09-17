import React, { createContext, useState } from 'react'
import SideBar from './SideBar';
import StockCard from './StockCard'
import { ConfigContext } from './Utils';
import moment from 'moment';

function Dashboard() {

    //const [refreshInterval,setRefreshInterval] = useState(2);

    const [ config, setConfig ] = useState({
        tradeDate: moment("2020-09-04","YYYY-MM-DD"),
        apiHost: "192.168.1.151:8080",
        refreshInterval: 2
    });

    return (
        <ConfigContext.Provider value={config}>
            <SideBar setConfig={setConfig}/>
            <section className="title">
                <h2>Stock Quote Dashboard</h2>
                <span><a href="https://iexcloud.io">Data provided by IEX Cloud</a></span>
            </section>
            <section className="card-list">
                <StockCard symbol="aapl"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
                <StockCard symbol="fb"/>
            </section>
        </ConfigContext.Provider>
    )
}

export default Dashboard
