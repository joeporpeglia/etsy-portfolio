import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from './styled';
import { Shop, User } from './EtsyApi';
import { sectionUri } from './Uri';
import theme from './settings.json';
import { Switch, Route, Redirect } from 'react-router';
import SwipingCarousel from './SwipingCarousel';
import About from './About';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    color: ${theme.textColor};
    font-family: 'Raleway', Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
    color: ${theme.secondaryColor};

    &:not([class]) {
      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
`;

const Name = styled(Link)`
  color: ${theme.primaryColor};
  padding: 0 30px;
  font-size: 20px;

  @media (max-width: 800px) {
    padding: 0 20px;
  }
`;

const NavLink = styled(Link)`
  padding: 0 20px;
  text-decoration: none;
  transition: transform 0.1s ease-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(1);
  }

  @media (max-width: 800px) {
    padding: 0 10px;
  }
`;

const Navbar = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 60px;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;

  ${NavLink}, ${Name} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 800px) {
    height: 40px;
  }
`;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FeaturedWrapper = styled.div`
  flex: 1 1;
  background: ${theme.featuredBackgroundColor};
`;

const NavWrapper = styled.div`
  flex-shrink: 1;
  background: ${theme.navBackgroundColor};
`;

type AppProps = {
  shop: Shop;
  user: User;
};

function App(props: AppProps) {
  const { shop, user } = props;
  return (
    <ThemeProvider theme={theme}>
      <LayoutWrapper>
        <GlobalStyle />
        <FeaturedWrapper>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/about" />} />
            <Route path="/about" render={() => <About user={user} />} />
            {shop.Sections.map(section => (
              <Route
                key={section.shop_section_id}
                path={`/category/${section.shop_section_id}`}
                render={() => (
                  <SwipingCarousel
                    key={section.shop_section_id}
                    pages={shop.Listings.filter(
                      listing =>
                        listing.shop_section_id === section.shop_section_id
                    ).map(l => l.Images[0].url_fullxfull)}
                  />
                )}
              />
            ))}
          </Switch>
        </FeaturedWrapper>
        <NavWrapper>
          <Navbar>
            <Name to="/about">
              {user.first_name} {user.last_name}
            </Name>
            {shop.Sections.map(section => (
              <NavLink key={section.shop_section_id} to={sectionUri(section)}>
                {section.title}
              </NavLink>
            ))}
            <NavLink to="/about">About</NavLink>
          </Navbar>
        </NavWrapper>
      </LayoutWrapper>
    </ThemeProvider>
  );
}

export default App;
