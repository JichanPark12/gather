import { CardInfo } from '@/interface/card';

export const checkCorrectCard = (
  myCard: CardInfo,
  lastPlayCard: CardInfo | 'any',
  isAttack: boolean
): boolean => {
  if (lastPlayCard === 'any') return true;
  if (!lastPlayCard) return true;
  const myCardType = myCard.Card.type;
  const myCardNumber = myCard.Card.number;

  const lastPlayCardType = lastPlayCard.Card.type;
  const lastPlayCardNumber = lastPlayCard.Card.number;

  if (myCardType === 'joker' && myCardNumber === 'color') return true; //컬러조커면 무조건 ok

  if (myCardType === 'joker' && lastPlayCardType === 'joker' && myCardNumber === 'black')
    return false; // 흑백조커는 컬러조커를 못이긴다.

  if (
    myCardType === 'spade' &&
    myCardNumber === 'a' &&
    lastPlayCardType === 'joker' &&
    lastPlayCardNumber === 'black'
  )
    return true; //스페이드a는 블랙조커때 내는게 가능하다.

  if (myCardType === 'joker') return true; //이 외 모든 상황에서 조커는 낼수가있다.

  if (lastPlayCardType === 'joker') return false; //반대로 깔린게 조커라면 어떤카드를 내도 못이긴다.

  if (isAttack) {
    if (myCardNumber !== 'a' && lastPlayCardNumber === 'a') return false; //a카드끼리 방어 가능.
    if (
      lastPlayCardType === myCardType &&
      lastPlayCardNumber === '2' &&
      myCardNumber === 'a'
    )
      return true;
    if (lastPlayCardNumber === '2' && myCardNumber !== '2') return false; //2카드는 같은문양or 같거나 낮은 숫자로 방어 가능
  }

  if (myCardType === lastPlayCardType) return true; //카드의 타입이 똑같은지
  if (myCardNumber === lastPlayCardNumber) return true; //카드의 숫자가 똑같은지

  return false;
};

export const getAttackCount = (cardInfo: CardInfo) => {
  const { Card } = cardInfo;
  const { type, number } = Card;

  if (number === '2') return 2; //넘버2
  if ((number === 'a' && type === 'spade') || number === 'black') return 5; //블랙조커or스페이드a
  if (number === 'color') return 7; //칼라조커
  if (number === 'a') return 3; //a
  return 0; //그 외는 공격기능이 없다
};

export const getTurnCount = (cardInfo: CardInfo) => {
  const { Card } = cardInfo;
  const { number } = Card;

  if (number === 'k') return 0;
  if (number === 'j') return 0;
  return 1;
};
