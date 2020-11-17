import React from 'react';
import { Route } from 'react-router-dom';
import appModel from 'appModel';
import savedSamples from 'savedSamples';
import Menu from './Menu';

const MenuWrap = () => <Menu appModel={appModel} savedSamples={savedSamples} />;

export default [
  <Route
    path="/settings/menu"
    key="/settings/menu"
    exact
    component={MenuWrap}
  />,
];
