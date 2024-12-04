import bs58 from 'bs58'
import nacl from 'tweetnacl'
import React, { useState, useEffect } from 'react';
import Utils from '../utils/utils';


const backedUrl = 'https://kline.npmcow.com'


const Login = () => {
    let wondow = window as any
    const [userProfile, setUserProfile] = useState<any>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedJson, setDecodedJson] = useState<string>('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const base64Data = urlParams.get('data');   //绑定x成功后会携带base64编码过后的用户信息json，查验code是否200，或者查验socialAccount这个数组字段中是否含有provider是twitter的项更为保险；400则表示绑定失败，具体再看msg
        const cleanedBase64Data = base64Data ? base64Data.replace(/^"|"$/g, '') : '';
        const decodedData = Utils.decodeBase64(cleanedBase64Data);
        if (decodedData) {
            const formattedJson = Utils.formatJson(decodedData);
            setDecodedJson(formattedJson);
        }
    }, []);

    async function userLoginFun(walletAddress: string, message: string, signature: string) {
        const getNonceResp = await Utils.getNonce(backedUrl + '/post/kline/project/user/getNonce', walletAddress)
        const userLoginNonce = getNonceResp.data.nonce;
        console.log('用户的nonce is', userLoginNonce)

        const userLoginResp = await Utils.userLogin(backedUrl + '/post/kline/project/user/login', 'solana', walletAddress, message, signature, userLoginNonce)
        const userLoginToken = userLoginResp.data.jwtToken
        console.log('用户的token is', userLoginToken)

        localStorage.setItem('jwt-token', userLoginToken)
        setIsLoggedIn(true)
        console.log('ddsdd', userLoginResp.data)
        const formattedJson = Utils.formatJson(JSON.stringify(userLoginResp.data));
        setUserProfile(formattedJson);
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
            await userLoginFun(address, message, signature)
        } else {
            return alert('没有phantom')
        }
    }

    async function fuckTwitterLogin() {
        //绑定x需要传递给我jwt token来区分用户
        const jwtToken = localStorage.getItem('jwt-token')
        window.location.href = `https://kline.npmcow.com/get/kline/project/auth/x?jwtToken=${jwtToken}`
    }

    return (
        <>
            <p>几把登陆</p>
            <button onClick={fuckTwitterLogin}>twitter</button>
            <button onClick={fuckSolanaLogin}>solana phantom</button>



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
                        {/* <p>昵称:    {userProfile.nickname}</p>
                        <p>地址:    {userProfile.address}</p>
                        <p>简介:    {userProfile.bio}</p> */}
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