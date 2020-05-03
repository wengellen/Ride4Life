import io from "socket.io-client";
import {getToken, getUser} from "../utils/helpers";
const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`

let socketIo = null

export const getSocket = ()=>{
    return socketIo
}

export const socketInit = ()=>{
    const token = getToken()
    const user = getUser()
    
    if (!user) {
        return
    }
    const {username, role, id} = getUser()
    socketIo = io.connect(`${endpoint}?token=${token}&username=${username}&role=${role}&id=${id}`,{
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
    });
    
    
    socketIo.on('connect', () => {
        socketIo.emit('authentication', {
            token: token,
        })
        console.log( '!!!connected to socket io server' );
    })
    
    // TODO - need to better handle errors and exceptions
    socketIo.on('unauthorized', reason => {
        console.log('Unauthorized. Disconnecting:', reason)
        alert(`${reason.message} - Disconnecting  `)
        socketIo.disconnect()
    })
    
    socketIo.on('disconnect', reason => {
        console.log(`Disconnected: ${ reason}`)
    })
    
    socketIo.open()
    return socketIo
}
