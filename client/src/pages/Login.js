import React, {useContext, useState} from 'react';
import {Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth'

function Login(props){
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({})
    
    const {onChange, onSubmit, values} = useForm(loginUserCallback, {
        username: '',
        password: ''
    })

    const [loginUser, {loading}] = useMutation(login_user, {
        update(_, result){
            context.login(result.data.login);
            props.history.push('/');

        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function loginUserCallback(){
        loginUser();
    }
    

    

    return (
        <div className="form-container">
            <Form onSubmit = {onSubmit} noValidate className= {loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    value={values.username}
                    onChange={onChange}
                    type="text"
                    error={errors.username ? true : false}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    value={values.password}
                    onChange={onChange}
                    type="password"
                    error={errors.password ? true : false}
                    
                />
                 
                <Button type = "submit" color="black">
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        { Object.values(errors).map( (value) => {
                            return <li key={value}>
                                      {value}
                                   </li>
                        })}
                    </ul>
                 </div>
            )}
        </div>
    )
}

const login_user = gql`
    mutation login(
        $username: String!
        $password: String!
    )
    {
        login(
              username: $username
              password: $password
        )
        {
            id
            email
            username
            created
            token
        }
    }
`;

export default Login;