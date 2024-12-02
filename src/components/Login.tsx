import bs58 from 'bs58'
import nacl from 'tweetnacl'


const Login = () => {
    async function fuckSolanaLogin() {
        let wondow = window as any
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
            console.log(signature)
        } else {
            alert('没有phantom')
        }
    }

    return (
        <>
            <p>几把登陆</p>
            <button onClick={fuckSolanaLogin}>solana phantom</button>
        </>
    )
}


export default Login