import React from 'react'
import { withAuthAdmin } from '../HOC';

function AuthTestAdmin() {
  return (
    <div>This page can only be accessed if the role of logged in user is ADMIN</div>
  )
}

export default withAuthAdmin(AuthTestAdmin);