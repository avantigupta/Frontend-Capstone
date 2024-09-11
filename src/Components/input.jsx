import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ label, value, onChange, type = 'text' }) => (
    <div className="input-group">
        <label>{label}</label>
        <input type={type} value={value} onChange={onChange} />
    </div>
);

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
};

export default Input;
