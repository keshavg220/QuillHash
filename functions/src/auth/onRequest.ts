//Function to set headers
export const setHeaders = function (req: any, res: any) {

    // Set CORS headers for preflight requests
    // Allows GETs from origin https://mydomain.com with Authorization header

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', '*');
        //res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }
    return res;
}
