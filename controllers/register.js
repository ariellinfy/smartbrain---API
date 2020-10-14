
const handleRegister = (req,res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if(!email || !name || !password){
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    	console.log(hash);
	// });
	// database.users.push({
	// 	id:'126',
	// 	name: name,
	// 	email: email,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	db.transaction(trx=>{
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user =>{
				res.json(user[0]); //return an object instead of an array
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to join'))
	}


module.exports = {
	handleRegister: handleRegister
};