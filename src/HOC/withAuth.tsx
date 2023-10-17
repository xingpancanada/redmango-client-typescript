//higher order component

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    //console.log('withAuth HOC called');

    const accessToken = localStorage.getItem('redmangousertoken');
    if(!accessToken) {
      window.location.replace('/login');
      return null;
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth;