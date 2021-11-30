Parse.Cloud.define('save-logs', async (request) => {
    const Log = Parse.Object.extend("Log");
    const log = new Log();
    const keys = Object.keys(request.params);
    keys.forEach(key => {
        log.set(key, request.params[key]);
    });
    const urlSplit = request.params.url.split('com');
    log.set('baseUrl', urlSplit[0] + 'com');
    log.set('endPoint', urlSplit[1].split('?')[0]);
    if (request.params.error) {
        log.set('status', request.params.error.status);
    } else {
        log.set('status', 200);
    }
    if (urlSplit[0].indexOf('-qa') >= 0) {
        log.set('env', 'qa');
    }
    else if (urlSplit[0].indexOf('-dev') >= 0 || urlSplit[0].indexOf('-development') >= 0) {
        log.set('env', 'dev');
    }
    else if (urlSplit[0].indexOf('-staging') >= 0) {
        log.set('env', 'staging');
    } else {
        log.set('env', 'prod');
    }
    return await log.save(null, { useMasterKey: true });
});