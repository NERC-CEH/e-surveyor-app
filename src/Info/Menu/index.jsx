import React from 'react';
import { Page, Header } from '@flumens';
import Main from './Main';

const MenuController = () => {
  return (
    <Page id="menu">
      <Header title="Menu" />
      <Main />
    </Page>
  );
};

export default MenuController;
