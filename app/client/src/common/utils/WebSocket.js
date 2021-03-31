import { Buffer } from 'buffer';

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
        var stat = {
            length: 'uint',
            min: 'uint',
            q1: 'uint',
            median: 'uint',
            q3: 'uint',
            max: 'uint',
            total: 'uint',
            avg: 'float'
        }
        var schema = new TypedJson({
            data: [{
                date: 'date',
                stats: {
                    a: stat,
                    b: stat,
                    c: stat,
                    d: stat,
                    e: stat
                }
            }]
        })
        var aaa = [];
        window.socket.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                var buffer = Buffer.from(event.data);
                var test = schema.decode(buffer);
                aaa.push(test)
                if (aaa.length == 100) {
                    window.endTime = new Date().getTime();
                    console.log((window.endTime - window.startTime) + 'ms (binary)')
                }
            } else {
                var test = JSON.parse(event.data);
                aaa.push(test)
                if (aaa.length == 100) {
                    window.endTime = new Date().getTime();
                    console.log((window.endTime - window.startTime) + 'ms (json)')
                }
            }
            // if(event.data instanceof Blob) {
            //     count++;
            //     if(count === 10000) {
            //         console.log('aaaa');
            //     }
            //     var schema = new TypedJson.Type({id:'uint'})

            //     // var buffer = arrayBufferToBuffer(event.data)
            //     // var test = schema.decode(buffer);
            //     // if(test.id == 0) {
            //     //     window.startTime = new Date().getTime();
            //     // } else if (test.id == 9999) {
            //     //     window.endTime = new Date().getTime();
            //     //     console.log((window.endTime - window.startTime) + 'ms (binary)')
            //     // }

            // } else {
            //     _count++;
            //     if(_count === 10000) {
            //         console.log('bbbb');
            //     }
            //     // var test = JSON.parse(event.data);
            //     // if(test.id == 0) {
            //     //     window._startTime = new Date().getTime();
            //     // } else if (test.id == 9999) {
            //     //     window._endTime = new Date().getTime();
            //     //     console.log((window._endTime - window._startTime) + 'ms (json)')
            //     // }
            //}
        };
    }
    connect();
})();