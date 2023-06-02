const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// user schema import and connect
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello world from auth js ");
});

// promise type
// router.post("/register" , (req, res)=>{
//     const {name , email , phone, work , password , cpassword} = req.body;

//     if(!name || !email || !phone|| !work || !password || !cpassword){
//         return(
//             res.status(422).json({error : "Please Fill all required filed."})
//         )
//     }

//     User.findOne({email : email})
//         .then((userExit)=>{
//             if(userExit){
//                 return(
//                     res.status(422).json({error : "User Already Exi"})
//                 )
//             }

//             const user = new User({name, email, phone, work , password, cpassword});
//             user.save().then(()=>{
//                 res.status(201).json({message : "Registration Successfull!"})
//             }).catch(()=>{
//                 res.status(500).json({error : "Registration Failed!"});
//             })
//         })
//         .catch((err)=>{
//             res.status(500).send(err)
//         })
// })

// create account async type
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please Fill all required filed." });
  }
  try {
    const userExit = await User.findOne({ email: email });

    if (userExit) {
      return res.status(422).json({ error: "User Already Exit" });
    }
    // password hashed
    const heasedPassword = await bcrypt.hash(password, 10);
    // confirm password hashed
    const conHeasedPassword = await bcrypt.hash(cpassword, 10);

    const user = new User({
      name,
      email,
      phone,
      work,
      password: heasedPassword,
      cpassword: conHeasedPassword,
    });
    await user.save();
    res.status(200).json({ message: "Registration Successfull!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    let token;

    const { email, password } = req.body;

    if (!email || !password) {
      res.status.json({ error: "Please Filled the data" });
    }

    const userLogin = await User.findOne({ email: email });
    const heasedPassword = await bcrypt.hash(password, 10);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie('jwetoken', token , {
        expires : new Date(Date.now() + 25892000000),
        httpOnly : true

      });

      if (!isMatch) {
        return res.status(500).json({ error: "Invalid Command pass" });
      } else {
        return res.status(200).json({ message: "Login Successfull" });
      }
    } else {
      return res.status(500).json({ error: "Invalid Command" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
