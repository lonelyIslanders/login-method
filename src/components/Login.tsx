import bs58 from 'bs58'
import React, { useState, useEffect } from 'react';
import Utils from '../utils/utils';

import { Button, TextField, Box } from '@mui/material';


const backedUrl = 'https://kline.npmcow.com'


const Login = () => {
    let wondow = window as any
    const [userProfile, setUserProfile] = useState<any>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedJson, setDecodedJson] = useState<string>('');

    const [bindEmailInputEmail, setBindEmailInputEmail] = useState('')
    const [bindEmailInputCode, setBindEmailInputCode] = useState('')
    const [bindEmailRequestCodeButtonDisabled, setBindEmailRequestCodeButtonDisabled] = useState<boolean>(false)
    const [bindEmailRequestCodeButtonSeconds, setBindEmailRequestCodeButtonSeconds] = useState(60)


    function handleBindEmailInputEmailChange(event: any) {
        setBindEmailInputEmail(event.target.value)
    }
    function handleBindEmailInputCodeChange(event: any) {
        setBindEmailInputCode(event.target.value)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const base64Data = urlParams.get('data');   //绑定x成功后会携带base64编码过后的用户信息json，查验code是否200，或者查验socialAccount这个数组字段中是否含有provider是twitter的项更为保险；400则表示绑定失败，具体再看msg
        const cleanedBase64Data = base64Data ? base64Data.replace(/^"|"$/g, '') : '';
        const decodedData = Utils.decodeBase64(cleanedBase64Data);
        if (decodedData) {
            const formattedJson = Utils.formatJson(decodedData);
            setDecodedJson(formattedJson);
        }



        let timer: any;
        if (bindEmailRequestCodeButtonDisabled && bindEmailRequestCodeButtonSeconds > 0) {
            timer = setInterval(() => {
                setBindEmailRequestCodeButtonSeconds((prev) => prev - 1);
            }, 1000);
        } else if (bindEmailRequestCodeButtonSeconds === 0) {
            clearInterval(timer);
            setBindEmailRequestCodeButtonDisabled(false);
        }
        return () => clearInterval(timer);
    }, [bindEmailRequestCodeButtonDisabled, bindEmailRequestCodeButtonSeconds]);

    //请求验证码按钮点击触发
    async function handleBindEmailRequestCodeButtonClick() {
        if (!bindEmailInputEmail) {
            alert('please input the email')
            return
        }
        setBindEmailRequestCodeButtonDisabled(true);
        await userRequestBindEmailCodeFun()
        setBindEmailRequestCodeButtonDisabled(true);
        setBindEmailRequestCodeButtonSeconds(60);
    };


    //用户钱包登陆
    async function userLoginFun(walletAddress: string, message: string, signature: string, chain: string) {
        const getNonceResp = await Utils.getNonce(backedUrl + '/post/kline/project/user/getNonce', walletAddress)
        const userLoginNonce = getNonceResp.data.nonce;
        console.log('用户的nonce is', userLoginNonce)

        const userLoginResp = await Utils.userLogin(backedUrl + '/post/kline/project/user/login', chain, walletAddress, message, signature, userLoginNonce)
        const userLoginToken = userLoginResp.data.jwtToken
        console.log('用户的token is', userLoginToken)

        localStorage.setItem('jwt-token', userLoginToken)
        setIsLoggedIn(true)
        console.log('ddsdd', userLoginResp.data)
        const formattedJson = Utils.formatJson(JSON.stringify(userLoginResp.data));
        setUserProfile(formattedJson);
    }

    //用户请求验证码
    async function userRequestBindEmailCodeFun() {
        const email = bindEmailInputEmail
        const userRequestBindEmailCodeResp = await Utils.getEmailCode(backedUrl + '/post/kline/project/auth/email/code', email)
        console.log(userRequestBindEmailCodeResp.code)
        if (userRequestBindEmailCodeResp.code !== 200) {
            setBindEmailRequestCodeButtonDisabled(false)
        }
    }

    async function fuckSolanaLogin() {
        if (wondow.solana && wondow.solana.isPhantom) {
            const wallet = await wondow.solana.connect()
            const address = wallet.publicKey.toBase58()
            const message = 'Hello word excel ppt'
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await wondow.solana.request({
                method: "signMessage",
                params: {
                    message: encodedMessage,
                    display: "utf8",
                },
            });
            const signature = bs58.encode(signedMessage.signature)
            console.log('用户solana钱包签名 is', signature)
            await userLoginFun(address, message, signature, 'solana')
        } else {
            return alert('没有phantom')
        }
    }

    async function fuckEvmLogin() {
        if (typeof wondow.ethereum === 'undefined') {
            alert("MetaMask未安装");
            return;
        }
        await wondow.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await wondow.ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];    //不一定选第一个
        const message = "Hello word excel ppt";

        const signature = await wondow.ethereum.request({
            method: 'personal_sign',
            params: [message, address],
        });
        console.log('用户evm钱包签名 is', signature)
        await userLoginFun(address, message, signature, 'evm')
    }

    async function fuckTwitterLogin() {
        //绑定x需要传递给我jwt token来区分用户
        const jwtToken = localStorage.getItem('jwt-token')
        window.location.href = `https://kline.npmcow.com/get/kline/project/auth/x?jwtToken=${jwtToken}`
    }


    return (
        <>


            <div style={{ padding: '20px' }}>

            </div>






            <p>几把登陆</p>
            <Button variant='contained' color='primary' onClick={fuckTwitterLogin}>推特绑定</Button>

            <Button onClick={fuckSolanaLogin}>solana</Button>

            <Button onClick={fuckEvmLogin}>evm</Button>



            <Box sx={{ padding: '20px' }}>
                <Box sx={{ marginBottom: '16px' }}>
                    <TextField
                        label='Email'
                        variant="outlined"
                        value={bindEmailInputEmail}
                        onChange={handleBindEmailInputEmailChange}
                        margin="normal"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            label='Code'
                            variant="outlined"
                            value={bindEmailInputCode}
                            onChange={handleBindEmailInputCodeChange}
                            margin="normal"
                        />
                    </Box>
                    <Box sx={{ width: 'auto' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBindEmailRequestCodeButtonClick}
                            disabled={bindEmailRequestCodeButtonDisabled}
                        >
                            {bindEmailRequestCodeButtonDisabled ? `请等待 ${bindEmailRequestCodeButtonSeconds}s` : '获取验证码'}
                        </Button>
                    </Box>
                </Box>
            </Box>







            <div>
                {isLoggedIn && (
                    <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
                        <h2>登录成功</h2>
                        {isLoggedIn && (
                            <pre style={{
                                backgroundColor: '#f4f4f4',
                                padding: '20px',
                                borderRadius: '5px',
                                textAlign: 'left',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                marginTop: '20px',
                            }}>
                                {userProfile}
                            </pre>
                        )}
                    </div>
                )}

                {decodedJson && (
                    <pre style={{
                        backgroundColor: '#f4f4f4',
                        padding: '20px',
                        borderRadius: '5px',
                        textAlign: 'left',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        marginTop: '20px',
                    }}>
                        {decodedJson}
                    </pre>
                )}
            </div >
        </>
    )
}


export default Login