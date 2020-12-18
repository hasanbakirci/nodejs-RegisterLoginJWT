const express = require('express')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation,loginValidation} = require('../validation')
const createToken = require('./verifyToken')


// REGISTER
router.post('/register', async (req,res)=>{
    // Lets validate the data before we a user
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exist')
    //Create new user
    const user =  User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

//LOGIN
router.post('/login', async(req,res) =>{

    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    // Checking if the email exist
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or Password is wrong')
    //Password is Correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid Password')
    //Creat and assing a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
    console.log('token oluştu')
})

router.get('/',createToken, async(req,res) =>{
    try{
         User.findById(req.user._id).then(data =>{
             res.json(data.username)
         })
          
     }catch(err){
         res.json({message: err})
     }
})

module.exports = router