module.exports = (req, res, next) => {

    console.log('for now I just log this message');

    next(req, res);

};