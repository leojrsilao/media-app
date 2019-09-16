import React, {useReducer, createContext} from 'react';
import jwtDecode from 'jwt-decode';

const initState = {
    user: null
}

if(localStorage.getItem('jwtToken')){
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))
    if(decodedToken.exp * 1000 < Date.now())//check if token is expired
    {
        localStorage.removeItem('jwtToken');

    }
    else
    {
        initState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

//reducer
function authReducer(state, action){
    switch(action.type){
        case 'Login':
            return{
                ...state,
                user: action.payload
            }
        case 'Logout': 
            return{
                ...state,
                user: null
            }
        default: return state;
    }
}

//auth provider

function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initState);

    function login(userData){
        localStorage.setItem("jwtToken", userData.token);
        dispatch({
            type: 'Login',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem("jwtToken");
        dispatch({
            type: 'Logout'
        })
    }

    return (
        <AuthContext.Provider value={{user: state.user, login, logout}} {...props} />
    )
}

export {AuthContext, AuthProvider}