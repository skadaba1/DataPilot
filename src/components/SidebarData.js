import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from "react-icons/bs";

export const SidebarData = [
    {
        title: 'Landing',
        path: '/',
        icon: <FaIcons.FaFileCode />,
        cName: 'nav-text'
    },
    {
        title: 'Spreadsheet',
        path: '/spreadsheet',
        icon: <BsIcons.BsFillFileEarmarkSpreadsheetFill />,
        cName: 'nav-text'
    },
    {
        title: 'Datasets',
        path: '/datasets',
        icon: <BsIcons.BsDatabaseFillGear />,
        cName: 'nav-text'
    },
    {
        title: 'Sessions',
        path: '/sessions',
        icon: <BsIcons.BsFillCollectionFill />,
        cName: 'nav-text'
    }
];
