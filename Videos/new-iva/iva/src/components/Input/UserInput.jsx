import React, { useState } from 'react';
import styles from './Input.module.css';

const Input = ({placeholder,width,onInuptValue}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e) => {setInputValue(e.target.value);
    onInuptValue(e.target.value);
  }

  return (
    <div className={styles.container} style={{ width: width || '100%' }}>
      <div className={styles.entryarea}>
        <input
          type="text"
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <label
          className={`${styles.label} ${isFocused || inputValue ? styles.labelActive : ''}`}
        >
          {placeholder}
        </label>
      </div>
    </div>
  );
}

export default Input;
