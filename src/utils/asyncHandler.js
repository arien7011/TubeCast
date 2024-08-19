/**
 * A higher-order function that wraps around a request handler function and returns a new function.
 * This new function catches any errors thrown by the original request handler and passes them to the next middleware function.
 *
 * @param {Function} requestHandler - The original request handler function to be wrapped.
 * @returns {Function} - A new function that handles the request and response, and catches any errors.
 *
 * @example
 * const asyncHandler = require('./asyncHandler');
 *
 * const myRequestHandler = async (req, res, next) => {
 *   // Your request handling logic here
 * };
 *
 * const wrappedRequestHandler = asyncHandler(myRequestHandler);
 *
 * app.use(wrappedRequestHandler);
 */
const asyncHandler = (requestHandler) => {
    (req,res,next) =>{
     Promise.resolve(requestHandler(req,res,next))
     .catch((err) => next(err))
    }
 }
 
 export  { asyncHandler }
 
 /*
 const asyncHandlerFn = (fn) => async (req,res,next) => {
       try{
        await fn(req,res,next);
       } catch(error){
         res.status(error.code || 500).json({
             success: false,
             message: `${error.message}`,
         })
       }
 } 
 
 */
