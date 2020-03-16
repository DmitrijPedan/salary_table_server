const express = require('express');
const app = express();
const stuff = require('./stuff');
const stocks = require('./stocks');

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.PORT || 8181;

const WebSocketServer = require('ws').Server;
const wsServer = new WebSocketServer({port: WS_PORT});

wsServer.on('connection', ws => {
    console.log('WS connection was detected');
    const generateRandomFloat = (min, max) => Number((Math.random()*(max-min) + min).toFixed(2))

    const updateStockRandomly = () => {
        Object.keys(stocks).map(key => stocks[key] += generateRandomFloat(-100,100));
        ws.send(JSON.stringify(stocks))
        setTimeout(updateStockRandomly, generateRandomFloat(10,90)*100)
    }
    updateStockRandomly();
})


app.get('/api', (req, res) => {
    const perPage = 'perPage' in req.query && Number(req.query.perPage) ? Number(req.query.perPage) : 3;
    const currentPage = 'page' in req.query && Number(req.query.page)? Number(req.query.page) : 1;
    const urlPrefix = '/api?page=';
    const pages = Math.ceil(stuff.length/perPage);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        info: {
            count: stuff.length,
            pages,
            next: getNextPageUrl(currentPage, pages, urlPrefix),
            prev: getPrevPageUrl(currentPage, urlPrefix),
            currentPage,
            perPage,
          },
          results: stuff.slice((currentPage-1)*perPage,currentPage*perPage)
    })
});

app.get('/stocks', (req,res) => {
    res.json(stocks);
})

const getNextPageUrl = (current_page, total_pages, url_prefix) => {
    return current_page < total_pages ? `${url_prefix}${current_page+1}` : null
}
const getPrevPageUrl = (current_page, url_prefix) => current_page > 1 ? `${url_prefix}${current_page-1}` : null

app.listen(HTTP_PORT, () => {
    console.log('Server was runnig...')
})