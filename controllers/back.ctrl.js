let db = require('../db')


const adminGET = function(req,res) {

    if (req.session.logueado) {
        let sql = "SELECT * FROM productos"
        db.query(sql, function(err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
    
            res.render('admin', {
                titulo: "Panel de control",
                logueado: req.session.logueado,
                usuario: req.session.usuario,
                productos: data
            })
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }
    
   
}

// PRODUCTO GET
const agregarProductoGET = function(req,res) {

    if (req.session.logueado) {
        res.render("agregar-producto", {
            titulo: "Agregar producto",
            logueado: req.session.logueado,
            usuario: req.session.usuario,
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" }) 
    }


   
}
// PRODUCTO POST
const agregarProductoPOST = function(req,res) {
    console.log("DATOS FORM -->", req.body)
    const detalleProducto = req.body

    let sql = "INSERT INTO productos SET ?"
    db.query(sql, detalleProducto, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log("Producto agregado correctamente ")
       
    })
    res.render("agregar-producto", {
        mensaje: "Producto agregado correctamente",
        titulo: "Agregar producto"
    })
}

// EDITAR GET ID
const editarProductoGET = function(req,res) {

    if (req.session.logueado) {
        let id = req.params.id 
        let sql = "SELECT * FROM productos WHERE id = ?"
        db.query(sql, id, function(err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
    
            if (data == "") {
                res.status(404).render("404", {
                    titulo: "404 - Página no encontrada",
                    mensaje: `Producto con ID ${id} no existe`
                })
            } else {
                res.render('editar-producto', {
                    titulo: `Editando ${data[0].nombre}`,
                    producto: data[0],
                    logueado: req.session.logueado,
                    usuario: req.session.usuario,
                })
            }
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" }) 
    }

    
    

}

// EDITAR POST ID
const editarProductoPOST = function(req, res) {
    let id = req.params.id
    let detalleProducto = req.body

    let sql = "UPDATE productos SET ? WHERE id = ?"
    db.query(sql, [detalleProducto, id], function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro actualizado");
    })

    res.redirect("/admin")

}

// BORRAR ID
const borrarGET = function(req, res) {

    if (req.session.logueado) {
        let id = req.params.id

        let sql = "DELETE FROM productos WHERE id = ?"
        db.query(sql, id, function(err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log(data.affectedRows + " registro borrado");
        })
    
        res.redirect("/admin")
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" }) 
    }

   

}

const loginGET = function(req,res) {
    res.render('login')
}

const loginPOST = function(req,res) {
    
    let usuario = req.body.username 
    let clave = req.body.password

    if (usuario && clave) {
        let sql = "SELECT * FROM cuentas WHERE email = ? AND clave = ?"
        db.query(sql, [usuario,clave], function(err, data) {
            console.log("DATA", data)
            if (data.length) {
                // ok
                req.session.logueado = true;
                req.session.usuario = usuario
                res.redirect("/admin")
            } else {
                // error
                res.render("login", { 
                    titulo: "Login", 
                    error: "Nombre de usuario o contraseña incorrecto" 
                })
            }
    
        })
    } else {
        res.render("login", { 
            titulo: "Login", 
            error: "Por favor escribe un nombre de usuario y contraseña"
        })
    }

   
}

const logout = function(req, res) {


    req.session.destroy(function(err) {
        console.log(err)
    })

    let sql = "SELECT * FROM productos"
    db.query(sql, function(error, data) {
        if (error) res.send(`Ocurrió un error ${error.code}`)
        res.render('index', {
            titulo: "DARB MARKET",
            productos: data
        })
    })

}

module.exports = {
    adminGET,
    agregarProductoGET,
    agregarProductoPOST,
    editarProductoGET,
    editarProductoPOST,
    borrarGET,
    loginGET,
    loginPOST,
    logout
}