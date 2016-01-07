import _ from 'lodash';
import { ActiveRecord } from '../angular-cakephp';

const MESSAGE_HOSTNAME_AND_PATH_REQURIED    = 'Please configure an API hostname & path before making a request';
const MESSAGE_HTTP_REQUIRED                 = 'Please provide HTTP service';
const MESSAGE_ID_IS_REQURIED                = 'Please provide an ID with request';
const MESSAGE_INVALID_HTTP_SERVICE          = 'http is invalid';

/**
 * Class RestApi
 */
class RestApi {

    /**
     * cacheControl
     */
    static get cacheControl() {
        return this._cache_control;
    }
    static set cacheControl( value ) {
        this._cache_control = value;
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
     * errorTransformer
     */
    static get errorTransformer() {
        return this._error_transformer;
    }
    static set errorTransformer( value ) {
        this._error_transformer = value;
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

    /*
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
     * responseHandler
     */
    static get responseHandler() {
        return this._response_handler;
    }
    static set responseHandler( value ) {
        this._response_handler = value;
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
     * successHandler
     */
    static get successHandler() {
        return this._success_handler;
    }
    static set successHandler( value ) {
        this._success_handler = value;
    }

    /**
     * successTransformer
     */
    static get successTransformer() {
        return this._success_transformer;
    }
    static set successTransformer( value ) {
        this._success_transformer = value;
    }

    /**
     * scope
     */
    static get scope() {
        return this._scope;
    }
    static set scope( value ) {
        this._scope = value;
    }

    /**
     * timeout
     */
    static get timeout() {
        return this._timeout;
    }
    static set timeout( value ) {
        this._timeout = value;
    }

    /**
     * path
     * API path to use in HTTP requests
     * if no path is available & active record class is set then pathGenerator will be used to generate API path
     */
    static path( active_record_class = null ) {

        if ( !_.isNull( this.pathGenerator ) && !_.isNull( active_record_class ) ) {
            let _name = '';

            if (active_record_class.getClassName) {
                _name = active_record_class.getClassName();
            // fallback if not a proper active record class
            } else {
                _name = active_record_class.constructor.name !== 'Function' ? active_record_class.constructor.name : ( !_.isUndefined(active_record_class.name) ? active_record_class.name : null );
            }

            if ( !_.isNull( _name ) ) {
                this._path = this.pathGenerator( _.snakeCase( _name ) );
            }
        }

        return this._path;
    }

    /**
     * url
     */
    static url( active_record_class = null, config = {} ) {

        if ( !_.isNull( this._url ) && _.isNull( active_record_class ) && !_.has( config, 'path' ) ) {
            return this._url;
        }

        let hostname = _.has( config, 'hostname' ) ? config.hostname : this.hostname;

        // if config has path then use that
        // else try and set oath using active_record_class, then get path
        let path = _.has( config, 'path' ) ? config.path : this.path( active_record_class );

        if ( ( _.isNull( hostname ) || _.isNull( path ) ) ) {
            throw new Error( MESSAGE_HOSTNAME_AND_PATH_REQURIED );
        }

        // create url from hostname and path
        this._url = hostname + path;

        return this._url;
    }

    /**
     * index
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Object} request_config = {}
     * @return {Promise}
     * @throws {Error}
     */
    static index( active_record_class, request_config = {} ) {

        // request config
        request_config.method = 'GET';

        // request ...
        return this.request( active_record_class, request_config );
    }

    /**
     * view
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @return {Promise}
     * @throws {Error}
     */
    static view( active_record_class, id, request_config = {} ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // request config
        request_config.method = 'GET';
        request_config.sub_path = _.has( request_config, 'sub_path' ) ? id + '/' + request_config.sub_path : id;

        // request ...
        return this.request( active_record_class, request_config );
    }

    /**
     * add
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Object} request_config = {}
     * @return {Promise}
     * @throws {Error}
     */
    static add( active_record_class, request_config = {} ) {

        // request config
        request_config.method = 'POST';

        // request ...
        return this.request( active_record_class, request_config );
    }

    /**
     * edit
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @return {Promise}
     * @throws {Error}
     */
    static edit( active_record_class, id, request_config = {} ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // request config
        request_config.method = 'PUT';
        request_config.sub_path = this.formatSubPath( id, request_config );

        // request ...
        return this.request( active_record_class, request_config );
    }

    /**
     * formatSubPath
     *
     * @param  {Integer}      id
     * @param  {object}      config
     * @return {String}
     */
    static formatSubPath( id, config ) {

        let result = id.toString();

        if ( _.has( config, 'sub_path' ) && config.sub_path.length > 0 ) {

            result += _.startsWith( config.sub_path, '/' ) ? '' : '/';
            result += config.sub_path;
        }

        return result;
    }

    /**
     * delete
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} request_config = {}
     * @return {Promise}
     * @throws {Error}
     */
    static delete( active_record_class, id, request_config = {} ) {

        if ( _.isNull( id ) || _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_IS_REQURIED );
        }

        // request config
        request_config.method = 'DELETE';
        request_config.sub_path = this.formatSubPath( id, request_config );

        // request ...
        return this.request( active_record_class, request_config );
    }

    /**
     * request
     *
     * @param  {Function} active_record_class
     * @param  {Object} config
     * @return {Promise}
     * @throws {Error}
     */
    static request( active_record_class, config = {} ) {

        // NOTE:
        // using RestApi instead of this for these checks because we can't test otherwise
        // and testing like this doesn't work (TODO: find out why):
        //   expect( RestApi.request.bind( RestApi ) ).toThrowError( ... );

        if ( _.isNull( RestApi.http ) ) {
            throw new Error( MESSAGE_HTTP_REQUIRED );
        }

        // update params

        let response_handler = this.responseHandler;
        if ( _.has( config, 'responseHandler' ) ) {
            response_handler = config.responseHandler;
            delete config.responseHandler; // clean config
        }

        let response_transformer = this.responseTransformer;
        if ( _.has( config, 'responseTransformer' ) ) {
            response_transformer = config.responseTransformer;
            delete config.responseTransformer; // clean config
        }

        let success_handler = this.successHandler || response_handler;
        if ( _.has( config, 'successHandler' ) ) {
            success_handler = config.successHandler;
            delete config.successHandler; // clean config
        }

        let success_transformer = this.successTransformer || response_transformer;
        if ( _.has( config, 'successTransformer' ) ) {
            success_transformer = config.successTransformer;
            delete config.successTransformer; // clean config
        }

        let error_handler = this.errorHandler || response_handler;
        if ( _.has( config, 'errorHandler' ) ) {
            error_handler = config.errorHandler;
            delete config.errorHandler; // clean config
        }

        let error_transformer = this.errorTransformer || response_transformer;
        if ( _.has( config, 'errorTransformer' ) ) {
            error_transformer = config.errorTransformer;
            delete config.errorTransformer; // clean config
        }

        // update request config

        config.headers = _.has( config, 'headers' ) ? _.merge( this.headers, config.headers ) : this.headers;

        if ( !_.has( config, 'paramSerializer' ) && !_.isNull( this.paramSerializer ) ) {
            config.paramSerializer = this.paramSerializer;
        }

        if ( !_.has( config, 'url' ) ) {
            let _url = this.url( active_record_class, config );

            if ( !_.isNull( _url ) ) {
                config.url = _url;
            }
        }

        if ( _.has( config, 'sub_path' ) ) {
            config.url += '/' + config.sub_path;
            delete config.sub_path; // clean config
        }

        if ( this._cache_control && ( !_.has( config, 'method' ) || config.method === 'GET' ) ) {
            if ( !_.isObject( config.params ) ) {
                config.params = {};
            }

            config.params.cache = new Date().getTime();
        }

        return new Promise( ( resolve, reject ) => {

            let http_promise = RestApi.http( config );

            // if HTTP Service is invalid
            if ( _.isUndefined( http_promise ) || typeof http_promise !== 'object' || _.isUndefined( http_promise.then ) ) {
                throw new Error( MESSAGE_INVALID_HTTP_SERVICE );
            }

            http_promise.then(
                ( response ) => {

                    let result = response;

                    // transformer
                    if ( !_.isNull( success_transformer ) && typeof success_transformer === 'function' ) {

                        result = success_transformer( response, active_record_class );
                    }

                    // if no handler
                    if ( _.isNull( success_handler ) || typeof success_handler !== 'function' ) {

                        resolve( result );

                        // TODO: remove this to make is less angular and more vanilla javascript
                        if (this.scope && this.timeout) {
                            this.timeout(() => {
                                this.scope.$apply();
                            });
                        }

                        return;
                    }

                    // handler
                    success_handler( result ).then( resolve, reject );

                    // TODO: remove this to make is less angular and more vanilla javascript
                    if (this.scope && this.timeout) {
                        this.timeout(() => {
                            this.scope.$apply();
                        });
                    }
                },
                ( response ) => {

                    let result = response;

                    // transformer
                    if ( !_.isNull( error_transformer ) && typeof error_transformer === 'function' ) {
                        result = error_transformer( response, active_record_class );
                    }

                    // if no handler
                    if ( _.isNull( error_handler ) || typeof error_handler !== 'function' ) {

                        reject( result );

                        // TODO: remove this to make is less angular and more vanilla javascript
                        if (this.scope && this.timeout) {
                            this.timeout(() => {
                                this.scope.$apply();
                            });
                        }

                        return;
                    }

                    // handler
                    error_handler( result ).then( resolve, reject );

                    // TODO: remove this to make is less angular and more vanilla javascript
                    if (this.scope && this.timeout) {
                        this.timeout(() => {
                            this.scope.$apply();
                        });
                    }
                }
            );
        });
    }

    /**
     * reset
     */
    static reset() {

        // defaults
        this._cache_control          = null;
        this._error_handler          = null;
        this._error_transformer      = null;
        this._headers                = {};
        this._hostname               = null;
        this._http                   = null;
        this._path                   = null;
        this._path_generator         = null;
        this._param_serializer       = null;
        this._response_handler       = null;
        this._response_transformer   = null;
        this._success_handler        = null;
        this._success_transformer    = null;
        this._scope                  = null;
        this._timeout                = null;
        this._url                    = null;
    }
}

// defaults
RestApi.reset();

// constants
RestApi.MESSAGE_HOSTNAME_AND_PATH_REQURIED  = MESSAGE_HOSTNAME_AND_PATH_REQURIED;
RestApi.MESSAGE_HTTP_REQUIRED               = MESSAGE_HTTP_REQUIRED;
RestApi.MESSAGE_ID_IS_REQURIED              = MESSAGE_ID_IS_REQURIED;
RestApi.MESSAGE_INVALID_HTTP_SERVICE        = MESSAGE_INVALID_HTTP_SERVICE;

export default RestApi;
