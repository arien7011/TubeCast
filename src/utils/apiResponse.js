/**
 * Represents an API response with status code, message, and data.
 *
 * @class apiResponse
 * @constructor
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {string} [message="Success"] - A message describing the response. Default is "Success".
 * @param {any} [data] - The data returned by the API.
 *
 * @property {number} statusCode - The HTTP status code of the response.
 * @property {string} message - A message describing the response.
 * @property {any} data - The data returned by the API.
 * @property {boolean} success - A boolean indicating whether the response is successful (status code less than 400).
 */
class apiResponse {
    constructor(statusCode,message="Success",data){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode <400
    }
}