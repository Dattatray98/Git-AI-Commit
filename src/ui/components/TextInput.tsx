import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

interface TextInputProps {
    label: string;
    onSubmit: (value: string) => void;
}

export const TextInput = ({ label, onSubmit }: TextInputProps) => {
    const [value, setValue] = useState('');

    useInput((input, key) => {
        if (key.return) {
            onSubmit(value);
            setValue('');
            return;
        }

        if (key.backspace || key.delete) {
            setValue(prev => prev.slice(0, -1));
            return;
        }

        if (input && !key.ctrl && !key.meta) {
            setValue(prev => prev + input);
        }

    });

    return (
        <Box flexDirection='row'>
            <Text color={'yellow'}>{label}</Text>
            <Text>{value}</Text>
        </Box>
    );
};