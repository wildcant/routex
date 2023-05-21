import bcrypt from 'bcrypt';
import { generateHashFor, prisma } from '.';

import { Prisma, Role, Status, User } from '@prisma/client';

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
  },
  {
    name: 'Kurtis Weissnat',
    email: 'kurtis@mail.com',
    role: Role.USER,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
    company: {
      connectOrCreate: {
        where: { name: 'Movistar' },
        create: {
          name: 'Movistar',
          hash: generateHashFor('Movistar')
        }
      }
    }
  },
  {
    name: 'admin',
    email: 'admin@mail.com',
    role: Role.ADMIN,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
    company: {
      connectOrCreate: {
        where: { name: 'Routex' },
        create: {
          name: 'Routex',
          hash: generateHashFor('Routex')
        }
      }
    }
  }
];

(async () => {
  try {
    const [joe, kurtis] = await Promise.all([
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

    const addTransmissionLine = async (
      user: User,
      transmissionLineColor: string,
      polesData: { lat: number; lng: number }[]
    ) => {
      const transmissionLine = await prisma.transmissionLine.create({
        data: {
          color: transmissionLineColor,
          createdByUserId: user.id,
          updatedByUserId: user.id,
          companyId: user.companyId
        }
      });

      const transmissionLineId = transmissionLine.id;

      const poles = await Promise.all(
        polesData.map((pole) => prisma.pole.create({ data: { ...pole, transmissionLineId } }))
      );

      await prisma.line.createMany({
        data: [
          {
            transmissionLineId,
            startPoleId: poles[0].id,
            endPoleId: poles[1].id
          },
          {
            transmissionLineId,
            startPoleId: poles[1].id,
            endPoleId: poles[2].id
          }
        ]
      });
    };

    const joePoles = [
      { lat: 11.194895, lng: -74.219052 },
      { lat: 11.19501, lng: -74.21859 },
      { lat: 11.195052, lng: -74.217936 }
    ];

    const kurtisPoles = [
      { lat: 11.19287378865566, lng: -74.2185688018799 },
      { lat: 11.19272644189206, lng: -74.21966314315797 },
      { lat: 11.19320005622249, lng: -74.21972751617433 }
    ];

    await Promise.all([
      addTransmissionLine(joe, '#2EC1B8', joePoles),
      addTransmissionLine(kurtis, '#36FFA2', kurtisPoles)
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
