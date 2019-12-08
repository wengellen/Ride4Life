import io from 'socket.io-client';
import http from 'http';
import sio from 'socket.io';
import * as logger from '../logger'
import {app} from '../server'
const ids = new Map()

describe('basic socket.io example', () => {
    
    let socket;
    let httpServer;
    let httpServerAddr;
    let ioServer;
    
    /**
     * Setup WS & HTTP servers
     */
    beforeAll(async() => {
        httpServer = http.createServer(app).listen(8000, ()=>{
            logger.debug(`httpServerAddr connect to 8000`)
        });
        
        httpServerAddr = httpServer.address(); //httpServer.listen().address();
        // logger.debug(`httpServerAddr`, httpServerAddr)
        
        ioServer = sio(httpServer);
    });
    
    /**
     *  Cleanup WS & HTTP servers
     */
    afterAll(async() => {
        await ioServer.close();
        await httpServer.close();
    });
    
    /**
     * Run before each test
     */
    beforeEach(async() => {
        // Setup
        // Do not hardcode server port and address, square brackets are used for IPv6
        socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
        });
        socket.on('connect', () => {
            logger.debug(`beforeEach connected`)
            
        });
    });
    
    /**
     * Run after each test
     */
    afterEach(async() => {
        // Cleanup
        if (socket.connected) {
            socket.disconnect();
        }
    });
    
    
    test('should communicate', async() => {
        // once connected, emit Hello World
        // logger.verbose(ioServer)
        
        await ioServer.emit('echo', 'Hello World');
        
        socket.once('echo', async(message) => {
            // Check that the message matches
            expect(message).toBe('Hello World');
        });
        ioServer.on('connection', async(mySocket) => {
            logger.debug(`ioServer - connection'`)
            expect(mySocket).toBeDefined();
        });
    });
    test('should communicate with waiting for socket.io handshakes', async() => {
        // Emit sth from Client do Server
        socket.emit('examlpe', 'some messages');
        // Use timeout to wait for socket.io server handshakes
        setTimeout(() => {
            // Put your server side expect() here
            socket.once('examlpe', async(message) => {
                // Check that the message matches
                expect(message).toBe('some messages');
            });
            // done();
        }, 50);
    });
    
});
