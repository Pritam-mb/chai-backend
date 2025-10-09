class apierror extends Error { // Error is a built-in class in JS which we are extending for our custom error 
    constructor(
        message ="something went wrong",
        statusCode,
        errors =[],
        statack =""
    ){
        super(message) // super is used to call the constructor of the parent class
        this.statusCode = statusCode
        this.errors = errors
        this.statack = statack
        this.success = false // since its an error
        this.data = null
        
    }
}