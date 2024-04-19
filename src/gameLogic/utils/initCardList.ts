import { cardTypeList, cardNumberList } from '@/constants/cardConfig';
import { CardInfo } from '@/interface/card';

export const initCardList = () => {
  const cardList: CardInfo[] = cardTypeList
    .map((type): CardInfo[] =>
      cardNumberList.map((number) => {
        return {
          Card: {
            type,
            number,
          },
        };
      })
    )
    .flat();

  cardList.push({
    Card: { type: 'joker', number: 'black' },
  });
  cardList.push({
    Card: { type: 'joker', number: 'color' },
  });
  return cardList;
};
