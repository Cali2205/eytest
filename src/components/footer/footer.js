import React from 'react';
import './footer.scss';

export const Footer = ({ text = 'SAGSYSTEMS - Todos los derechos reservados.' }) => {
  return <footer className="footer">{`© ${new Date().getFullYear()} ${text}`}</footer>;
};
