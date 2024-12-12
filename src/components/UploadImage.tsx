import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';

const UploadImage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function uploadImageFun(fileInput: HTMLInputElement): Promise<void> {
        const myHeaders = new Headers(); // 以下是扒接口获取的数据，不一定一直有效
        myHeaders.append('Cookie', 'PHPSESSID=221akbbndjobtlq5g3atjs4oml');

        const formdata = new FormData();
        if (fileInput.files && fileInput.files[0]) {
            formdata.append('source', fileInput.files[0], fileInput.files[0].name);
            formdata.append('auth_token', '4bb1e9df3477d415d82a6de33e086720ddf5d307');
            formdata.append('timestamp', '1733996385615');
            formdata.append('type', 'file');
            formdata.append('action', 'upload');

            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://zh-cn.imgbb.com/json', {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow',
                });

                const result = await response.json();

                if (response.ok) {
                    console.log(result);
                    setImageUrl(result.image.display_url);
                } else {
                    console.error('上传失败', result);
                    setError('上传失败，请重试');
                }
            } catch (error) {
                console.error('上传过程中出错:', error);
                setError('上传出错，请重试');
            } finally {
                setLoading(false);
            }
        } else {
            console.error('请选择tututu');
            setError('请选择tututu');
        }
    }

    const handleButtonClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            if (input.files) {
                uploadImageFun(input);
            }
        };
        input.click();
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : '上传图片'}
            </Button>

            {imageUrl && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">上传成功！查看图片：</Typography>
                    <img
                        src={imageUrl}
                        alt="上传的图片"
                        style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px' }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                        图片链接：<a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
                    </Typography>
                </Box>
            )}

            {error && (
                <Box sx={{ color: 'red', marginTop: 2 }}>
                    <Typography variant="body2">{error}</Typography>
                </Box>
            )}
        </div>
    );
};

export default UploadImage;
