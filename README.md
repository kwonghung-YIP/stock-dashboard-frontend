# Stock Quote Dashboard - React Frontend

Stock Quote Dashboard is a end-to-end demo for how to boost the network throughput between browser and REST API backend using HTTP/2 protocol, this repo is the React frontend implementation, for the Spring WebFlux backend, you can find it [here](https://github.com/kwonghung-YIP/stock-dashboard-backend).

![Application architecture](/architecture.png)

#Run the React frontend

* Install Node.js server to your local.
* Since the Netty backend default use a self-signed cert for HTTPS, your browser has to trust it or the React frontend cannot fetch the data from backend.
* Run the following to launch the node.js server.

```bash
git clone https://github.com/kwonghung-YIP/stock-dashboard-frontend.git
cd stock-dashboard-frontend
npm install
HTTPS=true npm start
```
