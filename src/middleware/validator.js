export async function adminAuthValidator (req, res, next){
    const {email, password} = req.body;
    let errors=[]
    if(typeof email != "string" || email.length == 0 || !email.includes("@")){
        errors.push({email: "Email is required or is not in the right format"})
    }

    if(typeof password != "string" || password.length < 4){
        errors.push({password: "Password is required or is not in the right format"})
    }
    if (errors.length > 0){
        res.status(400).json(errors)
    }
    next()
}