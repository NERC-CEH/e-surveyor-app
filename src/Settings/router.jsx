import React from 'react';
import { Route } from 'react-router-dom';
import appModel from 'appModel';
import userModel from 'userModel';
import savedSamples from 'savedSamples';
import Menu from './Menu';

const MenuWrap = () => (
  <Menu appModel={appModel} savedSamples={savedSamples} userModel={userModel} />
);

export default [
  <Route
    path="/settings/menu"
    key="/settings/menu"
    exact
    component={MenuWrap}
  />,
];
