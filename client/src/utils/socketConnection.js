import io from "socket.io-client";
import * as helper from "../utils/helpers";
const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`

let socketIo = null

export const getSocket = ()=>{
    return socketIo
}

export const socketInit = ()=>{
    const token = helper.getToken()
    const {username, role, id} = helper.parseToken()
    
    socketIo = io.connect(`${endpoint}?token=${token}&username=${username}&role=${role}&id=${id}`);
    console.log('socketIo', socketIo.connected)
    return socketIo
}

//
// export default socket;
