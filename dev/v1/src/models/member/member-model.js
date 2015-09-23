import { BaseModel } from 'dist/angular-cakephp';
import Member from './member';

/**
 * Class MemberModel
 */
export default class MemberModel extends BaseModel {

   // static index( config, active_record_class = null ) {
   //     this.index( Member, config, active_record_class = null )
   // }

   static new( data ) {
       return super.new( data, Member );
   }
   static index( config ) {
       return super.index( config, this.activeRecordClass );
   }
}

// MemberModel.apiPath = "members";
MemberModel.activeRecordClass = Member;
