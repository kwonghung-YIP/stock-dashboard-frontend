import React, { useContext, useState } from 'react'
import '../sidebar.css'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ConfigContext } from './Utils';

function SideBar(props) {
    const [show,setShow] = useState(props.show);

    const checkRefresh = (e) => {
        //console.log(e.target.checked);
        const newConfig = {};
        Object.assign(newConfig,props.config);
        if (e.target.checked) {
            newConfig.refreshInterval = 2;
        } else {
            newConfig.refreshInterval = 0;
        }
        props.setConfig(newConfig);
    };

    return (
        <>
            <div className="wrapper">
                <nav id="sidebar" className={show?"active":""}>
                    <div className="menu-btn">
                        <button type="button" className="btn btn-primary" onClick={() => setShow(!show)}>
                            M
                        </button>
                    </div>
                  
                    <div className="sidebar-header">
                        Stock Dashboard Demo Configuration
                    </div>

                    <Form className="config-form">
                        <Form.Group>
                            <Form.Label>Add New Stock Quote</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" placeholder="googl, amzn, msft, ..."/>
                                <InputGroup.Append>
                                    <Button>Add</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Auto Refresh Stock Quote</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox onChange={checkRefresh}/>
                                </InputGroup.Prepend>
                                <Form.Control type="text" placeholder="interval in sec"/>
                            </InputGroup>
                        </Form.Group>
                    </Form>

                </nav> 
            </div>
            <div className={`overlay ${show?"active":""}`}></div>
        </>
    )
}

SideBar.defaultProps = {
    show: false
}

export default SideBar