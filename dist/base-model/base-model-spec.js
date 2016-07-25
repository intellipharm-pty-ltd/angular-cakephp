'use strict';

var _angularCakephp = require('../angular-cakephp');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('BaseModel', function () {

    beforeEach(function () {
        _angularCakephp.BaseModel.reset();
    });

    //---------------------------------------------------
    // new
    //---------------------------------------------------

    it('BaseModel.new should create a new object instance if no active record class is provided', function () {

        // call
        var a = _angularCakephp.BaseModel.new(null, { 'firstname': 'John' });

        // assert
        expect(a.firstname).toEqual('John');
        expect(a instanceof Object).toBeTruthy();
        expect(a instanceof _angularCakephp.ActiveRecord).toBeFalsy();
    });

    it('BaseModel.new should create a new instance of provided active record class', function () {

        // call
        var a = _angularCakephp.BaseModel.new(_angularCakephp.ActiveRecord, { 'firstname': 'John' });

        // assert
        expect(a.firstname).toEqual('John');
        expect(a instanceof _angularCakephp.ActiveRecord).toBeTruthy();

        // prepare

        var Member = function (_ActiveRecord) {
            _inherits(Member, _ActiveRecord);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // call


        var b = _angularCakephp.BaseModel.new(Member, { 'firstname': 'John', 'lastname': 'Smith' }, true);

        // assert
        expect(b.firstname).toEqual('John');
        expect(b instanceof Member).toBeTruthy();
    });

    it('BaseModel.new should not map data if so specified in provided active record class', function () {

        // prepare
        var Member = function (_ActiveRecord2) {
            _inherits(Member, _ActiveRecord2);

            function Member(data) {
                _classCallCheck(this, Member);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Member).call(this, data, Member, false));

                _this2.firstname = data.firstname;
                return _this2;
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // call


        var a = _angularCakephp.BaseModel.new(Member, { 'firstname': 'John', 'lastname': 'Smith' });

        // assert
        expect(a.firstname).toEqual('John');
        expect(a.lastname).toBeUndefined();
        expect(a instanceof Member).toBeTruthy();
    });

    //---------------------------------------------------
    // index
    //---------------------------------------------------

    it('BaseModel.index should call RestApi.index with provided config and active record class', function () {

        // prepare
        var Member = function (_ActiveRecord3) {
            _inherits(Member, _ActiveRecord3);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // spies


        spyOn(_angularCakephp.RestApi, 'index');

        // call
        var a = _angularCakephp.BaseModel.index(Member, { 'a': 'A' });

        // assert
        expect(_angularCakephp.RestApi.index).toHaveBeenCalledWith(Member, { 'a': 'A' });
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    it('BaseModel.view should throw an error if no id is provided', function () {

        // assert
        expect(function () {
            _angularCakephp.BaseModel.view();
        }).toThrow();
    });

    it('BaseModel.view should call RestApi.view with provided id, config and active record class', function () {

        // prepare
        var Member = function (_ActiveRecord4) {
            _inherits(Member, _ActiveRecord4);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // spies


        spyOn(_angularCakephp.RestApi, 'view');

        // call
        var a = _angularCakephp.BaseModel.view(Member, 123, { 'a': 'A' });

        // assert
        expect(_angularCakephp.RestApi.view).toHaveBeenCalledWith(Member, 123, { 'a': 'A' });
    });

    //---------------------------------------------------
    // add
    //---------------------------------------------------

    it('BaseModel.add should throw an error if no data is provided', function () {

        // assert
        expect(function () {
            _angularCakephp.BaseModel.add();
        }).toThrow();
    });

    it('BaseModel.add should call RestApi.add with provided active record class and config, and should append data to config', function () {

        // prepare
        var Member = function (_ActiveRecord5) {
            _inherits(Member, _ActiveRecord5);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // spies


        spyOn(_angularCakephp.RestApi, 'add');

        // call
        var data = { 'a': 'A' };
        var config = { 'b': 'B' };
        var a = _angularCakephp.BaseModel.add(Member, data, config);

        // assert
        var expected_config = {
            'b': 'B',
            'data': data
        };
        expect(_angularCakephp.RestApi.add).toHaveBeenCalledWith(Member, expected_config);
    });

    //---------------------------------------------------
    // edit
    //---------------------------------------------------

    it('BaseModel.edit should throw an error if no id is provided', function () {

        // assert
        expect(function () {
            _angularCakephp.BaseModel.edit(undefined, {});
        }).toThrow();
    });

    it('BaseModel.edit should throw an error if no data is provided', function () {

        // assert
        expect(function () {
            _angularCakephp.BaseModel.edit(123, undefined);
        }).toThrow();
    });

    it('BaseModel.edit should call RestApi.edit with provided id, config and active record class, id and should append data to config', function () {

        // prepare
        var Member = function (_ActiveRecord6) {
            _inherits(Member, _ActiveRecord6);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        _angularCakephp.BaseModel.activeRecordClass = Member;

        // spies
        spyOn(_angularCakephp.RestApi, 'edit');

        // call
        var data = { 'a': 'A' };
        var config = { 'b': 'B' };
        var a = _angularCakephp.BaseModel.edit(Member, 123, data, config);

        // assert
        var expected_config = {
            'b': 'B',
            'data': data
        };
        expect(_angularCakephp.RestApi.edit).toHaveBeenCalledWith(Member, 123, expected_config);
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    it('BaseModel.delete should throw an error if no id is provided', function () {

        // assert
        expect(function () {
            _angularCakephp.BaseModel.delete();
        }).toThrow();
    });

    it('BaseModel.delete should call RestApi.delete with provided id, config and active record class', function () {

        // prepare
        var Member = function (_ActiveRecord7) {
            _inherits(Member, _ActiveRecord7);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // spies


        spyOn(_angularCakephp.RestApi, 'delete');

        // call
        var a = _angularCakephp.BaseModel.delete(Member, 123, { 'a': 'A' });

        // assert
        expect(_angularCakephp.RestApi.delete).toHaveBeenCalledWith(Member, 123, { 'a': 'A' });
    });

    //---------------------------------------------------
    // request
    //---------------------------------------------------

    it('BaseModel.request should call RestApi.request with provided config and active record class', function () {

        // prepare
        var Member = function (_ActiveRecord8) {
            _inherits(Member, _ActiveRecord8);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // spies


        spyOn(_angularCakephp.RestApi, 'request');

        // call
        var a = _angularCakephp.BaseModel.request(Member, { 'a': 'A' });

        // assert
        expect(_angularCakephp.RestApi.request).toHaveBeenCalledWith(Member, { 'a': 'A' });
    });
});