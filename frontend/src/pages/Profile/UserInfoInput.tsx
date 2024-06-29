import {Input} from "antd";
import React, {CSSProperties} from "react";

type UserInfoInputProps = {
    title: string;
    value: string;
    isEditing?: boolean;
    setValue?: (val: string) => void;
    type?: string;
};

function UserInfoInput({
                           title,
                           value,
                           setValue,
                           isEditing = false,
                           type = "text",
                       }: UserInfoInputProps) {
    const isInEditMode = !!(isEditing && setValue);

    const styles: { [key: string]: CSSProperties } = {
        userInfoInput: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0rem',
        },
        inputLabel: {
            marginRight: '1rem',
            width: '5rem',
            textAlign: 'right' as 'right',  // Casting to specific string
        },
        inputValue: {
            marginLeft: '0rem',
        },
        inputField: {
            marginLeft: '0rem',
            width: '13rem',
        },
    };

    return (
        <div style={styles.userInfoInput}>
            <p style={styles.inputLabel}>{title}:</p>
            {!isInEditMode ? (
                <p style={styles.inputValue}>{value}</p>
            ) : (
                <Input
                    type={type}
                    style={styles.inputField}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            )}
        </div>
    );
}

export default UserInfoInput;
