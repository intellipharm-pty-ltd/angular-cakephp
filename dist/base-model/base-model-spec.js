System.register(["../angular-cakephp"], function (_export) {
    "use strict";

    var RestApi, BaseModel, ActiveRecord;

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_angularCakephp) {
            RestApi = _angularCakephp.RestApi;
            BaseModel = _angularCakephp.BaseModel;
            ActiveRecord = _angularCakephp.ActiveRecord;
        }],
        execute: function () {

            describe("BaseModel", function () {

                beforeEach(function () {
                    BaseModel.reset();
                });

                //---------------------------------------------------
                // new
                //---------------------------------------------------

                it("BaseModel.new should create a new object instance if no active record class is provided", function () {

                    // call
                    var a = BaseModel["new"]({ "firstname": "John" });

                    // assert
                    expect(a.firstname).toEqual("John");
                    expect(a instanceof Object).toBeTruthy();
                    expect(a instanceof ActiveRecord).toBeFalsy();
                });

                it("BaseModel.new should create a new instance of provided active record class", function () {

                    // call
                    var a = BaseModel["new"]({ "firstname": "John" }, ActiveRecord);

                    // assert
                    expect(a.firstname).toEqual("John");
                    expect(a instanceof ActiveRecord).toBeTruthy();

                    // prepare

                    var Member = (function (_ActiveRecord) {
                        _inherits(Member, _ActiveRecord);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // call
                        return Member;
                    })(ActiveRecord);

                    var b = BaseModel["new"]({ "firstname": "John", "lastname": "Smith" }, Member, true);

                    // assert
                    expect(b.firstname).toEqual("John");
                    expect(b instanceof Member).toBeTruthy();
                });

                it("BaseModel.new should create a new instance of predefined active record class", function () {

                    // prepare
                    ActiveRecord.mapData = true;

                    var Member = (function (_ActiveRecord2) {
                        _inherits(Member, _ActiveRecord2);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // call
                    var a = BaseModel["new"]({ "firstname": "John" });

                    // assert
                    expect(a.firstname).toEqual("John");
                    expect(a instanceof Member).toBeTruthy();

                    // prepare

                    var NonMember = (function (_ActiveRecord3) {
                        _inherits(NonMember, _ActiveRecord3);

                        function NonMember() {
                            _classCallCheck(this, NonMember);

                            _get(Object.getPrototypeOf(NonMember.prototype), "constructor", this).apply(this, arguments);
                        }

                        return NonMember;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = NonMember;

                    // call
                    var b = BaseModel["new"]({ "firstname": "John" });

                    // assert
                    expect(b.firstname).toEqual("John");
                    expect(b instanceof NonMember).toBeTruthy();
                });

                it("BaseModel.new should not map data if so specified in provided active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord4) {
                        _inherits(Member, _ActiveRecord4);

                        function Member(data) {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).call(this, data, Member, false);
                            this.firstname = data.firstname;
                        }

                        // call
                        return Member;
                    })(ActiveRecord);

                    var a = BaseModel["new"]({ "firstname": "John", "lastname": "Smith" }, Member);

                    // assert
                    expect(a.firstname).toEqual("John");
                    expect(a.lastname).toBeUndefined();
                    expect(a instanceof Member).toBeTruthy();
                });

                //---------------------------------------------------
                // index
                //---------------------------------------------------

                it("BaseModel.index should call RestApi.index with provided config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord5) {
                        _inherits(Member, _ActiveRecord5);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // spies
                        return Member;
                    })(ActiveRecord);

                    spyOn(RestApi, "index");

                    // call
                    var a = BaseModel.index({ "a": "A" }, Member);

                    // assert
                    expect(RestApi.index).toHaveBeenCalledWith({ "a": "A" }, Member);
                });

                it("BaseModel.index should call RestApi.index with provided config and predefined active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord6) {
                        _inherits(Member, _ActiveRecord6);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "index");

                    // call
                    var a = BaseModel.index({ "a": "A" });

                    // assert
                    expect(RestApi.index).toHaveBeenCalledWith({ "a": "A" }, Member);
                });

                //---------------------------------------------------
                // view
                //---------------------------------------------------

                it("BaseModel.view should throw an error if no id is provided", function () {

                    // assert
                    expect(function () {
                        BaseModel.view();
                    }).toThrow();
                });

                it("BaseModel.view should call RestApi.view with provided id, config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord7) {
                        _inherits(Member, _ActiveRecord7);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // spies
                        return Member;
                    })(ActiveRecord);

                    spyOn(RestApi, "view");

                    // call
                    var a = BaseModel.view(123, { "a": "A" }, Member);

                    // assert
                    expect(RestApi.view).toHaveBeenCalledWith(123, { "a": "A" }, Member);
                });

                it("BaseModel.view should call RestApi.view with provided config and predefined active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord8) {
                        _inherits(Member, _ActiveRecord8);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "view");

                    // call
                    var a = BaseModel.view(123, { "a": "A" });

                    // assert
                    expect(RestApi.view).toHaveBeenCalledWith(123, { "a": "A" }, Member);
                });

                //---------------------------------------------------
                // add
                //---------------------------------------------------

                it("BaseModel.add should throw an error if no data is provided", function () {

                    // assert
                    expect(function () {
                        BaseModel.add();
                    }).toThrow();
                });

                it("BaseModel.add should call RestApi.add with provided id, config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord9) {
                        _inherits(Member, _ActiveRecord9);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // spies
                        return Member;
                    })(ActiveRecord);

                    spyOn(RestApi, "add");

                    // call
                    var data = { "a": "A" };
                    var config = { "b": "B" };
                    var a = BaseModel.add(data, config, Member);

                    // assert
                    expect(RestApi.add).toHaveBeenCalledWith(config, data, Member);
                });

                it("BaseModel.add should call RestApi.add with provided config and predefined active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord10) {
                        _inherits(Member, _ActiveRecord10);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "add");

                    // call
                    var data = { "a": "A" };
                    var config = { "b": "B" };
                    var a = BaseModel.add(data, config);

                    // assert
                    expect(RestApi.add).toHaveBeenCalledWith(config, data, Member);
                });

                //---------------------------------------------------
                // edit
                //---------------------------------------------------

                it("BaseModel.edit should throw an error if no id is provided", function () {

                    // assert
                    expect(function () {
                        BaseModel.edit(undefined, {});
                    }).toThrow();
                });

                it("BaseModel.edit should throw an error if no data is provided", function () {

                    // assert
                    expect(function () {
                        BaseModel.edit(123, undefined);
                    }).toThrow();
                });

                it("BaseModel.edit should call RestApi.edit with provided id, config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord11) {
                        _inherits(Member, _ActiveRecord11);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "edit");

                    // call
                    var data = { "a": "A" };
                    var config = { "b": "B" };
                    var a = BaseModel.edit(123, data, config, Member);

                    // assert
                    expect(RestApi.edit).toHaveBeenCalledWith(123, config, data, Member);
                });

                it("BaseModel.edit should call RestApi.edit with provided config and predefined active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord12) {
                        _inherits(Member, _ActiveRecord12);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "edit");

                    // call
                    var data = { "a": "A" };
                    var config = { "b": "B" };
                    var a = BaseModel.edit(123, data, config);

                    // assert
                    expect(RestApi.edit).toHaveBeenCalledWith(123, config, data, Member);
                });

                //---------------------------------------------------
                // delete
                //---------------------------------------------------

                it("BaseModel.delete should throw an error if no id is provided", function () {

                    // assert
                    expect(function () {
                        BaseModel["delete"]();
                    }).toThrow();
                });

                it("BaseModel.delete should call RestApi.delete with provided id, config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord13) {
                        _inherits(Member, _ActiveRecord13);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // spies
                        return Member;
                    })(ActiveRecord);

                    spyOn(RestApi, "delete");

                    // call
                    var a = BaseModel["delete"](123, { "a": "A" }, Member);

                    // assert
                    expect(RestApi["delete"]).toHaveBeenCalledWith(123, { "a": "A" }, Member);
                });

                it("BaseModel.delete should call RestApi.delete with provided config and predefined active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord14) {
                        _inherits(Member, _ActiveRecord14);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        return Member;
                    })(ActiveRecord);

                    BaseModel.activeRecordClass = Member;

                    // spies
                    spyOn(RestApi, "delete");

                    // call
                    var a = BaseModel["delete"](123, { "a": "A" });

                    // assert
                    expect(RestApi["delete"]).toHaveBeenCalledWith(123, { "a": "A" }, Member);
                });

                //---------------------------------------------------
                // request
                //---------------------------------------------------

                it("BaseModel.request should call RestApi.request with provided config and active record class", function () {

                    // prepare

                    var Member = (function (_ActiveRecord15) {
                        _inherits(Member, _ActiveRecord15);

                        function Member() {
                            _classCallCheck(this, Member);

                            _get(Object.getPrototypeOf(Member.prototype), "constructor", this).apply(this, arguments);
                        }

                        // spies
                        return Member;
                    })(ActiveRecord);

                    spyOn(RestApi, "request");

                    // call
                    var a = BaseModel.request({ "a": "A" }, Member);

                    // assert
                    expect(RestApi.request).toHaveBeenCalledWith({ "a": "A" }, Member);
                });
            });
        }
    };
});