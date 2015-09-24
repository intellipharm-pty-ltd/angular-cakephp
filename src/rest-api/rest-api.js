import _ from 'lodash';

const MESSAGE_HOSTNAME_AND_PATH_REQURIED = "Please configure an API hostname & path before making a request";
const MESSAGE_HTTP_REQUIRED = "Please provide HTTP service";
const MESSAGE_ID_IS_REQURIED = "Please provide an ID with request";
const MESSAGE_INVALID_HTTP_SERVICE = "http is invalid";

/**
 * Class RestApi
 */
class RestApi {

    /**
     * activeRecordClass
     */
    static get activeRecordClass() {
        return this._active_record_class;
    }
    static set activeRecordClass( value ) {
        this._active_record_class = value;
    }

    /**
     * errorHandler
     */
    static get errorHandler() {
        return this._error_handler;
    }
    static set errorHandler( value ) {
        this._error_handler = value;
    }

    /**
     * headers
     * HTTP request headers
     */
    static get headers() {
        return this._headers;
    }
    static set headers( value ) {
        this._headers = value;
    }

    /**
     * hostname
     * API hostname to use in HTTP requests
     */
    static get hostname() {
        return this._hostname;
    }
    static set hostname( value ) {
        this._hostname = value;
    }

    /**
     * http
     * AngularJS $http service
     */
    static get http() {
        return this._http;
    }
    static set http( value ) {
        this._http = value;
    }

    /**
     * paramSerializer
     * will be attached to http.paramSerializer if none is provided with request config
     */
    static get paramSerializer() {
        return this._param_serializer;
    }
    static set paramSerializer( value ) {
        this._param_serializer = value;
    }

    /**
     * path
     * API path to use in HTTP requests
     * if no path is available & active record class is set then pathGenerator will be used to generate API path
     */
    static get path() {
        if ( _.isNull( this._path ) && !_.isNull( this.pathGenerator ) && !_.isNull( this.activeRecordClass ) ) {
            let _name = !_.isUndefined( this.activeRecordClass.name ) ? this.activeRecordClass.name : this.activeRecordClass.constructor.name;
            this.path = this.pathGenerator( _.snakeCase( _name ) );
        }
        return this._path;
    }
    static set path( value ) {
        this._path = value;
    }

    /**
     * pathGenerator
     * Used to generate API Path when no path is available & active record class is set,
     * will be passed the _.snakeCase of the active record class name
     */
    static get pathGenerator() {
        return this._path_generator;
    }
    static set pathGenerator( value ) {
        this._path_generator = value;
    }

    /**
     * responseTransformer
     */
    static get responseTransformer() {
        return this._response_transformer;
    }
    static set responseTransformer( value ) {
        this._response_transformer = value;
    }

    /**
     * url
     */
    static get url() {

        let hostname = this.hostname;
        let path = this.path;

        if ( _.isNull( this._url ) && ( _.isNull( hostname ) || _.isNull( path ) ) ) {
            throw new Error( MESSAGE_HOSTNAME_AND_PATH_REQURIED );
        }

        // create url from hostname and path
        if ( _.isNull( this._url ) ) {
            this._url = hostname + path;
        }

        return this._url;
    }
    static set url( value ) {
        this._url = value;
    }

    /**
     * index
     *
     * @param  {Object} request_config = {}
     * @param  {ActiveRecord Class} active_record_class = null
     * @return {Promise}
     * @throws {Error}
     */
    static index( request_config = {}, active_record_class = null ) {

        // update class properties

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        // request config

        request_config.method = "GET";
        request_config.url = this.url;
        request_config.headers = _.has( request_config, 'headers' ) ? _.merge( request_config.headers, this.headers ) : this.headers;

        // request ...
        return this.request( request_config );
    }

    /**
     * view
     *
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @param  {ActiveRecord Class} active_record_class = null
     * @return {Promise}
     * @throws {Error}
     */
    static view( id, request_config = {}, active_record_class = null ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // update class properties

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        // request config

        request_config.method = "GET";
        request_config.url = this.url + '/' + id;
        request_config.headers = _.has( request_config, 'headers' ) ? _.merge( request_config.headers, this.headers ) : this.headers;

        // request ...
        return this.request( request_config );
    }

    /**
     * add
     *
     * @param  {Object} request_config = {}
     * @param  {Object} request_data = {}
     * @param  {ActiveRecord Class} active_record_class = null
     * @return {Promise}
     * @throws {Error}
     */
    static add( request_config = {}, request_data = {}, active_record_class = null ) {

        // update class properties

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        // request config

        request_config.method = "POST";
        request_config.url = this.url;
        request_config.data = request_data;
        request_config.headers = _.has( request_config, 'headers' ) ? _.merge( request_config.headers, this.headers ) : this.headers;

        // request ...
        return this.request( request_config );
    }

