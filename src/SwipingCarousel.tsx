import { render } from 'react-dom';
import React, { useRef, useCallback } from 'react';
import clamp from 'lodash-es/clamp';
import { useSprings, animated } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import styled from './styled';

const CarouselWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const ItemWrapper = styled(animated.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 30px;
  left: 0;
  will-change: transform;
`;

const Item = styled(animated.div)`
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  will-change: transform;
`;

type Props = {
  pages: string[];
};

export default function SwipingCarousel(props: Props) {
  const { pages } = props;
  const index = useRef(0);
  const isDragging = useRef(false);
  const [springs, set] = useSprings(pages.length, (i: number) => ({
    x: i * window.innerWidth,
    sc: 1,
    display: 'block'
  }));
  const gestureHandlers = useGesture(
    ({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
      isDragging.current = distance > 0;
      if (cancel && down && distance > Math.min(window.innerWidth / 2, 200)) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        );
        cancel();
      }
      set((i: number) => {
        if (i < index.current - 1 && i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0);
        const sc = down ? 0.95 : 1;
        return { x, sc, display: 'block' };
      });
    }
  );
  const clickHandlers: any = {};
  clickHandlers.onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging.current) {
        return;
      }
      const screenQuarterLength = window.innerWidth / 4;

      if (e.clientX < screenQuarterLength) {
        index.current = Math.max(0, index.current - 1);
      } else if (e.clientX > screenQuarterLength * 3) {
        index.current = Math.min(pages.length - 1, index.current + 1);
      } else {
        return;
      }

      set((i: number) => {
        if (i < index.current - 1 && i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * window.innerWidth;
        return { x, sc: 1, display: 'block' };
      });
    },
    [isDragging.current, set]
  );
  return (
    <CarouselWrapper>
      {springs.map(({ x, display, sc }: any, i: number) => (
        <ItemWrapper
          {...('ontouchstart' in window ? gestureHandlers() : clickHandlers)}
          key={i}
          style={{
            display,
            // @ts-ignore
            transform: x.interpolate(x => `translate3d(${x}px,0,0)`)
          }}
        >
          <Item
            style={{
              // @ts-ignore
              transform: sc.interpolate(s => `scale(${s})`),
              backgroundImage: `url(${pages[i]})`
            }}
          />
        </ItemWrapper>
      ))}
    </CarouselWrapper>
  );
}
