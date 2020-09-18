export const httpRequestPromise = function(data: any, method: any) 
    {
    return new Promise((resolve, reject) => {
        const http = require("http");
        const postData = data.postData || {}
        const options = data.options

        const req = http.request(options, function (res: any) {
            const chunks: any = [];

            res.on("data", function (chunk: any) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks)
                resolve(body.toString())
            });

            res.on('error', (error: any) => {
                console.log(error)
                reject(error);
            });
        });

        if(method === 'POST')
        {
            const postDataString = JSON.stringify(postData)
            console.log("postDataString : "+postDataString)
            req.write(postDataString);
        }

        req.end();
    });
}

export const httpsRequestPromise = function(data: any, method: any) 
    {
    return new Promise((resolve, reject) => {
        const http = require('follow-redirects').http;
        const postData = data.postData || {}
        const options = data.options

        const req = http.request(options, function (res: any) {
            const chunks: any = [];

            res.on("data", function (chunk: any) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks)
                resolve(body.toString())
            });

            res.on('error', (error: any) => {
                console.log(error)
                reject(error);
            });
        });

        if(method === 'POST')
        {
            const postDataString = JSON.stringify(postData)
            console.log("postDataString : "+postDataString)
            req.write(postDataString);
        }

        req.end();
    });
}