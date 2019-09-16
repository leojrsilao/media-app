import React, {useContext, useState} from 'react';
import {Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth';


function Register(props){
    const [errors, setErrors] = useState({})
    const context = useContext(AuthContext);
    const {onChange, onSubmit, values} = useForm(registerUser, {
        username: '',
        password: '',
        confirmpw: '',
        email: ''
    })
    
    const [addUser, {loading}] = useMutation(register_user, {
        update(_, result){
            context.login(result.data.register);
            props.history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function registerUser(){
        addUser();
    }

    

    return (
        <div className="form-container">
            <Form onSubmit = {onSubmit} noValidate className= {loading ? 'loading' : ''}>
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    type="email"
                    error={errors.email ? true : false}
                    
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
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password.."
                    name="confirmpw"
                    value={values.confirmPw}
                    error={errors.confirmPw ? true : false}
                    onChange={onChange}
                    type="password"
                    
                />
                <Button type = "submit" color="black">
                    Register
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

const register_user = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmpw: String!
    )
    {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPw: $confirmpw
            }
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

export default Register;