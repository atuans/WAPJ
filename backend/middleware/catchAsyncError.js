module.exports = (TheFunction) => (req,res,next) => {
    Promise.resolve(TheFunction(req,res,next)).catch(next);
}