    /**
     * edit
     *
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @param  {Object} request_data = {}
     * @param  {ActiveRecord Class} active_record_class = null
     * @return {Promise}
     * @throws {Error}
     */
    static edit( id, request_config = {}, request_data = {}, active_record_class = null ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // update class properties

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        // request config

        request_config.method = "PUT";
        request_config.url = this.url + '/' + id;
        request_config.data = request_data;
        request_config.headers = _.has( request_config, 'headers' ) ? _.merge( request_config.headers, this.headers ) : this.headers;

        // request ...
        return this.request( request_config );
    }

    /**
     * delete
     *
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @param  {ActiveRecord Class} active_record_class = null
     * @return {Promise}
     * @throws {Error}
     */
    static delete( id, request_config = {}, active_record_class = null ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // update class properties

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        // request config

        request_config.method = "DELETE";
        request_config.url = this.url + '/' + id;
        request_config.headers = _.has( request_config, 'headers' ) ? _.merge( request_config.headers, this.headers ) : this.headers;

        // request ...
        return this.request( request_config );
    }

    /**
     * request
     *
     * @param  {Object} config
     * @param  {Function} active_record_class = null
     * @param  {Function} responseTransformer = null
     * @param  {Function} errorHandler = null
     * @return {Promise}
     * @throws {Error}
     */
    static request( config = {}, active_record_class = null, response_transformer = null, error_handler = null ) {

        if ( _.isNull( this.http ) ) {
            throw new Error( MESSAGE_HTTP_REQUIRED );
        }

        // update class properties

        if ( !_.isNull( response_transformer ) ) {
            this.responseTransformer = response_transformer;
        }

        if ( !_.isNull( error_handler ) ) {
            this.errorHandler = error_handler;
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        if ( _.has( config, 'hostname' ) ) {
            this.hostname = config.hostname;
            delete config.hostname; // clean config
        }

        if ( _.has( config, 'path' ) ) {
            this.path = config.path;
            delete config.path; // clean config
        }

        // update request config

        if ( !_.has( config, 'paramSerializer' ) ) {

            let _param_serializer = this.paramSerializer;

            if ( !_.isNull( _param_serializer ) ) {
                config.paramSerializer = _param_serializer;
            }
        }

        if ( !_.has( config, 'url' ) ) {

            let _url = this.url;

            if ( !_.isNull( _url ) ) {
                config.url = _url;
            }
        }

        if ( _.has( config, 'sub_path' ) ) {
            config.url += '/' + config.sub_path;
            delete config.sub_path; // clean config
        }

        return new Promise( ( resolve, reject ) => {

            let _promise = this.http( config );

            if ( _.isUndefined( _promise ) || typeof _promise !== 'object' || _.isUndefined( _promise.then ) ) {
                throw new Error( MESSAGE_INVALID_HTTP_SERVICE );
            }

            _promise.then(
                ( response ) => {

                    // response transformer

                    let _response_transformer = this.responseTransformer;

                    if ( !_.isNull( _response_transformer ) && typeof _response_transformer === 'function' ) {
                        resolve( _response_transformer( response, this.activeRecordClass ) );
                        return;
                    }

                    // no response transformer
                    resolve( response );
                },
                ( response ) => {

                    // error handler

                    let _error_handler = this.errorHandler;

                    if ( !_.isNull( _error_handler ) && typeof _error_handler === 'function' ) {
                        reject( _error_handler( response ) );
                        return;
                    }

                    // no error handler
                    reject( response );
                }
            );
        });
    }

    /**
     * reset
     */
    static reset() {

        // defaults
        this._active_record_class    = null;
        this._error_handler          = null;
        this._headers                = {};
        this._hostname               = null;
        this._http                   = null;
        this._path                   = null;
        this._path_generator         = null;
        this._param_serializer       = null;
        this._response_transformer   = null;
        this._url                    = null;
    }
}

// defaults
RestApi.reset();

// constants
RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED = MESSAGE_HOSTNAME_AND_PATH_REQURIED;
RestApi.MESSAGE_HTTP_REQUIRED = MESSAGE_HTTP_REQUIRED;
RestApi.MESSAGE_ID_IS_REQURIED = MESSAGE_ID_IS_REQURIED;

export default RestApi;
