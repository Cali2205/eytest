import React from 'react';
import './main-content.scss';

export const MainContent = ({ className = '', children }) => {
  return <section className={`main-content ${className}`}>{children}</section>;
};
