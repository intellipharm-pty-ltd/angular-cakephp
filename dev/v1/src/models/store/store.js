import { ActiveRecord } from 'dist/angular-cakephp';

/**
 * Class Store
 */
export default class Store extends ActiveRecord {

    /**
     * @constructor
     * @param  {Object} data  = {}
     * @param  {Class Instance} model = null
     * @param  {Boolean} should_map_data = true
     */
    constructor( data = {}, model = null, should_map_data = true ) {
        super( data, model, should_map_data );
    }
}
