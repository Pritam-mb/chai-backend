class apiresponse {
    constructor(message="sucess",statuscode,data){
        this.message= message,
        this.data=data,
        this.statuscode=statuscode,
        this.success= statuscode < 400
    }
}

export {apiresponse}