import {
  Wilaya,
  PropertyTypes,
  ListingTypes,
  PropertieStatuses,
  FurnishingOptions,
  ParkingTypes,
  PreferredContactMethods,
} from "@prisma/client";

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WILAYAS_LIST: Wilaya[] = [
  Wilaya.alger,
  Wilaya.oran,
  Wilaya.constantine,
  Wilaya.bejaia,
  Wilaya.blida,
  Wilaya.setif,
  Wilaya.tlemcen,
  Wilaya.annaba,
  Wilaya.mostaganem,
  Wilaya.batna,
  Wilaya.tizi_ouzou,
  Wilaya.chlef,
  Wilaya.biskra,
  Wilaya.skikda,
  Wilaya.tipaza,
];

const EXTERIOR_HOUSES = [
  "/image/house1.jpg",
  "/image/house2.jpg",
  "/image/house3.jpg",
  "/image/house4.jpg",
  "/image/house5.jpg",
  "/image/house6.jpg",
  "/image/house7.jpg",
  "/image/house8.jpg",
];

const LOCAL_ROOMS = [
  "/image/livingroom.jpg",
  "/image/bedroom.jpg",
  "/image/kitchen.jpg",
  "/image/bathroom.jpg",
];

async function main() {
  await prisma.tour.deleteMany();
  await prisma.key_Features.deleteMany();
  await prisma.media.deleteMany();
  await prisma.property_Details.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user_Contact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.twoFactor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contacts.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: "Rahim",
      email: "rahimboubekeur00@gmail.com",
      emailVerified: true,
      role: "admin",
      location: "Alger",
      contactInfo: {
        create: {
          email: "rahimboubekeur00@gmail.com",
          phone: "+213 550 12 34 56",
          preferredContactMethod: PreferredContactMethods.email,
        },
      },
      accounts: {
        create: {
          id: "acc_1",
          accountId: "amine_acc",
          providerId: "credentials",
          password:
            "$2a$10$e836vI8Gv9U5X6Xw3pZ6e.y3u11S5H4mI/k5g2o1j9L8k7m6n5o4p",
          updatedAt: new Date(),
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Sarah Zerrouki",
      email: "sarah@example.com",
      emailVerified: true,
      role: "user",
      location: "Oran",
      contactInfo: {
        create: {
          email: "sarah@example.com",
          phone: "+213 661 98 76 54",
          preferredContactMethod: PreferredContactMethods.phone,
        },
      },
      accounts: {
        create: {
          id: "acc_2",
          accountId: "sarah_acc",
          providerId: "credentials",
          password:
            "$2a$10$e836vI8Gv9U5X6Xw3pZ6e.y3u11S5H4mI/k5g2o1j9L8k7m6n5o4p",
          updatedAt: new Date(),
        },
      },
    },
  });

  const users = [user1, user2];

  const agent1 = await prisma.agent.create({
    data: {
      name: "Karim Ziani",
      email: "karim.agent@realestate.dz",
      phone: "+213 555 11 22 33",
      location: "Alger",
      image: "/image/agent2.jpg",
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      name: "Lina Hadj",
      email: "lina.agent@realestate.dz",
      phone: "+213 770 44 55 66",
      location: "Oran",
      image: "/image/agent3.jpg",
    },
  });

  const agents = [agent1, agent2];

  const propertyTypesList = [
    PropertyTypes.apartment,
    PropertyTypes.singleFamily,
    PropertyTypes.townHouse,
    PropertyTypes.apartment,
    PropertyTypes.land,
  ];

  const createdProperties = [];

  for (let i = 0; i < 16; i++) {
    const currentWilaya = WILAYAS_LIST[i % WILAYAS_LIST.length];
    const seller = users[i % users.length];
    const propertyType = propertyTypesList[i % propertyTypesList.length];
    const listingType = i % 2 === 0 ? ListingTypes.sale : ListingTypes.rent;
    const price =
      listingType === ListingTypes.sale
        ? 12000000 + i * 1500000
        : 45000 + i * 5000;

    const houseExterior = EXTERIOR_HOUSES[i % EXTERIOR_HOUSES.length];
    const photos = [houseExterior, ...LOCAL_ROOMS];

    const property = await prisma.property.create({
      data: {
        name: `Modern Residence ${i + 1} - ${currentWilaya.toUpperCase()}`,
        wilaya: currentWilaya,
        price: price,
        propertyType: propertyType,
        address: `Street ${i + 10}, District ${i + 1}`,
        listingType: listingType,
        status: PropertieStatuses.active,
        seller_id: seller.id,
        Property_Details: {
          create: {
            bedRooms: (i % 4) + 1,
            bathRooms: (i % 3) + 1,
            builtYear: 2016 + (i % 8),
            areaSurface: 90 + i * 12,
            lotSize: 150 + i * 20,
            furnishing:
              i % 3 === 0
                ? FurnishingOptions.fullyFurnished
                : i % 3 === 1
                ? FurnishingOptions.semiFurnished
                : FurnishingOptions.unfurnished,
            parkingType:
              i % 2 === 0 ? ParkingTypes.garage : ParkingTypes.coveredParking,
            description: `High standing property located in the heart of ${currentWilaya}. Equipped with premium materials, great neighborhood, and immediate proximity to all transport services and school facilities.`,
          },
        },
        Media: {
          create: {
            photosSrcs: photos,
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        },
        Key_Features: {
          create: {
            airConditioning: true,
            petFriendly: i % 2 === 0,
            smartHomeFeatures: i % 3 === 0,
            inUnitLaundry: true,
            pool: i % 4 === 0,
            walkInClosets: true,
            balconyPatio: true,
            firePlace: i % 5 === 0,
            securitySystem: true,
          },
        },
      },
    });

    createdProperties.push(property);
  }

  await prisma.tour.create({
    data: {
      property_id: createdProperties[0].id,
      agent_id: agents[0].id,
      user_id: user2.id,
      scheduled_at: new Date(Date.now() + 86400000 * 2),
    },
  });

  await prisma.tour.create({
    data: {
      property_id: createdProperties[1].id,
      agent_id: agents[1].id,
      user_id: user1.id,
      scheduled_at: new Date(Date.now() + 86400000 * 5),
    },
  });

  await prisma.contacts.create({
    data: {
      name: "Riad Mahrez",
      email: "riad@example.com",
      phone: "+213 551 00 11 22",
      message:
        "Hello, I am interested in visiting the modern residence in Alger. Please contact me.",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });