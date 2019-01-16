import React from 'react';
import { renderToString } from 'react-dom/server';
import ssr from '@audentio/ssr-toolkit';
import Helmet from 'react-helmet';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router';

import App from '../src/app';
import createApolloLink from '../src/apollo-link'; // create link with your middlewares

// Load EJS template
const template = fs.readFileSync(path.join(__dirname, 'template.ejs'), 'utf8');

ssr({
    port: 5000,

    // simple csp that blocks external JS script tags
    // excluding any script tags that have correct nonce (res.locals.nonce)
    helmetConfig: {
        contentSecurityPolicy: {
            scriptSrc: [
                "'self'",

                // Execute script tags that have this nonce (unique for each request)
                // allows us to run our inline scripts and block others
                (req, res) => "'nonce-" + res.locals.nonce + "'",
            ],
        },
    },
    renderApp: async (req, res) => {
        // react-router passes context as prop
        // you can set context.status somewhere in your app and then use it here
        // useful for setting HTTP status, for example
        const context = {};
        const client = new ApolloClient({
            ssrMode: true,
            cache: new InMemoryCache(),
            link: createApolloLink(),
        });

        const tree = (
            <ApolloProvider client={client}>
                <StaticRouter location={req.url} context={context}>
                    <App /> {/* App can use <Route>, <Query> etc */}
                </StaticRouter>
            </ApolloProvider>
        );

        try {
            // Wait for Apollo to fetch data
            await getDataFromTree(tree);
        } catch (e) {
            // do nothing
            // errors will be handled by the query component
            // this allows us to continue like client would
        }

        const rendered = renderToString(tree);
        const head = Helmet.rewind();

        // Extract Apollo client state
        // You can now e __APOLO_STATE_
        const initialState = client.cache.extract();

        // we use EJS here to render html
        // handlebars is also a good choice
        const html = ejs.render(template, {
            rendered,
            initialState,
            head,
            nonce: res.locals.nonce,
        });

        return { html, context };
    },

    // Any error in the middlewares or in your renderApp promise
    // wil be caught by ssr-toolkit and this function will be used to render an error page for the request
    renderError: (req, error) => {
        // you can make an EJS template for errors
        // or even import an errorscreen component and render that using renderToString
        // it's entirely up to you

        return '<html><body>Error!</body></html>';
    },
});
