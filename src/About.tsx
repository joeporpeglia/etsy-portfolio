import React from 'react';
import { User } from './EtsyApi';
import styled from './styled';
import { animated, useSpring } from 'react-spring';

type Props = {
  user: User;
};

const Wrapper = styled(animated.div)`
  align-self: center;
  max-width: 540px;
  margin: 0 auto;
  line-height: 24px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.h1`
  margin-bottom: 18px;
`;

function About(props: Props) {
  const wrapperStyle = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(10%)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  });

  return (
    <Wrapper style={wrapperStyle}>
      <Name>
        {props.user.first_name} {props.user.last_name}
      </Name>
      {props.user.bio}
    </Wrapper>
  );
}

export default About;
