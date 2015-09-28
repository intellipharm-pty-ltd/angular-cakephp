System.register([], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {}
  };
});
// import { RestApi, BaseModel, ActiveRecord } from '../angular-cakephp';
//
// describe( "BaseModel", () => {
//
//     beforeEach( () => {
//         BaseModel.reset();
//     });
//
//     //---------------------------------------------------
//     // new
//     //---------------------------------------------------
//
//     it("BaseModel.new should create a new object instance if no active record class is provided", () => {
//
//         // call
//         let a = BaseModel.new( null, { "firstname": "John" } );
//
//         // assert
//         expect( a.firstname ).toEqual( "John" );
//         expect( a instanceof Object ).toBeTruthy();
//         expect( a instanceof ActiveRecord ).toBeFalsy();
//     });
//
//     it("BaseModel.new should create a new instance of provided active record class", () => {
//
//         // call
//         let a = BaseModel.new( ActiveRecord, { "firstname": "John" } );
//
//         // assert
//         expect( a.firstname ).toEqual( "John" );
//         expect( a instanceof ActiveRecord ).toBeTruthy();
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // call
//         let b = BaseModel.new( Member, { "firstname": "John", "lastname": "Smith" }, true );
//
//         // assert
//         expect( b.firstname ).toEqual( "John" );
//         expect( b instanceof Member ).toBeTruthy();
//     });
//
//     it("BaseModel.new should create a new instance of predefined active record class", () => {
//
//         // prepare
//         ActiveRecord.mapData = true;
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // call
//         let a = BaseModel.new( null, { "firstname": "John" } );
//
//         // assert
//         expect( a.firstname ).toEqual( "John" );
//         expect( a instanceof Member ).toBeTruthy();
//
//         // prepare
//         class NonMember extends ActiveRecord {}
//         BaseModel.activeRecordClass = NonMember;
//
//         // call
//         let b = BaseModel.new( null, { "firstname": "John" } );
//
//         // assert
//         expect( b.firstname ).toEqual( "John" );
//         expect( b instanceof NonMember ).toBeTruthy();
//     });
//
//     it("BaseModel.new should not map data if so specified in provided active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {
//             constructor( data ) {
//                 super( data, Member, false );
//                 this.firstname = data.firstname;
//             }
//         }
//
//         // call
//         let a = BaseModel.new( Member, { "firstname": "John", "lastname": "Smith" } );
//
//         // assert
//         expect( a.firstname ).toEqual( "John" );
//         expect( a.lastname ).toBeUndefined();
//         expect( a instanceof Member ).toBeTruthy();
//     });
//
//     //---------------------------------------------------
//     // index
//     //---------------------------------------------------
//
//     it("BaseModel.index should call RestApi.index with provided config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // spies
//         spyOn( RestApi, "index" );
//
//         // call
//         let a = BaseModel.index( Member, { "a": "A" } );
//
//         // assert
//         expect( RestApi.index ).toHaveBeenCalledWith( Member, { "a": "A" } );
//     });
//
//     it("BaseModel.index should call RestApi.index with provided config and predefined active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "index" );
//
//         // call
//         let a = BaseModel.index( null, { "a": "A" } );
//
//         // assert
//         expect( RestApi.index ).toHaveBeenCalledWith( Member, { "a": "A" } );
//     });
//
//     //---------------------------------------------------
//     // view
//     //---------------------------------------------------
//
//     it("BaseModel.view should throw an error if no id is provided", () => {
//
//         // assert
//         expect( () => { BaseModel.view(); } ).toThrow();
//     });
//
//     it("BaseModel.view should call RestApi.view with provided id, config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // spies
//         spyOn( RestApi, "view" );
//
//         // call
//         let a = BaseModel.view( Member, 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.view ).toHaveBeenCalledWith( Member, 123, { "a": "A" } );
//     });
//
//     it("BaseModel.view should call RestApi.view with provided config and predefined active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "view" );
//
//         // call
//         let a = BaseModel.view( null, 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.view ).toHaveBeenCalledWith( Member, 123, { "a": "A" } );
//     });
//
//     //---------------------------------------------------
//     // add
//     //---------------------------------------------------
//
//     it("BaseModel.add should throw an error if no data is provided", () => {
//
//         // assert
//         expect( () => { BaseModel.add(); } ).toThrow();
//     });
//
//     it("BaseModel.add should call RestApi.add with provided id, config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // spies
//         spyOn( RestApi, "add" );
//
//         // call
//         let data = { "a": "A" };
//         let config = { "b": "B" };
//         let a = BaseModel.add( Member, data, config );
//
//         // assert
//         expect( RestApi.add ).toHaveBeenCalledWith( Member, config, data );
//     });
//
//     it("BaseModel.add should call RestApi.add with provided config and predefined active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "add" );
//
//         // call
//         let data = { "a": "A" };
//         let config = { "b": "B" };
//         let a = BaseModel.add( null, data, config );
//
//         // assert
//         expect( RestApi.add ).toHaveBeenCalledWith( Member, config, data );
//     });
//
//     //---------------------------------------------------
//     // edit
//     //---------------------------------------------------
//
//     it("BaseModel.edit should throw an error if no id is provided", () => {
//
//         // assert
//         expect( () => { BaseModel.edit( undefined, {} ); } ).toThrow();
//     });
//
//     it("BaseModel.edit should throw an error if no data is provided", () => {
//
//         // assert
//         expect( () => { BaseModel.edit( 123, undefined ); } ).toThrow();
//     });
//
//     it("BaseModel.edit should call RestApi.edit with provided id, config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "edit" );
//
//         // call
//         let data = { "a": "A" };
//         let config = { "b": "B" };
//         let a = BaseModel.edit( Member, 123, data, config );
//
//         // assert
//         expect( RestApi.edit ).toHaveBeenCalledWith( Member, 123, config, data );
//     });
//
//     it("BaseModel.edit should call RestApi.edit with provided config and predefined active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "edit" );
//
//         // call
//         let data = { "a": "A" };
//         let config = { "b": "B" };
//         let a = BaseModel.edit( null, 123, data, config );
//
//         // assert
//         expect( RestApi.edit ).toHaveBeenCalledWith( Member, 123, config, data );
//     });
//
//     //---------------------------------------------------
//     // delete
//     //---------------------------------------------------
//
//     it("BaseModel.delete should throw an error if no id is provided", () => {
//
//         // assert
//         expect( () => { BaseModel.delete(); } ).toThrow();
//     });
//
//     it("BaseModel.delete should call RestApi.delete with provided id, config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // spies
//         spyOn( RestApi, "delete" );
//
//         // call
//         let a = BaseModel.delete( Member, 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.delete ).toHaveBeenCalledWith( Member, 123, { "a": "A" } );
//     });
//
//     it("BaseModel.delete should call RestApi.delete with provided config and predefined active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//         BaseModel.activeRecordClass = Member;
//
//         // spies
//         spyOn( RestApi, "delete" );
//
//         // call
//         let a = BaseModel.delete( null, 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.delete ).toHaveBeenCalledWith( Member, 123, { "a": "A" } );
//     });
//
//     //---------------------------------------------------
//     // request
//     //---------------------------------------------------
//
//     it("BaseModel.request should call RestApi.request with provided config and active record class", () => {
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // spies
//         spyOn( RestApi, "request" );
//
//         // call
//         let a = BaseModel.request( Member, { "a": "A" } );
//
//         // assert
//         expect( RestApi.request ).toHaveBeenCalledWith( Member, { "a": "A" } );
//     });
// });