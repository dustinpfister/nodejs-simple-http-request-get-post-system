# Simple http request get post system

Starting with my simple static sever script example, the goal with this simple nodejs project is to just make a slighly more advanced version of the static server file that will respond to post requests. This file called at /node/static-server-post can then be called with node and when doing so it is possible to set a root folder, public folder, and port number by way of arguments. The script will also look for a middleware folder off of the root folder that should contain and index.js file that will be called before sending each post request response. So then the public folder can be changed to define what the static client system should be, and the middleware folder can be changed to define what should be done with post requests.

## Very basic middleware example

The index.js file in the midleware folder should export a single function. The arguments of this function will contain references to the request object, response object, and a next function that should be called when the post request has been processed. There should be a req.body object that contains the data that was send from the client system, and it is the res.resObj that should be updated with any data that should be sent back to the client.

So a very basic example of an external middleware at /middleware/index.js would lok like this:

```js
module.exports = (req, res, next) => {
    console.log('for now I just log this message');
    console.log(req.body);   // the parsed body from the client
    console.log(res.resObj); // the response object that will be sent
    next(req, res);
};
```

It is also possible to just not have a middileware folder at all, but then what I have is just a static sever that is more complex than it needs to be.