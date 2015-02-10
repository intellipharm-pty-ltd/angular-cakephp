# angular-cakephp
An AngularJS data modelling framework that ties in with a CakePHP REST API


how data model works
--------------------------------

example:

 - UserModel extends BaseModel by calling BaseModel.extend(UserModel, config)
 - UserModel is then used as a service and has model methods like index, view, validate etc
 - A User active record is created by calling UserModel.new(data)
 - this returns a populated instance of UserModel


Future Plans
--------------------------------

functionality:

 - contain fields with default values (not connected to server Model or DB)
 - httpValidate (which calls server validation)
 - validate (which calls JS library validation)
 - CRUD api (that interfaces with server)
 - format data on response
 - format data before request

configuration:

 - server api address
 - validation library
 - methods
   - new (returns new instance of model)
 - CRUD api endpoints
   - index
   - add
   - edit
   - delete
 - action sequence config:
	eg.
	action_sequence_config = {
		'update': [
     			'validate',
     			'httpValidate',
     			'formatRequest'
		]
   	};
	then when calling model.update(data);
        will call:
	1) validate
	2) httpValidate
	3) formatRequest
	4) update

