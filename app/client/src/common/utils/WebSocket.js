import common from '../index.js'

export default (function () {
    var temp = {
        data_load: {},
        optimize: {},
        export: {},
        progress: {}
    }

    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    if (Array.isArray(target[key]) && Array.isArray(source[key])) {
                        target[key] = target[key].concat(source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
        }

        return mergeDeep(target, ...sources);
    }
    let socketURL = "ws://localhost:59999/socket.mrx"
    var connect = function () {
        var timeoutId;
        window.socket = new WebSocket(socketURL);

        window.socket.onopen = (eventArgs) => {
            console.log(eventArgs);
            common.store.setProperty('app.message', 'Connect to Machine Learing Process!')
        }

        window.socket.onclose = (eventArgs) => {
            console.log(eventArgs);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(connect, 1500);
            common.store.setProperty('app.message', 'Not Ready Machine Learning Process!');
        }

        window.socket.onerror = (eventArgs) => {

        };

        window.socket.onmessage = (event) => {
            var obj = JSON.parse(event.data.replace(/NaN/g, 'null'));
            mergeDeep(temp[obj.name], obj.response);
            if (obj.end) {
                common.store.setProperty('socket.' + obj.name, temp[obj.name]);
                temp[obj.name] = {};
                common.store.setProperty('app.loading', false);
            } else {
                common.store.setProperty('app.loading', true);
            }
        };
    }
    // connect();
})();