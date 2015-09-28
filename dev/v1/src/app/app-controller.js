import Member from 'models/member/member';
import MemberModel from 'models/member/member-model';
import Store from 'models/store/store';
import User from 'models/user/user';
import { RestApi, BaseModel } from 'dist/angular-cakephp';
import HttpParamSerializer from 'modules/http/param-serializer/param-serializer';
import HTTPResponseTransformer from 'modules/http/response-transformer/response-transformer';
import pluralize from 'blakeembrey/pluralize';

import MarketingFilter from 'models/marketing-filter';
import MarketingFilterItem from 'models/marketing-filter-item';
import MarketingFilterItemValue from 'models/marketing-filter-item-value';

import credentials from './credentials.json!';

export default class AppController {

    constructor( $scope, $http ) {

        this.title = "Example V1";
        this.$http = $http;
        this.access_token = null;
        this.last_record = null;
    }

    showcaseNew() {

        // use Member active record ::: new Member instance method A
        let m1 = new Member( { firstname: "John", surname: "Singleton" } );
        let m2 = new Member( { firstname: "Jenny", surname: "Multiton" } );

        // use MemberModel ::: new Member instance method B
        let m3 = MemberModel.new( { firstname: "Keagan", surname: "Static" } );
        let m4 = MemberModel.new( { firstname: "Shantel", surname: "Dynamic" } );

        // use Store active record ::: new Store instance method A
        let s1 = new Store( { name: "Store One" } );
        let s2 = new Store( { name: "Store Two" } );

        // use BaseModel directly ::: new Store instance method B
        let s3 = BaseModel.new( { name: "Store Three" } ); // no Active Record
        let s4 = BaseModel.new( { name: "Store Four" }, Store );

        console.log( `m1: ${m1.name} (${m1.constructor.name})` );
        console.log( `m2: ${m2.name} (${m2.constructor.name})` );
        console.log( `m3: ${m3.name} (${m3.constructor.name})` );
        console.log( `m4: ${m4.name} (${m4.constructor.name})` );
        console.log( `s1: ${s1.name} (${s1.constructor.name})` );
        console.log( `s2: ${s2.name} (${s2.constructor.name})` );
        console.log( `s3: ${s3.name} (${s3.constructor.name})` );
        console.log( `s4: ${s4.name} (${s4.constructor.name})` );
    }

    prepareRestApi() {
        RestApi.reset();
        RestApi.http = this.$http;
        RestApi.hostname = credentials.hostname;
        RestApi.headers = {
            "X-AccessToken": this.access_token
        };
        RestApi.pathGenerator = pluralize;
    }

    showcaseAccessToken() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let request_config = {
            method: "POST",
            // hostname: credentials.hostname,
            path: "access_token",
            data: {
                username:   credentials.username,
                password:   credentials.password,
                app_id:     credentials.app_id,
            }
        };

        RestApi.request( null, request_config ).then(
            ( response ) => {
                this.access_token = response.access_token;
                console.log( response );
            }
        );
    }

    showcaseIndex() {

        this.prepareRestApi();

        let config = {
            // "headers": {
            //     "X-AccessToken": this.access_token
            // },
            "params": {
                "contain": [ "Message", { "Store": [ "Group", "StoreConfiguration" ] }]
            }
        };

        RestApi.paramSerializer = HttpParamSerializer.serialize;

        RestApi.index( User, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseIndexTransform() {

        this.prepareRestApi();

        RestApi.responseTransformer = HTTPResponseTrassociateClassesansformer.transform;

        let config = {
            "params": {
                "contain": [ "Message", { "Store": [ "Group", "StoreConfiguration" ] }]
            },
            "paramSerializer": HttpParamSerializer.serialize
        };

        RestApi.index( User, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseIndexAssociateTransform() {

        this.prepareRestApi();

        HTTPResponseTransformer.associateClasses = [ MarketingFilterItem, MarketingFilterItemValue ];
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let config = {
            "params": {
                "contain": { "MarketingFilterItem": [ "MarketingFilterItemValue" ] }
            }
        };

        RestApi.index( MarketingFilter, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseView() {

        this.prepareRestApi();

        let config = {
            "params": {
                "contain": [ "Message", { "Store": [ "Group", "StoreConfiguration" ] }]
            },
            "paramSerializer": HttpParamSerializer.serialize
        };

        RestApi.view( User, 123, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseViewTransform() {

        this.prepareRestApi();

        RestApi.responseTransformer = HTTPResponseTransformer.transform;

        let config = {
            "params": {
                "contain": [ "Message", { "Store": [ "Group", "StoreConfiguration" ] }]
            },
            "paramSerializer": HttpParamSerializer.serialize
        };

        RestApi.view( User, 123, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseAdd() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let config = {
            "params": {
                "contain": "User"
            }
        };

        let data = {
            "name": "New Store"
        };

        RestApi.add( Store, config, data ).then(
            ( response ) => {
                this.last_record = response;
                console.log( response );
            }
        );
    }

    showcaseEnumerations() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let request_config = {
            method: "GET",
            // hostname: credentials.hostname,
            sub_path: "enumerations"
        };

        RestApi.request( Store, request_config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseValidationValid() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let request_config = {
            method: "POST",
            sub_path: "validation",
            data: {
                "name": "New Store"
            }
        };

        RestApi.request( Store, request_config ).then(
            ( response ) => {
                console.log( "VALID" );
                console.log( response );
            },
            ( response ) => {
                console.log( "INVALID" );
                console.log( response );
            }
        );
    }

    showcaseValidationInvalid() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let request_config = {
            method: "POST",
            sub_path: "validation",
            data: {
                "address": "123 somewhere"
            }
        };

        RestApi.request( Store, request_config ).then(
            ( response ) => {
                console.log( "VALID" );
                console.log( response );
            },
            ( response ) => {
                console.log( "INVALID" );
                console.log( response );
            }
        );
    }

    showcaseEdit() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let config = {
            // "params": {
            //     "contain": "User"
            // }
        };

        let data = {
            "name": "New Store Changed"
        };

        RestApi.edit( Store, this.last_record.id, config, data ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    showcaseDelete() {

        this.prepareRestApi();
        RestApi.responseTransformer = HTTPResponseTransformer.transform;
        RestApi.paramSerializer = HttpParamSerializer.serialize;

        let config = {};

        RestApi.delete( Store, this.last_record.id, config ).then(
            ( response ) => {
                console.log( response );
            }
        );
    }

    getRecord() {
        return new Promise( ( resolve, reject ) => {

            this.prepareRestApi();
            RestApi.responseTransformer = HTTPResponseTransformer.transform;
            RestApi.paramSerializer = HttpParamSerializer.serialize;

            let data = {
                "name": "New Store",
                "client_id": 123
            };

            RestApi.add( Store, {}, data ).then(
                ( response ) => {
                    resolve( response );
                }
            );
        });
    }

    showcaseARView() {
        this.getRecord().then(
            ( response ) => {

                let store1 = response;

                store1.view().then(
                    ( response ) => {
                        console.log(response);
                    }
                );
            }
        );
    }

    showcaseARSave() {
        this.getRecord().then(
            ( response ) => {

                let store1 = response;

                store1.save().then(
                    ( response ) => {
                        console.log(response);
                    }
                );
            }
        );
    }

    showcaseARDelete() {
        this.getRecord().then(
            ( response ) => {

                let store1 = response;

                store1.delete().then(
                    ( response ) => {
                        console.log(response);
                    }
                );
            }
        );
    }
}

AppController.$inject = [ '$scope', '$http' ];
