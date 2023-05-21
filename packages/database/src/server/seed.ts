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

export const DEFAULT_TRANSMISSION_LINES: Prisma.TransmissionLineCreateInput[] = [
  {
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          id: 1,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.219009, 11.194263],
              [-74.219052, 11.194895]
            ]
          }
        },
        {
          id: 2,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.219052, 11.194895]
          }
        },
        {
          id: 3,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.219052, 11.194895],
              [-74.21859, 11.19501]
            ]
          }
        },
        {
          id: 4,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.21859, 11.19501]
          }
        },
        {
          id: 5,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.21859, 11.19501],
              [-74.217936, 11.195052]
            ]
          }
        },
        {
          id: 6,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-74.217936, 11.195052]
          }
        }
      ]
    },
    color: '#2EC1B8'
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
      ),
      ...DEFAULT_TRANSMISSION_LINES.map((transmissionLine) =>
        prisma.transmissionLine.create({ data: transmissionLine })
      )
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
