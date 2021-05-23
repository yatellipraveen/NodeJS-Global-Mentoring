//custom logger
export const logger = function(req,res, next){
    console.log(" Service : " , req?.url);
    console.log(" query params : " , req?.query);
    console.log(" request body : " , req?.body);
    next();
}