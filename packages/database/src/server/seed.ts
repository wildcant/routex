import bcrypt from 'bcrypt';
import { generateHashFor, prisma } from '.';

import { Prisma, Role, Status } from '@prisma/client';

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
  {
    name: 'Joe Doe',
    email: 'joe@mail.com',
    role: Role.USER,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
    company: {
      connectOrCreate: {
        where: { name: 'Tigo' },
        create: {
          name: 'Tigo',
          hash: generateHashFor('Tigo')
        }
      }
    }
  }
];

(async () => {
  try {
    await Promise.all([
      ...DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email
          },
          update: {
            ...user
          },
          create: {
            ...user
          }
        })
      )
    ]);

    const transmissionLine = await prisma.transmissionLine.create({
      data: { color: '#2EC1B8' }
    });

    const transmissionLineId = transmissionLine.id;
    const poles = await Promise.all(
      [
        { lat: 11.194895, lng: -74.219052, transmissionLineId },
        { lat: 11.19501, lng: -74.21859, transmissionLineId },
        { lat: 11.195052, lng: -74.217936, transmissionLineId }
      ].map((pole) => prisma.pole.create({ data: pole }))
    );

    await prisma.line.createMany({
      data: [
        { transmissionLineId, startPoleId: poles[0].id, endPoleId: poles[1].id },
        { transmissionLineId, startPoleId: poles[1].id, endPoleId: poles[2].id }
      ]
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
