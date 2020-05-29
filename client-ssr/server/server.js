import path from 'path'
import fs from 'fs'

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import serialize from "serialize-javascript";

import App from '../src/App';
import Home from '../src/components/Home/Home';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';

const PORT = 8080
const app = express()

const router = express.Router();

const processReactComponents = (req, res, next, serverCookies, extraProp) => {

  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('An error occurred')
    }

    

    const sheets = new ServerStyleSheets();

    const html = ReactDOMServer.renderToString(
                                  sheets.collect(
                                    <StaticRouter location={req.url} context={{server: true, extraProp, serverCookies}} >
                                      <App />
                                    </StaticRouter>
                                  )
                                );

    const css = sheets.toString();
    
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>
        <script>window.__initData__ = ${serialize({extraProp, serverCookies})}</script>`
      )
      .replace(
        '<style id="jss-server-side"></style>',
        `<style id="jss-server-side">${css}</style>`
      )
    )
  });
}

const serverRenderer = (req, res, next) => {

  console.log('url:', req.url);

  let cookies = req.headers.cookie ? req.headers.cookie.split(';') : [];
  let serverCookie = {};
  cookies.map(cookie => {
    cookie = cookie.split('=');
    let key = cookie[0].toString().trim();
    let value = decodeURIComponent(cookie[1]);

    try{
      value = JSON.parse(value);
    } catch(e) {
      
    }

    serverCookie[key] = value;
  });

  if(req.url === '/' && cookies.length > 0) {

    Home.loadInitData(serverCookie.jwtToken)
    .then((result) => {
      
      processReactComponents(req, res, next, serverCookie, result);
    })
    .catch((err) => {

      console.log("server error: ", err);
      processReactComponents(req, res, next, serverCookie, err);
    });
  } else {
    processReactComponents(req, res, next, serverCookie, null);
  }
    
    
}

app.get('/', serverRenderer);
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.get('*', serverRenderer);

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
});