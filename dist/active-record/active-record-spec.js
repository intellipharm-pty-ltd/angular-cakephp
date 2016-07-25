'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angularCakephp = require('../angular-cakephp');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http_mock = function http_mock() {
    return new Promise(function (resolve, reject) {
        resolve({});
    });
};

describe('ActiveRecord', function () {

    //---------------------------------------------------
    // map data
    //---------------------------------------------------

    it('mapData property should default to true', function () {

        // prepare
        var Member = function (_ActiveRecord) {
            _inherits(Member, _ActiveRecord);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member({});

        // assert
        expect(me.mapData).toBeTruthy();
    });

    it('should map data to specified properties only if ActiveRecord.mapData is set to false', function () {

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

        _angularCakephp.ActiveRecord.mapData = false;

        // call
        var me = new Member({ 'firstname': 'John', 'lastname': 'Smith' });

        // assert
        expect(me.firstname).toBe('John');
        expect(me.lastname).toBeUndefined();
    });

    it('should map data if ActiveRecord.mapData is set to true', function () {

        // prepare
        var Member = function (_ActiveRecord3) {
            _inherits(Member, _ActiveRecord3);

            function Member(data) {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).call(this, data, Member, true));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        // call


        var me = new Member({ 'firstname': 'John' });

        // assert
        expect(me.firstname).toBe('John');
    });

    //---------------------------------------------------
    // computed properties
    //---------------------------------------------------

    it('should return computed property', function () {

        // prepare
        var Member = function (_ActiveRecord4) {
            _inherits(Member, _ActiveRecord4);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            _createClass(Member, [{
                key: 'name',
                get: function get() {
                    return this.firstname + ' ' + this.lastname;
                }
            }]);

            return Member;
        }(_angularCakephp.ActiveRecord);

        _angularCakephp.ActiveRecord.mapData = true;

        // call
        var me = new Member({ 'firstname': 'John', 'lastname': 'Smith' });

        // assert
        expect(me.name).toBe('John Smith');
    });

    //---------------------------------------------------
    // model
    //---------------------------------------------------

    it('model property should default to BaseModel', function () {

        // prepare
        var Member = function (_ActiveRecord5) {
            _inherits(Member, _ActiveRecord5);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member({});

        // assert
        expect(me.model instanceof _angularCakephp.BaseModel.constructor).toBeTruthy();
    });

    //---------------------------------------------------
    // view
    //---------------------------------------------------

    it('view should throw an error if id is not set', function () {

        // prepare
        var Member = function (_ActiveRecord6) {
            _inherits(Member, _ActiveRecord6);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();

        // call & assert

        var error_message = null;

        try {
            var r = me.view();
        } catch (error) {
            error_message = error.message;
        }
        expect(error_message).toEqual(_angularCakephp.ActiveRecord.MESSAGE_VIEW_ERROR_NO_ID);
    });

    it('view should call model.view', function () {

        // prepare
        var Member = function (_ActiveRecord7) {
            _inherits(Member, _ActiveRecord7);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();
        me.id = 123;

        // spy
        spyOn(me.model, 'view');

        // call
        me.view();

        // assert
        expect(me.model.view).toHaveBeenCalledWith(me.constructor, 123, {});
    });

    //---------------------------------------------------
    // save
    //---------------------------------------------------

    it('save should call model.add if no id is set', function () {

        // prepare
        var Member = function (_ActiveRecord8) {
            _inherits(Member, _ActiveRecord8);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();

        // spy
        spyOn(me.model, 'add');

        // call
        me.save();

        // assert
        expect(me.model.add).toHaveBeenCalledWith(me.constructor, me, {});
    });

    it('save should call model.edit if id is set', function () {

        // prepare
        var Member = function (_ActiveRecord9) {
            _inherits(Member, _ActiveRecord9);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();
        me.id = 123;

        // spy
        spyOn(me.model, 'edit');

        // call
        me.save();

        // assert
        expect(me.model.edit).toHaveBeenCalledWith(me.constructor, 123, me, {});
    });

    //---------------------------------------------------
    // delete
    //---------------------------------------------------

    it('delete should throw an error if id is not set', function () {

        // prepare
        var Member = function (_ActiveRecord10) {
            _inherits(Member, _ActiveRecord10);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();

        var error_message = null;

        // call & assert

        try {
            var r = me.delete();
        } catch (error) {
            error_message = error.message;
        }
        expect(error_message).toEqual(_angularCakephp.ActiveRecord.MESSAGE_DELETE_ERROR_NO_ID);
    });

    it('delete should call model.delete', function () {

        // prepare
        var Member = function (_ActiveRecord11) {
            _inherits(Member, _ActiveRecord11);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();
        me.id = 123;

        // spy
        spyOn(me.model, 'delete');

        // call
        me.delete();

        // assert
        expect(me.model.delete).toHaveBeenCalledWith(me.constructor, 123, {});
    });

    //---------------------------------------------------
    // enumeration OR validation etc
    //---------------------------------------------------

    it('enumeration should call model.request', function () {

        // prepare
        var Member = function (_ActiveRecord12) {
            _inherits(Member, _ActiveRecord12);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            _createClass(Member, [{
                key: 'enumeration',
                value: function enumeration() {
                    var request_config = {
                        method: 'GET',
                        sub_path: 'enumeration'
                    };
                    return this.model.request(request_config);
                }
            }]);

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();

        // spy
        spyOn(me.model, 'request');

        // call
        me.enumeration();

        // assert
        expect(me.model.request).toHaveBeenCalledWith({
            method: 'GET',
            sub_path: 'enumeration'
        });
    });

    //---------------------------------------------------
    // validate
    //---------------------------------------------------

    it('validate should call http correctly', function () {

        _angularCakephp.RestApi.http = http_mock;
        _angularCakephp.RestApi.hostname = 'myhost/';
        _angularCakephp.RestApi.pathGenerator = function (ar) {
            return ar + 's';
        };

        // prepare

        var Member = function (_ActiveRecord13) {
            _inherits(Member, _ActiveRecord13);

            function Member() {
                _classCallCheck(this, Member);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(Member).apply(this, arguments));
            }

            _createClass(Member, [{
                key: 'validate',
                value: function validate() {
                    var request_config = {
                        method: 'GET',
                        sub_path: 'validation'
                    };
                    return this.model.request(this, request_config);
                }
            }]);

            return Member;
        }(_angularCakephp.ActiveRecord);

        var me = new Member();

        // spy
        spyOn(_angularCakephp.RestApi, 'http').and.returnValue(http_mock());

        // call
        me.validate();

        // assert
        var expeted_arg = {
            method: 'GET',
            headers: {},
            url: 'myhost/members/validation'
        };
        expect(_angularCakephp.RestApi.http).toHaveBeenCalledWith(expeted_arg);
    });
});