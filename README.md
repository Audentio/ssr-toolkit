# SSR toolkit

SSR for even a slightly complex webapp is not trivial. This project aims to make that process a little simpler, providing you with an express server which you can use to serve your app with minimal configuration.

Here's the most basic example

```
const ssr = require('@audentio/ssr-toolkit');

ssr({
    renderApp: async (req, res) => {
        return {
            html: '<html><body>Hello world!</body></html>',
            context: { status: 200 },
        };
    },
});
```

You've just made a server running on port 8080 (default) that sends "Hello world!" for every route!
ssr-toolkit assumes nothing about your app's stack. You can use any framework that lets you render to HTML

**See more in-depth examples in the examples dir**