import io from "socket.io-client";
const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`

let socketIo = null

export const getSocket = ()=>{
    return socketIo
}

export const socketInit = (token, username, role)=>{
    socketIo = io.connect(`${endpoint}?token=${"12345"}&username=${username}&role=${role}`);
    console.log('socketIo', socketIo.connected)
    return socketIo
}

//
// export default socket;
