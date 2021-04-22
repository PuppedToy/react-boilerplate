/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';

export function HomePage() {
  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div>
        <CenteredSection>
          <p>
            <FormattedMessage {...messages.startProjectHeader} />
          </p>
          <p>
            <FormattedMessage {...messages.startProjectMessage} />
          </p>
        </CenteredSection>
        <Section>
          <p>
            <FormattedMessage {...messages.trymeHeader} />
          </p>
        </Section>
      </div>
    </article>
  );
}

HomePage.propTypes = {};

export default memo(HomePage);
