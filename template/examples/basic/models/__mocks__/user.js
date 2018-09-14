const user = jest.genMockFromModule('../user');

user.getInfo = () => ({
    name: 'Jack',
    age: 35
});

export default user;
