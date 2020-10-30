import React from 'react'
import { Redirect } from 'react-router-dom'
import SecureLS from 'secure-ls';
class ProtectedRoute extends React.Component {

    render() {
        var ls = new SecureLS()
        const Component = this.props.component;
        const isAuthenticated = ls.get('data');;

        // const token = isAuthenticated.token

        return isAuthenticated ? (

            <Component />
        ) : (

                <Redirect to={{ pathname: '/Login' }} />
            );
    }
}

export default ProtectedRoute;