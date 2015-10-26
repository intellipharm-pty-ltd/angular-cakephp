import { ActiveRecord, RestApi } from '../angular-cakephp';
import _ from 'lodash';

const MESSAGE_ID_REQURIED   = 'Please provide an ID';
const MESSAGE_DATA_REQURIED = 'Please provide data';

/**
 * Class BaseModel
 */
class BaseModel {

    /**
     * new
     *
     * @param  {ActiveRecord Class} active_record_class
     * @param  {Object} data = {}
     * @param  {Boolean} map_data = null
     * @return {Promise}
     */
    static new( ActiveRecordClass, data = {}, map_data = null ) {

        if ( !_.isNull( ActiveRecordClass ) ) {
            let model = this.constructor.name !== 'function' ? this.constructor : this;
            return new ActiveRecordClass( data, model, map_data );
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

        return RestApi.index( active_record_class, config );
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

        return RestApi.view( active_record_class, id, config );
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

        config.data = data;

        return RestApi.add( active_record_class, config );
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

        config.data = data;

        return RestApi.edit( active_record_class, id, config );
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

        return RestApi.delete( active_record_class, id, config );
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

        return RestApi.request( active_record_class, config );
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
