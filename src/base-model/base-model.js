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
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Object} data = {}
     * @param  {Boolean} map_data = null
     * @return {Promise}
     */
    static new( active_record_class, data = {}, map_data = null ) {

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
     * @param  {Class} active_record_class
     * @param  {Object} config = {}
     * @return {Promise}
     */
    static index( active_record_class, config = {} ) {

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.index( this.activeRecordClass, config );
    }

    /**
     * view
     * @param  {Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} config = {}
     * @return {Promise}
     */
    static view( active_record_class, id, config = {} ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.view( this.activeRecordClass, id, config );
    }

    /**
     * add
     * @param  {Class} active_record_class
     * @param  {Object} data
     * @param  {Object} config = {}
     * @return {Promise}
     */
    static add( active_record_class, data, config = {} ) {

        if ( _.isUndefined( data ) ) {
            throw new Error( MESSAGE_DATA_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.add( this.activeRecordClass, config, data );
    }

    /**
     * edit
     * @param  {Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} data
     * @param  {Object} config = {}
     * @return {Promise}
     */
    static edit( active_record_class, id, data, config = {} ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( _.isUndefined( data ) ) {
            throw new Error( MESSAGE_DATA_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.edit( this.activeRecordClass, id, config, data );
    }

    /**
     * delete
     * @param  {Class} active_record_class
     * @param  {Integer} id
     * @param  {Object} config = {}
     * @return {Promise}
     */
    static delete( active_record_class, id, config = {} ) {

        if ( _.isUndefined( id ) ) {
            throw new Error( MESSAGE_ID_REQURIED );
        }

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.delete( this.activeRecordClass, id, config );
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

        if ( !_.isNull( active_record_class ) ) {
            this.activeRecordClass = active_record_class;
        }

        return RestApi.request( this.activeRecordClass, config );
    }

    /**
     * reset
     */
    static reset() {

        // defaults
        this._active_record_class = null;
    }
}

// defaults
BaseModel.reset();

export default BaseModel;
