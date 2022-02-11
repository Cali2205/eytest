import { CCol, CRow } from '@coreui/react';
import React, { ReactNode } from 'react';
import { Footer } from '../footer/footer';

// export class MainContainerProps {
//   className?: string;
//   children: ReactNode;
// }

export const MainContainer = ({ className = '', children }) => {
  return (
    <main className={`main-container ${className}`}>
      <section>{children}</section>
    </main>
  );
};
