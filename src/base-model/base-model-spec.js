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
//         let a = BaseModel.new( { "firstname": "John" } );
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
//         let a = BaseModel.new( { "firstname": "John" }, ActiveRecord );
//
//         // assert
//         expect( a.firstname ).toEqual( "John" );
//         expect( a instanceof ActiveRecord ).toBeTruthy();
//
//         // prepare
//         class Member extends ActiveRecord {}
//
//         // call
//         let b = BaseModel.new( { "firstname": "John", "lastname": "Smith" }, Member, true );
//
//         console.log(b);
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
//         let a = BaseModel.new( { "firstname": "John" } );
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
//         let b = BaseModel.new( { "firstname": "John" } );
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
//         let a = BaseModel.new( { "firstname": "John", "lastname": "Smith" }, Member );
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
//         let a = BaseModel.index( { "a": "A" }, Member );
//
//         // assert
//         expect( RestApi.index ).toHaveBeenCalledWith( { "a": "A" }, Member );
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
//         let a = BaseModel.index( { "a": "A" } );
//
//         // assert
//         expect( RestApi.index ).toHaveBeenCalledWith( { "a": "A" }, Member );
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
//         let a = BaseModel.view( 123, { "a": "A" }, Member );
//
//         // assert
//         expect( RestApi.view ).toHaveBeenCalledWith( 123, { "a": "A" }, Member );
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
//         let a = BaseModel.view( 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.view ).toHaveBeenCalledWith( 123, { "a": "A" }, Member );
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
//         let a = BaseModel.add( { "b": "B" }, { "a": "A" }, Member );
//
//         // assert
//         expect( RestApi.add ).toHaveBeenCalledWith( { "b": "B" }, { "a": "A" }, Member );
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
//         let a = BaseModel.add( { "b": "B" }, { "a": "A" } );
//
//         // assert
//         expect( RestApi.add ).toHaveBeenCalledWith( { "b": "B" }, { "a": "A" }, Member );
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
//         // prepareBaseModelt ).toHaveBeenCalledWith( 123, { "b": "B" }, { "a": "A" }, Member );
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
//         let a = BaseModel.edit( 123, { "b": "B" }, { "a": "A" } );
//
//         // assert
//         expect( RestApi.edit ).toHaveBeenCalledWith( 123, { "b": "B" }, { "a": "A" }, Member );
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
//         let a = BaseModel.delete( 123, { "a": "A" }, Member );
//
//         // assert
//         expect( RestApi.delete ).toHaveBeenCalledWith( 123, { "a": "A" }, Member );
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
//         let a = BaseModel.delete( 123, { "a": "A" } );
//
//         // assert
//         expect( RestApi.delete ).toHaveBeenCalledWith( 123, { "a": "A" }, Member );
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
//         let a = BaseModel.request( { "a": "A" }, Member );
//
//         // assert
//         expect( RestApi.request ).toHaveBeenCalledWith( { "a": "A" }, Member );
//     });
// });
