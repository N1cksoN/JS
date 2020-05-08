import { Router, } from 'express';
import { knex, models, } from '../lib/db';
import multer from 'multer';
import ah from 'express-async-handler';
import validator from 'validator';
import fs from 'fs';
import path from 'path';

const router = Router({
	caseSensitive: true,
	mergeParams: true,
	strict: true,	
});
const upload = multer({dest:'./tmp'});


router.get('/user/me', async(req, res) => {
	if(req.user) {
		res.render('user', {user: req.user});
	} else {
		res.redirect('/login');
	}
});

router.get('/user/:userId', async (req, res) => {
	const { userId = 0, } = req?.params ?? {};
	const user = await models.user.query().findById(+userId);
	console.log('user', user);
	if (user) {
		res.render('user', { user: user.toJSON(), });
	} else {
		res.redirect('/user/me');
	}
});

router.get('/user/:userId/edit', async (req, res) => {
	const { userId = 0, } = req?.params ?? {};
	const user = await models.user.query().findById(+userId);
	if (user) {
		res.render('user-form', { user: user.toJSON(), });
	} else {
		res.redirect('/user/me');
	}
});

router.post('/user/:userId/edit', 
	upload.fields([
		{ name: 'login', maxCount: 1, },
		{ name: 'password', maxCount: 1, },
		{ name: 'password2', maxCount: 1, },
		{ name: 'avatar', maxCount: 64, },
	]),
	async (req, res) => {
		const { userId = 0, } = req?.params ?? {};
		const { login, password, password2, } = req?.body ?? {};
		let { avatar, } = req?.files ?? {};
		if (!login || !password || password != password2) {
			res.redirect('/user/${ userId }/edit');
		// } else if (userId != req?.user?.id){
		// 	res.redirect('/user/me');
		} else if (avatar?.length && avatar[0]?.size) {
			avatar = avatar?.[0]?.filename;
			try {
				await (async (from, to) => new Promise((resolve, reject) => {
					fs.rename(from, to, (error) => {
						error ? reject(error) : resolve();
					});
				}))(`./tmp/${ avatar }`, `./asset/avatar/${ avatar }`);
				await models.user.query().findById(+userId).patch({ login, password, avatar, });
			} catch (error) { 
				console.log(error);
			}
			res.redirect('/user/${ userId }/edit');
		} else {
			await models.user.query().findById(+userId).patch({ login, password, });
			res.redirect('/user/${ userId }/edit');
		}
		console.log(userId, login, password, password2, avatar);
		res.end();
	});



export default router;