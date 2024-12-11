import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function CustomForm() {
    const [firstInput, setFirstInput] = useState('');
    const [secondInput, setSecondInput] = useState('');

    const handleFirstInputChange = (event: any) => {
        setFirstInput(event.target.value);
    };

    const handleSecondInputChange = (event: any) => {
        setSecondInput(event.target.value);
    };

    const handleButtonClick = () => {
        console.log('First Input:', firstInput);
        console.log('Second Input:', secondInput);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            {/* 第一行 */}
            <Box sx={{ marginBottom: '16px' }}>
                <TextField
                    label="First Input"
                    variant="outlined"
                    value={firstInput}
                    onChange={handleFirstInputChange}
                    sx={{ width: '100%' }}  // 第一行输入框占满整个容器宽度
                />
            </Box>

            {/* 第二行，使用 flexbox 布局 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Second Input"
                    variant="outlined"
                    value={secondInput}
                    onChange={handleSecondInputChange}
                    sx={{ flex: 1 }}  // 输入框占满剩余空间
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleButtonClick}
                    sx={{ height: '100%' }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

export default CustomForm;
