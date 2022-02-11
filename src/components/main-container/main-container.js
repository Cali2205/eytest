import React, { ReactNode } from 'react';
import { Footer } from '../footer/footer';
import './main-container.scss';
import {
  CDataTable,
  CBadge,
  CCol,
  CRow,
  CSelect,
  CInputGroup,
  CInput,
  CInputGroupAppend,
  CButton,
  CTooltip,
  CCard,
  CCardBody,
  CFormGroup,
  CCardHeader,
  CLabel,
  CContainer,
} from '@coreui/react'
// export class MainContainerProps {
//   className?: string;
//   children: ReactNode;
// }

export const MainContainer = ({ className = '', children }) => {
  return (
    <div>
      <main className={`main-container ${className}`}>
        <section>{children}</section>
      </main>
    </div>

  );
};
