
const { Router } = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { Users } = require('../db.js');
const router = Router();
const { v4: uuidv4 } = require("uuid");

// const passport1 = 
require("../passportLogin.js");

const  transporter  = require('../controllers/emailLogin.js');



const succesLoginUrl = 'http://localhost:3000/home';


// router.use(passport.initialize());
// router.use(passport.session());


router.get('/login', (req, res) => res.send('Usuario Creado Satisfactoriamente'));
router.get('/fail',(req, res) => res.send("No se pudo loggear"));


// router.get('/register', (req, res) => res.send('Register'));

router.post('/register', async function  (req, res) {
    const id = uuidv4();

    let data = {...req.body, id};
    let errors = []
    if(!data.fullName || !data.email || !data.password){
        errors.push({message: "Por favor llene todos los campos"});
    }
    try {

        const userDb = await Users.findOne({where :{ email : data.email}});
        if(userDb){
            res.json("Ya existe un usuario con ese email")
        }
        else{
            if(data.email === "tukiteckpf@gmail.com"){
                const createdUser = await Users.create({
                    fullName: data.fullName,
                    email: data.email,
                    password:data.password,
                    isAdmin: true
                });
                
            } else {
                const createdUser = await Users.create({
                    fullName: data.fullName,
                    email: data.email,
                    password:data.password,
                    isAdmin: data.isAdmin
            });
        }

            await transporter.sendMail({
                from: "matiascostilla96@gmail.com",
                to: data.email,
                subject: "Inicio Sesion",
                html: `
                <b> Muchas gracias por loggearte en Tukiteck!!
                `
            });
            //return res.json({message: 'Usuario CREADO'})
            return res.redirect('/login');
        }   
        
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/login',(req, res, next) =>{   
    passport.authenticate('local',{
        successRedirect: succesLoginUrl,
        failureRedirect: '/fail'
    })(req, res, next)
})
 
router.get("/logout", (req, res) => {
    req.session = null;
    req.logout();
    res.redirect("/deslog");
  });

// router.get("/logout", (req, res) => {
//     req.session = null;
//     req.logout();
//     res.redirect("/deslog");
//   });

  


 
module.exports =  router