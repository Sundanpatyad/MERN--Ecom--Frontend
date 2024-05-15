const { User } = require("../model/User")
const crypto = require('crypto');
const { sanitizeUser } = require("../services/comon");
var jwt = require('jsonwebtoken');









exports.createUser = async (req, res) => {
    try {
    
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
           
            const newUser = new User({
                ...req.body,
                password: hashedPassword , salt
            });
            const doc = await newUser.save()
            req.login(sanitizeUser(doc), (e)=>{
              if(err){
                res.status(401).json(err);
              }else{
                var token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json(token);
              }
            })
            // res.status(201).json(doc);
        });
    } catch (e) {
        return res.status(400).json({ error: 'Error in creating user' });
    }
};
exports.loginUser = async (req, res) => {
    // res.json(req.user);
    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json(req.user.token);

   
    // try {
    //     const user = await User.findOne({ email: req.body.email }).exec();
    //     if (!user) {
    //         return res.status(401).json({ message: 'No user with this email found' });
    //     } else if (user.password === req.body.password) {
    //         return res.status(200).json({ id: user.id, email: user.email, name: user.name , addresses:user.addresses , role:user.role});
    //     } else {
    //         return res.status(401).json({ message: 'Invalid password' });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return res.status(500).json({ error: 'Server error' });
    // }
}

exports.checkAuth = async (req, res) => {
    if(req.user){
        res.json(req.user);

    }else{
       res.sendStatus(401) 
    }
    console.log({status :"success" , user : req.user});
 
}
