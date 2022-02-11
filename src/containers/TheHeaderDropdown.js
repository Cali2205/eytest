import React, {useState,useEffect } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheHeaderDropdown = () => {

  const [email, setCorreo] = useState('');

  useEffect(() => {
        setCorreo(sessionStorage.getItem("correo"))
    }
  );

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    > 
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/foto_perfil.JPG'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>{email}</strong>
        
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />Perfil
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Cerrar Sesión
        </CDropdownItem>
        
        
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
