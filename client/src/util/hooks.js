import {useState} from 'react';

export const useForm = (callback, initState = {}) => {
    const [values, setValues] = useState(initState);

    const onChange = (evt) => {
        setValues({...values, [evt.target.name]: evt.target.value});
    }

    const onSubmit = evt => {
        evt.preventDefault();
        callback(); 
    }

    return {
        onChange,
        onSubmit,
        values
    }
}