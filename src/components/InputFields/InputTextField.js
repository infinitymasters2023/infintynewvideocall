import React from 'react';
const InputTextField = ({
    fieldName,
    value,
    placeholder,
    inputFieldRef,
    handleOnChange,
    handleKeyDown,
    handleOnBlur,
    handleOnFocus,
    maxLength,
    minLength,
    isDisabled,
    isReadOnly,
    labelName,
    isRequired
}) => {
    return (
        <>
            { labelName && <label className="block text-sm font-medium leading-6 text-gray-600">{labelName} {isRequired && <span className="text-red-500">*</span>}</label> }
            <input
                type="text"
                autoComplete="off"
                className={`py-2 px-2 block w-full border-gray-200 shadow-sm rounded-lg rounded-e-none text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-600 dark:focus:ring-gray-600 `}
                name={fieldName}
                placeholder={placeholder}
                ref={inputFieldRef}
                value={value}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                maxLength={maxLength}
                minLength={minLength}
                disabled={isDisabled}
                readOnly={isReadOnly}
                required={isRequired}
            />
        </>
    );
}

export default InputTextField