import { RestApi, BaseModel } from '../angular-cakephp';
import _ from 'lodash';

const MESSAGE_DELETE_ERROR_NO_ID = "Can not delete record with no ID";
const MESSAGE_VIEW_ERROR_NO_ID = "Can not view record with no ID";

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

    //-----------------------
    // methods
    //-----------------------

    /**
     * view
     * @return {Promise}
     */
    view() {

        // view (no id)
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            throw new Error( MESSAGE_VIEW_ERROR_NO_ID );
        }

        // edit
        return this.model.view( this.id, this );
    }

    /**
     * save
     * runs RestApi save or edit depending on whether anid is set
     *
     * @return {Promise}
     */
    save() {

        // add (no id)
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            return this.model.add( this );
        }

        // edit
        return this.model.edit( this.id, this );
    }

    /**
     * delete
     * @return {Promise}
     */
    delete() {

        // no id
        if ( !_.has( this, 'id' ) || _.isUndefined( this.id )) {
            throw new Error( MESSAGE_DELETE_ERROR_NO_ID );
        }

        // delete
        return this.model.delete( this.id );
    }
}

// constants
ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID = MESSAGE_DELETE_ERROR_NO_ID;
ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID = MESSAGE_VIEW_ERROR_NO_ID;
