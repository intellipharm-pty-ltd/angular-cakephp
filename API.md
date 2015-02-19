## Class APIs

### Model

#### properties

 - active_record_class
 - config

#### methods

 - extend
 - new
 - index
 - view
 - add
 - edit
 - delete
 - validate
 - api

##### extend

Extends BaseModel

@param model (the model that will extend BaseModel)
@param active_record (The active record class that will be used when creating new instance)
@returns model instance

##### new

Creates a new instance of the model's active record class

@param object data (data used to create a new active record)
@returns object (new active record | empty object)

##### index

makes GET HTTP call to API
     
@param object params (a list of url parameters to pass with the HTTP request)
@returns promise HttpResponseService.handleViewResponse

##### view

makes GET HTTP call to API with id

@param id (unique id of the record you want to view)
@param object params (a list of url parameters to pass with the HTTP request)
@returns promise HttpResponseService.handleViewResponse

##### add

makes POST HTTP call to API

@param object data (post data to be passed with HTTP request
@returns promise HttpResponseService.handleAddResponse

##### edit

makes PUT HTTP call to API with id

@param object data (data to be passed with HTTP PUT request)
@returns promise HttpResponseService.handleEditResponse

##### delete

makes DELETE HTTP call to API with id

@param id (unique id of the record you want to delete)
@returns promise HttpResponseService.handleDeleteResponse

##### validate

Makes a POST HTTP call to API validation resource

@param object active_record (active record to validate)
@param array fields (array of fields to validate)
@returns promise HttpResponseService.handleValidateResponse

##### api

Makes HTTP call to specified API endpoint

@param string endpoint (endpoint to call)
@param string http_method (HTTP method to use for call) (default: GET)
@param object url_params (url params to pass with call)
@param object post_params (post params to pass with call)
@returns promise

## Active Record

### Model

#### properties

...

#### methods

 - extend
 - save
 - new
 - delete
 - getClassName
 - virtualField
 - virtualFieldUpdate
 
##### extend

Extends BaseActiveRecord

@param model (the model being used to call this method)
@param active_record (The active record class that will extend BaseActiveRecord)
@returns active record instance

##### save

Relay call to the model's edit method

@returns promise

##### new

Relay call to the model's new method

@returns promise

##### delete

Relay call to the model's delete method

@returns promise

##### validate

Relay call to the model's validate method

@param array fields (array of fields to validate)
@returns promise

##### getClassName

Returns active record class name

@returns promise

##### virtualField

Returns computed property / virtual field by concatenating multiple properties

@param string name (name of the virtual field)
@param function valueFn (?) // TODO: remove abbreviation & name more clearly
@returns {construct}

##### virtualFieldUpdate

When the field is set manually it triggers the set function defined in virtualField.
We can set it to blank and then it triggers the valueFn to set the value

@param string name (name of virtual field to update)
@returns this
