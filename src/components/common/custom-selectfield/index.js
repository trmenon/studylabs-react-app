import React, { useState, useEffect} from "react";
import PropTypes from 'prop-types';
import { v4 } from "uuid";

// Legacy Imports
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Constants
import { custom_select_designs } from "./designs";

const CustomSelect = (props)=> {
    // States
    const [state, setState] = useState({
        options: [],
        value: '',
        key: ''
    });
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const [key, setkey] = useState('');

    // Effects
    useEffect(()=> {
        try{
            async function fetchData() {
                if(typeof props?.populator === 'function') {
                    const dataList = await props?.populator();
                    setState({
                        ...state,
                        options: dataList,
                        value: props?.value || '',
                        key: v4()
                    })
                }
            }

            fetchData();
        }catch(err) {
            console.log('[ERROR] Mounting CustomSelect');
            console.log(err);
        }
    }, [props])

    // Event Handlers
    const handleChange = (event)=> {
        props.changeHandler({
            field: props?.name,
            value: event.target?.value
        })
    }

    // Renderer
    return(
        <React.Fragment>
            <TextField 
                key = {state?.key}
                variant = {'outlined'}
                label = {props?.label || ''}
                select = {true}
                InputLabelProps ={{transform: 'translate(14px, -9px) scale(1)'}}
                SelectProps = {{
                    MenuProps: {
                        PaperProps: {sx: {
                            margin: '16px 0px',
                            padding: '4px 2px',
                            overflow: 'auto',
                            maxHeight: '200px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px'
                        }}
                    }
                }}
                fullWidth = {true}
                disabled = {props?.disabled}
                error = {props?.error}
                helperText = {props?.helperText || ''}
                placeholder = {props?.placeholder || ''}
                value = {state?.value || ''}
                sx= {custom_select_designs}
                onChange = {handleChange}
            >
                {
                    state?.options.map((opt)=> {
                        return(
                            <MenuItem key = {opt.key} value={opt.value}>
                                {opt?.label}
                            </MenuItem>
                        )
                    })
                }
            </TextField>
        </React.Fragment>
    )
};

CustomSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    helperText: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    changeHandler: PropTypes.func.isRequired,
    populator: PropTypes.func.isRequired,
}
CustomSelect.defaultProps = {
    name: '',
    label: '',
    value: '',
    placeholder: '',
    helperText: '',
    disabled: false,
    error: false,
    changeHandler: ()=>{},
    populator: ()=> {},
}

export default CustomSelect;