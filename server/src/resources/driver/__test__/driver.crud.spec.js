
import {Driver} from '../driver.model'
import {crud} from '../driver.crud'

describe('DRIVER crud', () => {
    describe('getUserById', () => {
        test('get user by object id', async () => {
            const user = await Driver.create({
                firstName: 'Tilly',
                lastName: 'Mills',
                phone: '123456',
                email: 'tg@gmail.com',
                username:'12345',
                password:'0000',
                city:'city'
            })
            const match = await crud.getUserById(user.id)
            
            expect(match.id).toBe(user.id)
        })
    })
    describe('getAllUsers', () => {
        test('get all users in the DB', async () => {
            const usersToCreate = [
                {
                    firstName: 'Tilly',
                    lastName: 'Mills',
                    phone: '123456',
                    email: 'username1@gmail.com',
                    username:'username1',
                    password:'0000',
                    city:'city'
                },
                {
                    firstName: 'Tilly',
                    lastName: 'Mills',
                    phone: '123456',
                    email: 'username3@gmail.com',
                    username:'username3',
                    password:'0000',
                    city:'city'
                },
                {
                    firstName: 'Tilly',
                    lastName: 'Mills',
                    phone: '123456',
                    email: 'username2@gmail.com',
                    username:'username2',
                    password:'0000',
                    city:'city'
                },
            ]
            const users = await Driver.create(usersToCreate)
            const matchedUsers = await crud.getAllUsers()
            
            expect(matchedUsers).toHaveLength(users.length)
        })
    })
    describe('createUser', () => {
        test('create a user', async () => {
            const userConfig =   {
                firstName: 'Tilly',
                lastName: 'Mills',
                phone: '123456',
                email: 'username2@gmail.com',
                username:'username2',
                password:'0000',
                city:'city'
            }
            const {id} = await crud.createUser(userConfig)
            const match = await Driver.findById(id).exec()
            expect(match.id).toBe(id)
        })
    })
    describe('removeUserById', () => {
        test('remove user by id', async () => {
            const {id} = await Driver.create({
                firstName: 'Tilly',
                    lastName: 'Mills',
                    phone: '123456',
                    email: 'username2@gmail.com',
                    username:'username2',
                    password:'0000',
                    city:'city'
            })
            await crud.removeUserById(id)
            
            const match = await Driver.findById(id).exec()
            expect(match).toBe(null)
        })
    })
    describe('updateUserById', () => {
        test('update user by id', async () => {
            const {id} = await Driver.create(
                {
                    firstName: 'Tilly',
                    lastName: 'Mills',
                    phone: '123456',
                    email: 'username2@gmail.com',
                    username:'username2',
                    password:'0000',
                    city:'city'
                })
            const user = await crud.updateUserById(id, {status: 'standby'})
            expect(user.id).toBe(id)
            expect(user.status).toBe('standby')
        })
    })
})
