// to login into app

export const login= async (req, res)=>{

    const {email, password} = req.body;

    const user= await User.findOne({email});

    if(!user){
        return res.send("User not found")
    }

    if(User.password !== password){
        return res.send("Invalid password")
    }

    res.send("Login successful");
}