import _ from "lodash";

export default class HTTPResponseTransformer {

    /**
     * associateClasses
     *
     * @param  {Array} value
     */
    static set associateClasses( value ) {

        if ( _.isUndefined( this._associateClasses ) ) {
            this._associateClasses = [];
        }

        _.forEach( value, ( _class ) => {
            this._associateClasses[ _class.name ] = _class;
        } );
    }

    /**
     * transform
     *
     * @param {Object} response
     * @param {Class} active_record_class = null
     * @returns {Array}
     */
    static transform( response, active_record_class = null ) {

        let data = response.data.data;

        if ( !_.isNull( active_record_class ) && !_.isNull( data ) ) {
            if ( data instanceof Array ) {
                data = _.map( data, ( item ) => {
                    return HTTPResponseTransformer.transformData( item, active_record_class );
                } );
            } else {
                data = HTTPResponseTransformer.transformData( data, active_record_class );
            }
        }

        return data;
    }

    /**
     * transformData
     *
     * @param {Object} data
     * @param {Class} active_record_class
     * @returns {*}
     */
    static transformData( data, active_record_class ) {

        let active_record_class_name = active_record_class.name;

        // format item
        data = _.merge( data, data[ active_record_class_name ] );
        delete data[ active_record_class_name ];

        // create active record instance
        if ( !_.isNull( active_record_class ) ) {
            data = new active_record_class( data );
        }

        // transform associations
        this.transformDataAssociations( data );

        return data;
    }

    /**
     * transformDataAssociations
     *
     * @param  {*} data
     * @return {*}
     */
    static transformDataAssociations( data ) {

        // process properties
        _.forEach( data, ( item, key ) => {

            // if property is array or object
            if ( _.isArray( item ) || _.isObject( item ) ) {

                // if property key is association
                if ( !_.isNumber( key ) && key.indexOf( "_" ) === -1 ) {

                    // if associate class exists
                    if ( _.has( this._associateClasses, key ) ) {

                        // get associate class
                        let _class = this._associateClasses[ key ];

                        if ( _.isArray( item ) ) {

                            // replace each item with class instance and enter
                            _.forEach( item, ( sub_item, index ) => {
                                item[ index ] = new _class( sub_item )
                                this.transformDataAssociations( item );
                            });
                            return;
                        } else {
                            console.log(" IS THERE A CASE FOR OBJECTS HERE ?????");
                        }
                    }
                }

                // enter
                this.transformDataAssociations( item );
            }
        } );

        // done
        return data;
    }


        // _.forEach(data, function(item, key) {
        //     if (_.isArray(item)) {
        //         var result_array = UtilService.getAssociationArray(item, key);
        //         if (!_.isEmpty(result_array)) {
        //             instance[key] = result_array;
        //         }
        //     } else if (_.isObject(item)) {
        //         var result_item = UtilService.getAssociation(item, key);
        //         if (result_item !== false) {
        //             instance[key] = result_item;
        //         }
        //     }
        // }, this);

}
