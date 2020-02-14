const express = require('express');
const app = express();
const stuff = require('./stuff');
const PORT = process.env.PORT || 3000;
app.get('/api', (req, res) => {

    const perPage = 'perPage' in req.query && Number(req.query.perPage) ? Number(req.query.perPage) : 3;
    const currentPage = 'page' in req.query && Number(req.query.page)? Number(req.query.page) : 1;
    const urlPrefix = '/api?page=';
    const pages = Math.ceil(stuff.length/perPage);

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

const getNextPageUrl = (current_page, total_pages, url_prefix) => {
    return current_page < total_pages ? `${url_prefix}${current_page+1}` : null
}
const getPrevPageUrl = (current_page, url_prefix) => current_page > 1 ? `${url_prefix}${current_page-1}` : null

app.listen(PORT, () => {
    console.log('Server was runnig...')
})