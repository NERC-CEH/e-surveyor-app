import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Menu from './Menu';
import MockupSurvey from './MockupSurvey';

export default [
  <Route path="/info/menu" key="/info/menu" exact component={Menu} />,
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route
    path="/info/mockup-survey"
    key="/info/mockup-survey"
    exact
    component={MockupSurvey}
  />,
];
