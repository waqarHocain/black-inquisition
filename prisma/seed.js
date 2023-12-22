const db = require("../src/services/db");
const bcrypt = require("bcrypt");

(async () => {})();

const main = async () => {
  // delete previously stored data
  await db.user.deleteMany({});
  await db.reputalbeSource.deleteMany({});
  await db.job.deleteMany({});
  await db.application.deleteMany({});
  await db.post.deleteMany({});

  // store new data
  const users = [
    db.user.create({
      data: {
        email: "test@user.com",
        name: "kk skr",
        password: bcrypt.hashSync("test@user.com", 10),
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        role: "USER",
        verified: true, // won't require activation by admin
        posts: {
          create: {
            title: "Some random post",
            body: "<h2>One more title</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
    db.user.create({
      data: {
        email: "test@user2.com",
        name: "kk skr",
        password: bcrypt.hashSync("test@user2.com", 10),
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        role: "USER",
        verified: true, // won't require activation by admin
        posts: {
          create: {
            title: "Super Interesting post",
            body: "<h2>Sub title</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
    db.user.create({
      data: {
        email: "test@user3.com",
        name: "kk skr",
        password: bcrypt.hashSync("test@user3.com", 10),
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        role: "USER",
        verified: true, // won't require activation by admin
        posts: {
          create: {
            title: "One more post",
            body: "<h2>One more title</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
  ];

  const companies = [
    db.user.create({
      data: {
        email: "test@company.com",
        name: "CK Korp",
        password: bcrypt.hashSync("test@company.com", 10),
        phone: "+90123456789",
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        verified: true,
        role: "COMPANY",
        jobs: {
          create: {
            title: "Prisma dev",
            description:
              "Need some dev asap. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
            location: "Mars",
            company: "KKSKR",
            workplace: "hybrid",
            type: "temporary",
          },
        },
        posts: {
          create: {
            title: "Company post 3",
            body: "<h2>One more title</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
    db.user.create({
      data: {
        email: "test@company2.com",
        name: "CK Korp",
        password: bcrypt.hashSync("test@company2.com", 10),
        phone: "+90123456789",
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        verified: true,
        role: "COMPANY",
        jobs: {
          create: {
            title: "NullStack dev",
            description:
              "Need some dev asap. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
            location: "Mars",
            company: "KKSKR",
            workplace: "hybrid",
            type: "temporary",
          },
        },
        posts: {
          create: {
            title: "Company post 2",
            body: "<h2>One more title 2</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
    db.user.create({
      data: {
        email: "test@company3.com",
        name: "CK Korp",
        password: bcrypt.hashSync("test@company3.com", 10),
        phone: "+90123456789",
        bio: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software.",
        verified: true,
        role: "COMPANY",
        jobs: {
          create: {
            title: "Plumber required",
            description:
              "Need some dev asap. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
            location: "Mars",
            company: "KKSKR",
            workplace: "onSite",
            type: "internship",
          },
        },
        posts: {
          create: {
            title: "Company post",
            body: "<h2>One more title</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, eu tempor massa vulputate. Praesent iaculis velit libero, vel faucibus sem pulvinar vel. Curabitur viverra nisl dui, a venenatis felis pellentesque id. Donec non lacus diam.</p>",
          },
        },
      },
    }),
  ];

  await Promise.all([...users, ...companies]);
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
