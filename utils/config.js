require ('dotenv').config();
const MONGODB_URI=process.env.MONGODB_URI;
const ENV=process.env.ENV;
const HOST=process.env.HOST;
const PORT=process.env.PORT;

module.exports = {
    MONGODB_URI,
    ENV,
    HOST,
    PORT
}
