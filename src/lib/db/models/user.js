const {Model, } = require('objection');
class User extends Model{
	static get tableName(){ return 'user'; };
	static get idColumn(){ return 'userId'; };
	static get jsonSchema(){ 
		return {
			type: 'object',
			required: ['login', 'password'], 
			properties: {
				userId: {
					type: 'integer',
				},
				login: {
					type: 'string',
					minLength: 1,
					maxLength: 32,
				},
				password : {
					type: 'string',
					minLength: 1,
					maxLength: 32,
				},
			},
		};
	}
	toJSON(){
		return {
			id: this.userId,
			login: this.login,
			password: this.password,			
		};
	}
};

module.exports = {user: User,};