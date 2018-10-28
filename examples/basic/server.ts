import SSR from '@audentio/ssr-toolkit';

/**
 * This example uses async-await 
 * but it easily can be written as a promise
 * just to remember to alaways resolve { html, context }
 */
async function renderApp(req, res) {
    return {
        html: '<html><body>Super simple app</body></html>',
        context: { status: 200 },
    };
}

SSR({
    renderApp,
    renderError: (error) => 'My custom error page',
});
