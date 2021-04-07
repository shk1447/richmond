
export default (function () {
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
    let socketURL = "ws://localhost:8080/sock"
    var connect = function () {
        var timeoutId;
        window.socket = new WebSocket(socketURL);
        window.socket.binaryType = 'arraybuffer'

        window.socket.onopen = (eventArgs) => {
            console.log(eventArgs);
            window.startTime = new Date().getTime();
        }

        window.socket.onclose = (eventArgs) => {
            console.log(eventArgs);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(connect, 1500);
        }

        window.socket.onerror = (eventArgs) => {

        };
        
        window.socket.onmessage = (event) => {
            
        };
    }
    // connect();
})();