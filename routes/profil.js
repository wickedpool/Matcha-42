var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	fileUpload = require('express-fileupload'),
	router = express.Router()

router.use(fileUpload())

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM user WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			connect.query("SELECT * FROM tag WHERE login = ?", [req.session.login], (err1, rows1, result1) => {
				if (err1) console.log(err1)
				if (rows[0].description)
					if (rows[0].mainpic)
						if (rows1) {
							connect.query("UPDATE popularity SET famous = famous + 5 WHERE login = ?", [req.session.login], (err) => {
								if (err) console.log(err)
								req.session.ok = true
								req.session.mainpic = rows[0].mainpic
					})
				}
			})
		})
		connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			res.locals.tag = rows
			connect.query("SELECT description FROM user WHERE login = ?", [req.session.login], (err, rows1, result) => {
				if (err) console.log(err)
				connect.query("SELECT mainpic FROM user WHERE login = ?", [req.session.login], (err, rows2, result) => {
					if (err) console.log(err)
					connect.query("SELECT pic1, pic2, pic3, pic4 FROM user WHERE login = ?", [req.session.login], (err, rows3, result) => {
					if (rows2)
						res.render('profil', { descri: rows1[0].description, mainpic: rows2[0].mainpic, pic1: rows3[0].pic1, pic2: rows3[0].pic2, pic3: rows3[0].pic3, pic4: rows3[0].pic4})
					else
						res.render('profil', { descri: rows1[0].description})
				})
				})
			})
		})
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var tag = req.body.tag	
		if (tag) {
			if (tag.length > 15) {
				req.session.error = 'Le tag est trop long'
				res.redirect('/profil')
			} else {
					connect.query("INSERT INTO tag SET login = ?, tag = ?", [req.session.login, tag], (err) => {
					if (err) console.log(err)
					req.session.success = 'Votre tag a bien ete ajoute'	
					req.session.info = 'Vous pouvez en ajouter autant que vous voulez'
					res.redirect('/profil')
				})
			} 	
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

router.post('/des', function(req, res, next) {
	RegexMore = /[a-zA-Z\,\.]/
	if (req.session && req.session.login) {
		var descri = req.body.descri
		if (descri) {
			if (descri.length < 10) {
				req.session.error = 'Le champ rempli est trop court'
				res.redirect('/profil')
			} else if (descri.length > 200) {
				req.session.error = 'Le champ rempli est trop long (200chars)'
				res.redirect('/profil')
			} else if (descri.search(RegexMore) == -1) {
				req.session.error = 'La description ne peux pas contenir de caracteres spéciaux mise a part une virgule " , " et un point " . "'
				res.redirect('/profil')
			} else {
				connect.query("UPDATE user SET description = ? WHERE login = ?", [descri, req.session.login], (err) => {
					if (err) console.log(err)
					res.locals.descri = descri
					req.session.success = 'Votre description a ete mise a jour'
					res.redirect('/profil')
				})
			}
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

router.post('/upload/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id == 1 || req.params.id == 2 || req.params.id == 3 || req.params.id == 4 || req.params.id == 5) {
			if (!req.files) {
				req.session.error = 'Pas d\'image d\'upload'
				res.redirect('/profil')
			} else {
				var file = req.files.uploaded_image
				var img_name = file.name

				if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png") {
					file.mv('public/images/upload_images/'+file.name, function(err) {
						if (err) {
							req.session.error = 'Une erreur est survenue'
							res.redirect('/profil')
						}
						if (req.params.id == 1) {
							connect.query("UPDATE user SET mainpic = ? WHERE login = ?", [img_name, req.session.login], (err) => {
								if (err) console.log(err)
								req.session.success = "Votre image a bien ete upload"
								res.redirect('/profil')
							})
						} else if (req.params.id == 2) {
							connect.query("UPDATE user SET pic1 = ? WHERE login = ?", [img_name, req.session.login], (err) => {
								if (err) console.log(err)
								req.session.success = "Votre image a bien ete upload"
								res.redirect('/profil')
							})
						} else if (req.params.id == 3) {
							connect.query("UPDATE user SET pic2 = ? WHERE login = ?", [img_name, req.session.login], (err) => {
								if (err) console.log(err)
								req.session.success = "Votre image a bien ete upload"
								res.redirect('/profil')
							})
						} else if (req.params.id == 4) {
							connect.query("UPDATE user SET pic3 = ? WHERE login = ?", [img_name, req.session.login], (err) => {
								if (err) console.log(err)
								req.session.success = "Votre image a bien ete upload"
								res.redirect('/profil')
							})
						} else if (req.params.id == 5) {
							connect.query("UPDATE user SET pic4 = ? WHERE login = ?", [img_name, req.session.login], (err) => {
								if (err) console.log(err)
								req.session.success = "Votre image a bien ete upload"
								res.redirect('/profil')
							})
						} else {
							req.session.error = 'Un probleme est survenu!'
							res.redirect('/profil')
						}
					})
				} else {
					req.session.error = 'Le format ne correspond pas'
					req.session.info = "Les formats pris en compte sont: .png, .jpg"
					res.redirect('/profil')
				}
			}
		} else {
			req.session.error = 'Un probleme est survenu'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

router.post('/base', function(req, res, next) {
	if (req.session && req.session.login) {
		var name = req.body.name,
			lastname = req.body.lastname,
			RegexBoth = /[a-zA-Z]/
		if (name) {
			if (name.search(RegexBoth)) {
				req.session.error = 'Votre nom ne peux pas contenir de caracteres autres que l\'alphabet meme si vous avez un nom composé!'
				res.redirect('/profil')
			} else if (name.length > 18) {
				req.session.error = 'Votre nom est trop long!'
				res.redirect('/profil')
			} else {
				connect.query('UPDATE user SET name = ? where login = ?', [name, req.session.login], (err) => {
					if (err) console.log(err)
					req.session.name = name
					req.session.success = 'Votre prénom a bien été changé!'
					res.redirect('/profil')
				})
			}
		}
		if (lastname) {
			if (lastname.search(RegexBoth)) {
				req.session.error = 'Votre nom ne peux pas contenir de caracteres autres que l\'alphabet meme si vous avez un nom composé!'
				res.redirect('/profil')
			} else if (name.length > 18) {
				req.session.error = 'Votre nom est trop long!'
				res.redirect('/profil')
			} else {
				connect.query('UPDATE user SET lastname = ? where login = ?', [lastname, req.session.login], (err) => {
					if (err) console.log(err)
					req.session.lastname = lastname
					req.session.success = 'Votre nom a bien été changé!'
					res.redirect('/profil')
				})
			}
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

module.exports = router
