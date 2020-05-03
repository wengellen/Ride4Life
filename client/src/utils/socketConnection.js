import io from "socket.io-client";
import * as helper from "../utils/helpers";
const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`

let socketIo = null

export const getSocket = ()=>{
    return socketIo
}

export const socketInit = ()=>{
    const token = helper.getToken()
    const {username, role, id} = helper.getUser()
    
    socketIo = io.connect(`${endpoint}?token=${token}&username=${username}&role=${role}&id=${id}`,{
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
    });
    
    console.log('socketIo', socketIo.connected)
    
    socketIo.on('connect', () => {
        socketIo.emit('authentication', {
            token: token,
        })
        console.log( '!!!connected to server' );
    })
    
    
    socketIo.on('unauthorized', reason => {
        console.log('Unauthorized. Disconnecting:', reason)
        // error = reason.message
        alert(`${reason.message} - Disconnecting  `)
        socketIo.disconnect()
        // socketIo.
    })
    
    socketIo.on('disconnect', reason => {
        console.log(`Disconnected: ${ reason}`)
        // TODO: Log people out
    
        console.log( 'disconnected from server' );
        // error = null
    })
    
    socketIo.open()
    return socketIo
}
