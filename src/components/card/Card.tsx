import React, { useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { cardSize } from '@/constants/cardConfig';
import { KonvaEventObject } from 'konva/lib/Node';
import GameViewModel from '@/gameLogic/GameViewModel';
import { CardInfo } from '@/interface/card';

interface Props {
  imageUrl: string;
  x: number;
  y: number;
  isMine: boolean;
  gameViewModel?: GameViewModel;
  cardInfo?: CardInfo;
}

const Card = ({ imageUrl, x, y, isMine, gameViewModel, cardInfo }: Props) => {
  const [image] = useImage(imageUrl);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = React.useRef<Konva.Image>(null);

  const handleMouseEnter = () => {
    const node = imageRef.current;
    if (node) {
      node.to({
        y: y - 100,
        duration: 0.3,
      });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const node = imageRef.current;
    if (node) {
      node.to({
        x,
        y,
        duration: 0,
      });
    }
    setIsHovered(false);
  };

  const handleDragEnd = async (e: KonvaEventObject<DragEvent>) => {
    const node = imageRef.current;
    if (!cardInfo) return;
    if (e.target.attrs.y <= -260 && (await gameViewModel?.isCheckMyTurn())) {
      const isCorrectCard = gameViewModel?.playCard(cardInfo);

      if (!isCorrectCard && node) {
        node.to({
          x,
          y,
          duration: 0,
        });
      }
      return;
    }

    if (node) {
      node.to({
        x,
        y,
        duration: 0,
      });
    }
  };

  if (!isMine || !gameViewModel) {
    return (
      <Image
        x={x}
        y={y}
        image={image}
        width={cardSize.width}
        height={cardSize.height}
        stroke={isHovered ? `blue` : 'transparent'}
        strokeWidth={isHovered ? 5 : 0}
        cornerRadius={12}
        alt="카드 이미지"
      />
    );
  }
  return (
    <Image
      x={x}
      y={y}
      image={image}
      width={cardSize.width}
      height={cardSize.height}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      stroke={isHovered ? `blue` : 'transparent'}
      strokeWidth={isHovered ? 5 : 0}
      cornerRadius={12}
      ref={imageRef}
      onDragEnd={handleDragEnd}
      draggable
      alt="카드 이미지"
    />
  );
};

export default Card;
