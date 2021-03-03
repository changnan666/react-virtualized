import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Redirect} from 'react-router';
import {HashRouter, Route} from 'react-router-dom';

import styles from './Application.css';
import {generateRandomList} from './utils';

import ListExample from '../List/List.example';

const COMPONENT_EXAMPLES_MAP = {
  '/components/List': ListExample,
};

// HACK Generate arbitrary data for use in example components :)
const list = Immutable.List(generateRandomList());

export default class Application extends React.PureComponent {
  static childContextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    customElement: PropTypes.any,
    isScrollingCustomElement: PropTypes.bool.isRequired,
    setScrollingCustomElement: PropTypes.func,
  };

  state = {
    isScrollingCustomElement: false,
  };

  constructor(props) {
    super(props);
    this.setScrollingCustomElement = this.setScrollingCustomElement.bind(this);
  }

  setScrollingCustomElement(custom) {
    this.setState({isScrollingCustomElement: custom});
  }

  getChildContext() {
    const {customElement, isScrollingCustomElement} = this.state;
    return {
      list,
      customElement,
      isScrollingCustomElement,
      setScrollingCustomElement: this.setScrollingCustomElement,
    };
  }

  render() {
    const {isScrollingCustomElement} = this.state;
    const bodyStyle = isScrollingCustomElement
      ? styles.ScrollingBody
      : styles.Body;

    return (
      <HashRouter>
        <div className={styles.demo}>
          <div
            className={bodyStyle}
            ref={e => this.setState({customElement: e})}>
            <div className={styles.column}>
              {Object.keys(COMPONENT_EXAMPLES_MAP).map(route => (
                <Route
                  key={route}
                  path={route}
                  component={COMPONENT_EXAMPLES_MAP[route]}
                />
              ))}
              <Route
                exact
                path="/"
                render={() => <Redirect to="/components/List" />}
              />
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}
