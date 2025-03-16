class ApiError extends Error {
  constructor(
    statusCode,
    errors = [],
    stack = "",
    messsage = "Something went wrong",
  ) {
    super(messsage),
    this.statusCode = statusCode,
    this.data = null,
    this.success = false,
    this.errors = errors;
    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError };