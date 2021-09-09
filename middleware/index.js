module.exports = (req, res, next) => {

    console.log('for now I just log this message');
    console.log(req.body);   // the parsed body from the client
    console.log(res.resObj); // the response object that will be sent

    next(req, res);

};