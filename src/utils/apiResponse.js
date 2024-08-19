class apiResponse {
    constructor(statusCode , message , data, success="success"){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode <400
    }
}