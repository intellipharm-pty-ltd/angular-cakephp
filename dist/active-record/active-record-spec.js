System.register([], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {}
  };
});
// import { ActiveRecord, BaseModel } from '../angular-cakephp';
//
// describe( "ActiveRecord", () => {
//
//     //---------------------------------------------------
//     // map data
//     //---------------------------------------------------
//
//     it('mapData property should default to true', () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member({});
//
//         // assert
//         expect( me.mapData ).toBeTruthy();
//     });
//
//     it('should map data to specified properties only if ActiveRecord.mapData is set to false', () => {
//
//         // prepare
//         class Member extends ActiveRecord {
//             constructor( data ) {
//                 super( data, Member, false );
//                 this.firstname = data.firstname;
//             }
//         }
//         ActiveRecord.mapData = false;
//
//         // call
//         let me = new Member({ "firstname": "John", "lastname": "Smith" });
//
//         // assert
//         expect( me.firstname ).toBe( "John" );
//         expect( me.lastname ).toBeUndefined();
//     });
//
//     it('should map data if ActiveRecord.mapData is set to true', () => {
//
//         // prepare
//         class Member extends ActiveRecord {
//             constructor( data ) {
//                 super( data, Member, true );
//             }
//         }
//
//         // call
//         let me = new Member({ "firstname": "John" });
//
//         // assert
//         expect( me.firstname ).toBe( "John" );
//     });
//
//     //---------------------------------------------------
//     // computed properties
//     //---------------------------------------------------
//
//     it('should return computed property', () => {
//
//         // prepare
//         class Member extends ActiveRecord {
//             get name() {
//                 return this.firstname + " " + this.lastname;
//             }
//         }
//         ActiveRecord.mapData = true;
//
//         // call
//         let me = new Member({ "firstname": "John", "lastname": "Smith" });
//
//         // assert
//         expect( me.name ).toBe( "John Smith" );
//     });
//
//     //---------------------------------------------------
//     // model
//     //---------------------------------------------------
//
//     it('model property should default to BaseModel', () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member({});
//
//         // assert
//         expect( me.model instanceof BaseModel.constructor ).toBeTruthy();
//     });
//
//     //---------------------------------------------------
//     // view
//     //---------------------------------------------------
//
//     it("view should throw an error if id is not set", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//
//         // call & assert
//
//         try {
//             let r = me.view();
//         } catch ( error ) {
//             var error_message = error.message;
//         }
//         expect( error_message ).toEqual( ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID );
//     });
//
//     it("view should call model.view", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//         me.id = 123;
//
//         // spy
//         spyOn( me.model, 'view' );
//
//         // call
//         me.view();
//
//         // assert
//         expect( me.model.view ).toHaveBeenCalledWith( 123, me );
//     });
//
//     //---------------------------------------------------
//     // save
//     //---------------------------------------------------
//
//     it("view should call model.add if no id is set", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//
//         // spy
//         spyOn( me.model, 'add' );
//
//         // call
//         me.save();
//
//         // assert
//         expect( me.model.add ).toHaveBeenCalledWith( me );
//     });
//
//     it("view should call model.edit if id is set", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//         me.id = 123;
//
//         // spy
//         spyOn( me.model, 'edit' );
//
//         // call
//         me.save();
//
//         // assert
//         expect( me.model.edit ).toHaveBeenCalledWith( 123, me );
//     });
//
//     //---------------------------------------------------
//     // delete
//     //---------------------------------------------------
//
//     it("view should throw an error if id is not set", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//
//         // call & assert
//
//         try {
//             let r = me.delete();
//         } catch ( error ) {
//             var error_message = error.message;
//         }
//         expect( error_message ).toEqual( ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID );
//     });
//
//     it("view should call model.delete", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         let me = new Member();
//         me.id = 123;
//
//         // spy
//         spyOn( me.model, 'delete' );
//
//         // call
//         me.delete();
//
//         // assert
//         expect( me.model.delete ).toHaveBeenCalledWith( 123 );
//     });
//
//     //---------------------------------------------------
//     // enumeration OR validation etc
//     //---------------------------------------------------
//
//     it("enumeration should call model.request", () => {
//
//         // prepare
//         class Member extends ActiveRecord {
//             enumeration() {
//                 let request_config = {
//                     method: "GET",
//                     sub_path: "enumeration"
//                 };
//                 return this.model.request( request_config );
//             }
//         }
//         let me = new Member();
//
//         // spy
//         spyOn( me.model, "request" );
//
//         // call
//         me.enumeration();
//
//         // assert
//         expect( me.model.request ).toHaveBeenCalledWith( {
//             method: "GET",
//             sub_path: "enumeration"
//         } );
//     });
// });