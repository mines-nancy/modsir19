import React from 'react';
import { MainAppBar } from './appBar/MainAppBar';

const Layout = ({ children }) => (
    <>
        <MainAppBar />
        {children}
    </>
);

export default Layout;
