import React, { createContext, useState } from 'react'
import SideBar from './SideBar';
import StockCard from './StockCard'
import { ConfigContext } from './Utils';

function Dashboard() {

    //const [refreshInterval,setRefreshInterval] = useState(2);

    const [ config, setConfig ] = useState({
        apiHost: "192.168.1.151:8080",
        refreshInterval: 2
    });

    return (
        <ConfigContext.Provider value={config}>
            <SideBar config={config} setConfig={setConfig}/>
            <div>
                <h4><a href="https://iexcloud.io">Data provided by IEX Cloud</a></h4>
            </div>
            <StockCard symbol="aapl"/>
            <StockCard symbol="fb"/>
        </ConfigContext.Provider>
    )
}

export default Dashboard
