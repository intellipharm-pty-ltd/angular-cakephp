import _ from "lodash";

export default class HTTPResponseTransformer {

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

        return data;
    }
}
