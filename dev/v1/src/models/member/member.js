import { ActiveRecord } from 'dist/angular-cakephp';

/**
 * Class Member
 */
export default class Member extends ActiveRecord {

    get name() {
        return this.firstname + " " + this.surname;
    }

    get card_number() {
        var active_card = null;

        if (this.Card) {
            _.forEach(this.Card, function(Card) {
                if (Card.active) {
                    active_card = Card;
                    return;
                }
            });
        }

        if (active_card) {
            if (active_card.alias_card_number) {
                return active_card.alias_card_number;
            } else if (active_card.card_number) {
                return active_card.card_number;
            }
        }

        return '';
    }
}
