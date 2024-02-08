import User from "../models/User.js";
import Service from "../models/Service.js";
import Device from "../models/Device.js";
import QuickChart from "quickchart-js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { generateToken, generateJwt, decodeJwt } from "../lib/token.js";

const index = (request, response ) => {
    response.render("auth/home", {
        page:"Welcome"
    })
}

const formLogin = (req, res) => {
    res.render("auth/login",{
        page:"Iniciar sesión"
    })
}

const formPassRecovery = (req, res) => {
    res.render('auth/password-update')
}

const authenticateUser = async (request, response) => {
    // Verificar los campos de correo y contraseña
    await check("email").notEmpty().withMessage("El correo es requerido").isEmail().withMessage("Ese no es un formato válido").run(request)
    await check("password").notEmpty().withMessage("La contraseña es requerida").isLength({ max: 20, min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres").run(request)

    // En caso de errores, mostrarlos en pantalla
    let resultValidation = validationResult(request);
    if (resultValidation.isEmpty()) {
        const { email, password } = request.body;
        
        const userExists = await User.findOne({where: { email } })

        if (!userExists) {
            console.log("El usuario no existe")
            response.render("auth/login.pug", {
                page: "Login",
                errors: [{ msg: `El usuario asociado a: ${email} no fue encontrado` }],
                user: {
                    email
                }
            })
        } else {
            console.log("El usuario existe")
            if(userExists.type === 'Administrador'){
                console.log(`El usuario: ${email} Existe y está autenticado`);
                // Generar el token de acceso
                console.log(userExists.type)
                const token = generateJwt(userExists.id);
                if (!response.headersSent) {
                    response.cookie('_token', token, {
                        httpOnly: true,
                    }).redirect('/admin-home');
                }
            } else if (!userExists.verified) {
                console.log("Existe, pero no está verificado");

                response.render("auth/login.pug", {
                    page: "Login",
                    errors: [{ msg: `El usuario asociado a: ${email} fue encontrado pero no está verificado` }],
                    user: {
                        email
                    }
                })
            } else {
                if (!userExists.verifyPassword(password)) {
                    response.render("auth/login.pug", {
                        page: "Login",
                        errors: [{ msg: `Usuario y contraseña no coinciden` }],
                        user: {
                            email
                        }
                    })
                } else {
                    if(userExists.type === 'Usuario'){
                        console.log(`El usuario: ${email} Existe y está autenticado`);
                        // Generar el token de acceso
                        console.log(userExists.type)
                        const token = generateJwt(userExists.id);
                        if (!response.headersSent) {
                            response.cookie('_token', token, {
                                httpOnly: true,
                            }).redirect('/home');
                        }
    
                    } else if(userExists.type === 'Administrador'){
                        console.log(`El usuario: ${email} Existe y está autenticado`);
                        // Generar el token de acceso
                        console.log(userExists.type)
                        const token = generateJwt(userExists.id);
                        if (!response.headersSent) {
                            response.cookie('_token', token, {
                                httpOnly: true,
                            }).redirect('/admin-home');
                        }
                    }
                }
            }
        }

    } else {
        response.render("auth/login.pug", {
            page: "Login",
            errors: resultValidation.array(),
            user: {
                email: request.body.email
            }
        })
    }

    return 0;
}

const userHome = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    
    const userData = await User.findOne({ where: { id: userID } });
    
    if (userData.type !== "Usuario") {
        return res.redirect('login');
    }

    const servicesData = await Service.findAll({ where: { userID }, include: Device });
    
    res.render('user/userhome', {
        user: userData.name,
        servicesData,
    });
};

const logout = (req, res) => {
    res.clearCookie('_token');
    res.redirect('/login');
}

const confirmAccount = async (req, res) => {
    const tokenReceived = req.params.token
    const userOwner = await User.findOne({
        where: {
            token: tokenReceived
        }
    })
    if (!userOwner) {

        console.log("El token no existe")
        res.render('auth/confirm-account', {
            page: 'Verificación de cuenta',
            error: true,
            msg: 'Lo sentimos, el token no existe o ya ha expirado',
            button: 'Volver al inicio de sesión'

        })
    }
    else {
        console.log("El token existe");
        userOwner.token = null;
        userOwner.verified = true;
        await userOwner.save();
        res.render('auth/confirm-account', {
            page: 'Verificación de cuenta.',
            error: false,
            msg: 'Tu cuenta ha sido activada correctamente.',
            button: 'Ahora puedes iniciar sesión',
        });
    }
}

export { index, formLogin, formPassRecovery, userHome, authenticateUser, logout, confirmAccount };
