class ApiResponse{
    constructor(data,statuscode,message="Success!"){
        this.data = data,
        this.statuscode = statuscode,
        this.message = message,
        this.success = statuscode > 200 && statuscode<300
    }
}
export {ApiResponse};