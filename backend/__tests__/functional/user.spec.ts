import request from 'supertest';
import { closeConnection, openConnection } from '../utils/connection';
import User, { IUserDocument } from '../../src/app/models/User';
import app from '../../src/app';
import factory from '../factories';

import { UserInterface, DistrictInterface } from '../../src/interfaces/base';

describe('User tests', () => {
  beforeAll(() => {
    openConnection();
  });
  afterAll(() => {
    closeConnection();
  });
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user', async () => {
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22 992726852', '22 992865120'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Cleiton',
      }),
    );
  });

  it('should create a user without phone', async () => {
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        // phone: ['22 992726852', '22 992865120'],
      });
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Cleiton',
      }),
    );
  });

  it('should create a user without address', async () => {
    // const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app).post('/users').send({
      name: 'Cleiton',
      username: 'cleitonbalonekr',
      password: '1231234',
      question: 'Qual o nome da sua mãe?',
      response: 'não sei',
      // address: [
      //   {
      //     district: distric._id,
      //     street: 'Encontro dos Rios',
      //     reference: 'Pousada encontro dos rios',
      //   },
      // ],
      // phone: ['22 992726852', '22 992865120'],
    });
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Cleiton',
      }),
    );
  });

  it('should not create a client with the same name and phone number', async () => {
    const district = await factory.create<DistrictInterface>('District');
    await factory.create<UserInterface>('User', {
      name: 'Cleiton',
      phone: ['22992865120', '22992726852'],
    });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        address: [
          {
            district: district._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22992865120', '22134123412'],
      });
    // console.log(response.body);
    expect(response.status).toBe(400);
  });

  it('should not create a admin user without auth user', async () => {
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        admin: true,
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22 992726852', '22 992865120'],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        admin: false,
      }),
    );
  });

  it('should create a admin user', async () => {
    const user = await factory.create<IUserDocument>('User', {
      admin: true,
    });
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        admin: true,
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22 992726852', '22 992865120'],
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        admin: true,
      }),
    );
  });

  it('should not create a admin user with auth user without admin privileges', async () => {
    const user = await factory.create<IUserDocument>('User', {
      admin: false,
    });
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        admin: true,
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22 992726852', '22 992865120'],
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        admin: false,
      }),
    );
  });

  it('should not create a should not create a user if the username already exists', async () => {
    const user = await factory.create<IUserDocument>('User', {
      admin: false,
      username: 'cleitonbalonekr',
    });
    const distric = await factory.create<DistrictInterface>('District');

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Cleiton',
        username: 'cleitonbalonekr',
        password: '1231234',
        question: 'Qual o nome da sua mãe?',
        response: 'não sei',
        admin: true,
        address: [
          {
            district: distric._id,
            street: 'Encontro dos Rios',
            reference: 'Pousada encontro dos rios',
          },
        ],
        phone: ['22 992726852', '22 992865120'],
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  // it('should update a client', async () => {
  //   const client = await factory.create<UserInterface>('Client');
  //   const distric = await factory.create<DistrictInterface>('District');
  //   const response = await request(app)
  //     .put(`/users/${client._id}`)
  //     .send({
  //       name: 'Cleiton',
  //       username: 'cleitonbalonekr',
  //       password: '1231234',
  //       question: 'Qual o nome da sua mãe?',
  //       response: 'não sei',
  //       address: [
  //         {
  //           district: distric._id,
  //           street: 'Estrada Serra Mar Encontro dos Rios',
  //           number: 0,
  //         },
  //       ],
  //       phone: ['22 992726852', '22 992865120'],
  //     });
  //   // console.log(response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       name: 'Cleiton',
  //     }),
  //   );
  // });

  // it('should update a client without phone number', async () => {
  //   const client = await factory.create<UserInterface>('Client');
  //   const distric = await factory.create<DistrictInterface>('District');
  //   // console.log('client no teste', client);
  //   const response = await request(app)
  //     .put(`/users/${client._id}`)
  //     .send({
  //       name: 'Cleiton',
  //       address: [
  //         {
  //           district: distric._id,
  //           street: 'Estrada Serra Mar Encontro dos Rios',
  //           number: 0,
  //         },
  //       ],
  //       // phone: ['22 992726852', '22 992865120'],
  //     });
  //   // console.log(response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       name: 'Cleiton',
  //     }),
  //   );
  // });

  // it('should update a client without address', async () => {
  //   const client = await factory.create<UserInterface>('Client');
  //   const distric = await factory.create<DistrictInterface>('District');
  //   // console.log('client no teste', client);
  //   const response = await request(app).put(`/users/${client._id}`).send({
  //     name: 'Cleiton',
  //     // address: [
  //     //   {
  //     //     district: distric._id,
  //     //     street: 'Estrada Serra Mar Encontro dos Rios',
  //     //     number: 0,
  //     //   },
  //     // ],
  //     // phone: ['22 992726852', '22 992865120'],
  //   });
  //   // console.log(response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       name: 'Cleiton',
  //     }),
  //   );
  // });

  // it('should not update an inexistent client', async () => {
  //   const client = await factory.create<UserInterface>('Client');

  //   const response = await request(app)
  //     .put(`/users/5f06fefdd0607c2cde1b9cc2`)
  //     .send({
  //       name: 'Cleiton',
  //       address: client.address,
  //       phone: ['22 992726852', '22 992865120 '],
  //     });

  //   expect(response.status).toBe(400);
  // });

  // it('should delete a client', async () => {
  //   const client = await factory.create<UserInterface>('Client');

  //   const response = await request(app).delete(`/users/${client._id}`);
  //   const countDocuments = await Client.find({}).countDocuments();
  //   expect(response.status).toBe(200);
  //   expect(countDocuments).toBe(0);
  // });

  // it('should list all clients', async () => {
  //   await factory.createMany<UserInterface>('Client', 4);
  //   await factory.create<UserInterface>('Client', {
  //     name: 'Cleiton',
  //   });

  //   const response = await request(app).get(`/users`);

  //   expect(response.status).toBe(200);

  //   expect(response.body).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         name: 'Cleiton',
  //       }),
  //     ]),
  //   );
  // });

  // it('should list all clients by name', async () => {
  //   await factory.createMany<UserInterface>('Client', 4);
  //   await factory.create<UserInterface>('Client', {
  //     name: 'Cleiton',
  //   });
  //   await factory.create<UserInterface>('Client', {
  //     name: 'jaõ',
  //   });

  //   const response = await request(app).get(`/users/cle`);

  //   expect(response.status).toBe(200);

  //   expect(response.body).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         name: 'Cleiton',
  //       }),
  //     ]),
  //   );
  // });

  // it('should list all clients by phone', async () => {
  //   await factory.createMany<UserInterface>('Client', 4);
  //   await factory.create<UserInterface>('Client', {
  //     name: 'Cleiton',
  //     phone: ['992865120', '992726852'],
  //   });
  //   await factory.create<UserInterface>('Client', {
  //     name: 'Jão Kleber',
  //   });

  //   const response = await request(app).get(`/users/99272`);

  //   expect(response.status).toBe(200);

  //   expect(response.body).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         name: 'Cleiton',
  //       }),
  //     ]),
  //   );
  // });
});
