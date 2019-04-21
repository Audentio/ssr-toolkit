exports.googleAnalytics = directives => {
    directives.imgSrc.push('https://www.google-analytics.com/');
    directives.scriptSrc.push('https://www.google-analytics.com/');
    directives.connectSrc.push('https://www.google-analytics.com/');
};

// https://www.intercom.com/help/configure-intercom-for-your-product-or-site/staying-secure/using-intercom-with-content-security-policy
exports.intercom = directives => {
    directives.scriptSrc.push('https://*.intercom.io', 'https://js.intercomcdn.com');
    directives.connectSrc.push(
        'https://*.intercom.io',
        'wss://*.intercom.io',
        'https://uploads.intercomcdn.com',
        'https://uploads.intercomusercontent.com'
    );
    directives.frameSrc.push(
        'https://share.intercom.io',
        'https://intercom-sheets.com',
        'https://www.youtube.com',
        'https://player.vimeo.com'
    );
    directives.formAction.push('https://intercom.help');
    directives.fontSrc.push('https://js.intercomcdn.com');
    directives.mediaSrc.push('https://js.intercomcdn.com');
    directives.imgSrc.push(
        'https://*.intercomcdn.com',
        'https://intercom.help',
        'https://uploads.intercomusercontent.com',
        'https://static.intercomassets.com'
    );
};
