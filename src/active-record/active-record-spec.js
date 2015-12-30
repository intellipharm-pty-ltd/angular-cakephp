import { ActiveRecord, BaseModel, RestApi } from '../angular-cakephp';

var http_mock = () => {
    return new Promise( ( resolve, reject ) => {
        resolve( {} );
    } );
};

describe( 'ActiveRecord', () => {

    //---------------------------------------------------
    // map data
    //---------------------------------------------------

    it('mapData property should default to true', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member({});

        // assert
        expect( me.mapData ).toBeTruthy();
    });

    it('should map data to specified properties only if ActiveRecord.mapData is set to false', () => {

        // prepare
        class Member extends ActiveRecord {
            constructor( data ) {
                super( data, Member, false );
                this.firstname = data.firstname;
            }
        }
        ActiveRecord.mapData = false;

        // call
        let me = new Member({ 'firstname': 'John', 'lastname': 'Smith' });

        // assert
        expect( me.firstname ).toBe( 'John' );
        expect( me.lastname ).toBeUndefined();
    });

    it('should map data if ActiveRecord.mapData is set to true', () => {

        // prepare
        class Member extends ActiveRecord {
            constructor( data ) {
                super( data, Member, true );
            }
        }

        // call
        let me = new Member({ 'firstname': 'John' });

        // assert
        expect( me.firstname ).toBe( 'John' );
    });

    //---------------------------------------------------
    // computed properties
    //---------------------------------------------------

    it('should return computed property', () => {

        // prepare
        class Member extends ActiveRecord {
            get name() {
                return this.firstname + ' ' + this.lastname;
            }
        }
        ActiveRecord.mapData = true;

        // call
        let me = new Member({ 'firstname': 'John', 'lastname': 'Smith' });

        // assert
        expect( me.name ).toBe( 'John Smith' );
    });

    //---------------------------------------------------
    // model
    //---------------------------------------------------

    it('model property should default to BaseModel', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member({});

        // assert
        expect( me.model instanceof BaseModel.constructor ).toBeTruthy();
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    it('view should throw an error if id is not set', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();

        // call & assert

        try {
            let r = me.view();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID );
    });

    it('view should call model.view', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();
        me.id = 123;

        // spy
        spyOn( me.model, 'view' );

        // call
        me.view();

        // assert
        expect( me.model.view ).toHaveBeenCalledWith( me.constructor, 123, {} );
    });

    //---------------------------------------------------
    // save
    //---------------------------------------------------

    it('save should call model.add if no id is set', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();

        // spy
        spyOn( me.model, 'add' );

        // call
        me.save();

        // assert
        expect( me.model.add ).toHaveBeenCalledWith( me.constructor, me, {} );
    });

    it('save should call model.edit if id is set', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();
        me.id = 123;

        // spy
        spyOn( me.model, 'edit' );

        // call
        me.save();

        // assert
        expect( me.model.edit ).toHaveBeenCalledWith( me.constructor, 123, me, {} );
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    it('delete should throw an error if id is not set', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();

        // call & assert

        try {
            let r = me.delete();
        } catch ( error ) {
            var error_message = error.message;
        }
        expect( error_message ).toEqual( ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID );
    });

    it('delete should call model.delete', () => {

        // prepare
        class Member extends ActiveRecord {}
        let me = new Member();
        me.id = 123;

        // spy
        spyOn( me.model, 'delete' );

        // call
        me.delete();

        // assert
        expect( me.model.delete ).toHaveBeenCalledWith( me.constructor, 123, {} );
    });

    //---------------------------------------------------
    // enumeration OR validation etc
    //---------------------------------------------------

    it('enumeration should call model.request', () => {

        // prepare
        class Member extends ActiveRecord {
            enumeration() {
                let request_config = {
                    method: 'GET',
                    sub_path: 'enumeration'
                };
                return this.model.request( request_config );
            }
        }
        let me = new Member();

        // spy
        spyOn( me.model, 'request' );

        // call
        me.enumeration();

        // assert
        expect( me.model.request ).toHaveBeenCalledWith( {
            method: 'GET',
            sub_path: 'enumeration'
        } );
    });

    //---------------------------------------------------
    // validate
    //---------------------------------------------------

    it('validate should call http correctly', () => {

        RestApi.http = http_mock;
        RestApi.hostname = 'myhost/';
        RestApi.pathGenerator = ( ar ) => {
            return ar + 's';
        };

        // prepare
        class Member extends ActiveRecord {
            validate() {
                let request_config = {
                    method: 'GET',
                    sub_path: 'validation'
                };
                return this.model.request( this, request_config );
            }
        }
        let me = new Member();

        // spy
        spyOn(RestApi, 'http').and.returnValue( http_mock() );

        // call
        me.validate();

        // assert
        let expeted_arg = {
            method: 'GET',
            headers: {},
            url: 'myhost/members/validation'
        };
        expect( RestApi.http ).toHaveBeenCalledWith( expeted_arg );
    });
});
