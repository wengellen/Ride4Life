import io from "socket.io-client";
const endpoint = process.env.NODE_ENV !== "production" ? "http://localhost:7000" : `https://ride4lifer.herokuapp.com`

const socket = io(endpoint);
export default socket;
