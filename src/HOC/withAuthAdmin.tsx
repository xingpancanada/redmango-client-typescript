//higher order component
import jwt_decode from "jwt-decode";
import { SD_Roles } from "../Utility/SD";

const withAuthAdmin = (WrappedComponent: any) => {
  return (props: any) => {
    //console.log('withAuth HOC called');

    const accessToken = localStorage.getItem('redmangousertoken');
    if(!accessToken) {
      window.location.replace('/login');
      return null;
    }else{
      const decode: { role: string; } = jwt_decode(accessToken);
      if(decode.role !== SD_Roles.ADMIN){
        window.location.replace('/accessdenied');
        return null;
      }
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuthAdmin;