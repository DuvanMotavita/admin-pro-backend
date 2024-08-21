const {response} = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async(req,res=response)=>{
    const {email,password} = req.body;
    try {
        //Validate email
        const userDb = await User.findOne({email});
        if(!userDb){
            return res.status(404).json({
                ok:false,
                msg: 'Email is not correct.'
            });
        }

        //Validate password
        const validPassword = bcrypt.compareSync(password,userDb.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password is not correct.'
            });
        }
        
        //Generate web token
        const token = await generateJWT(userDb.id);
        
        res.status(200).json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Something is wrong on login process'
        });
    }
}

module.exports = {login,};