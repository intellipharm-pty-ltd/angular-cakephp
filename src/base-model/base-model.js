import { ActiveRecord, RestApi } from '../angular-cakephp';
import _ from 'lodash';

const MESSAGE_ID_REQURIED = "Please provide an ID";
const MESSAGE_DATA_REQURIED = "Please provide data";

/**
 * Class BaseModel
 */
class BaseModel {

    /**
     * activeRecordClass
     * class used to create active record instances from request results
     */
    static get activeRecordClass() {
        return this._active_record_class;
    }
    static set activeRecordClass( value ) {
        this._active_record_class = value;
    }

    /**
     * new
     *
     * @param  {ActiveRecord Class} active_record_class = null
     * @param  {Object} data = {}
     * @param  {Boolean} map_data = null
     * @return {Promise}
     */
    static new( data = {}, active_record_class = null, map_data = null ) {

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        if ( !_.isNull( this.activeRecordClass ) ) {
            return new this.activeRecordClass( data, this, map_data );
        }

        return data;
    }

    /**
     * index
     *
     * @param  {Object} config = {}
     * @param  {Class} active_record_class = null
     * @return {Promise}
     */
    static index( config = {}, active_record_class = null ) {

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.index( config, this.activeRecordClass );
    }

    /**
     * view
     * @param  {Integer} id
     * @param  {Object} config = {}
     * @param  {Class} active_record_class = null
     * @return {Promise}
     */
    static view( id, config = {}, active_record_class = null ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.view( id, config, this.activeRecordClass );
    }

    /**
     * add
     * @param  {Object} data
     * @param  {Object} config = {}
     * @param  {Class} active_record_class = null
     * @return {Promise}
     */
    static add( data, config = {}, active_record_class = null ) {

        if ( _.isUndefined( data ) ) {
            throw new Error( MESSAGE_DATA_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.add( config, data, this.activeRecordClass );
    }

    /**
     * edit
     * @param  {Integer} id
     * @param  {Object} data
     * @param  {Object} config = {}
     * @param  {Class} active_record_class = null
     * @return {Promise}
     */
    static edit( id, data, config = {}, active_record_class = null ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( _.isUndefined( data ) ) {
            throw new Error( MESSAGE_DATA_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.edit( id, config, data, this.activeRecordClass );
    }

    /**
     * delete
     * @param  {Integer} id
     * @param  {Object} config = {}
     * @param  {Class} active_record_class = null
     * @return {Promise}
     */
    static delete( id, config = {}, active_record_class = null ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.delete( id, config, this.activeRecordClass );
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
    static request( config = {}, active_record_class = null ) {

        if ( _.isNull( active_record_class ) ) {
            active_record_class = this.activeRecordClass;
        }

        return RestApi.request( config, active_record_class );
    }

    /**
     * reset
     */
    static reset() {

        // defaults
        this._active_record_class    = null;
    }
}

// defaults
BaseModel.reset();

export default BaseModel;
