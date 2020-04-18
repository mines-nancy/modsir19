import React from 'react';
import { MainAppBar } from './appBar/MainAppBar';

const Layout = ({ children }) => (
    <>
        <MainAppBar />
        <div style={{ paddingTop: 80 }}>{children}</div>
    </>
);

export default Layout;
