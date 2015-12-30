import { RestApi, BaseModel } from '../angular-cakephp';
import _ from 'lodash';

const MESSAGE_DELETE_ERROR_NO_ID    = 'Can not delete record with no ID';
const MESSAGE_VIEW_ERROR_NO_ID      = 'Can not view record with no ID';

/**
 * Class ActiveRecord
 */
export default class ActiveRecord {

    /**
     * @constructor
     * @param  {Object} data  = {}
     * @param  {Class Instance} model = null
     * @param  {Boolean} map_data = true
     */
    constructor( data = {}, model = null, map_data = null ) {

        this.model = !_.isNull( model ) ? model : BaseModel;
        this.mapData = !_.isNull( map_data ) ? map_data : true;

        // map data
        if ( this.mapData ) {
            for ( var prop in data ) {
                this[ prop ] = data[ prop ];
            }
        }
    }

    /**
     * mapData
     * Whether or not to atomatically map provided data to class properties
     */
    get mapData() {
        return this._map_data;
    }

    set mapData( value ) {
        this._map_data = value;
    }

    /**
     * model
     */
    get model() {
        return this._model;
    }

    set model( value ) {
        this._model = value;
    }

    /**
     * getClassName
     */
    getClassName() {
        // get Active Record class name from Class.constructor.name if it's not 'Function', otherwise  get from Class.name
        return this.constructor.name !== 'Function' ? this.constructor.name : ( !_.isUndefined(this.name) ? this.name : null );
    }

    //-----------------------
    // methods
    //-----------------------

    /**
     * view
     * @param  {Object} config = {}
     * @return {Promise}
     */
    view( config = {} ) {

        // view (no id)
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            throw new Error( MESSAGE_VIEW_ERROR_NO_ID );
        }

        // edit
        return this.model.view( this.constructor, this.id, config );
    }

    /**
     * save
     * runs RestApi save or edit depending on whether anid is set
     *
     * @param  {Object} config = {}
     * @return {Promise}
     */
    save( config = {} ) {

        // add (no id)
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            return this.model.add( this.constructor, this, config );
        }

        // edit
        return this.model.edit( this.constructor, this.id, this, config );
    }

    /**
     * delete
     *
     * @param  {Object} config = {}
     * @return {Promise}
     */
    delete( config = {} ) {

        // no id
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            throw new Error( MESSAGE_DELETE_ERROR_NO_ID );
        }

        // delete
        return this.model.delete( this.constructor, this.id, config );
    }
}

// constants
ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID     = MESSAGE_DELETE_ERROR_NO_ID;
ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID       = MESSAGE_VIEW_ERROR_NO_ID;
