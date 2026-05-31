import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Chen",
      timezone: "America/New_York",
      bio: "Full-stack developer who loves teaching and learning.",
      skills: {
        create: [
          { type: "TEACH", tag: "react", description: "I can teach React fundamentals and hooks" },
          { type: "TEACH", tag: "typescript", description: "TypeScript for beginners" },
          { type: "LEARN", tag: "guitar", description: "Want to learn acoustic guitar basics" },
          { type: "LEARN", tag: "sourdough", description: "Beginner sourdough baking" },
        ],
      },
      availabilitySlots: {
        create: [
          { dayOfWeek: 1, startTime: "18:00", endTime: "21:00" },
          { dayOfWeek: 3, startTime: "18:00", endTime: "21:00" },
          { dayOfWeek: 5, startTime: "10:00", endTime: "14:00" },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob Martinez",
      timezone: "America/Chicago",
      bio: "Musician and home baker. Happy to share what I know.",
      skills: {
        create: [
          { type: "TEACH", tag: "guitar", description: "Acoustic guitar for beginners" },
          { type: "TEACH", tag: "sourdough", description: "Sourdough from starter to loaf" },
          { type: "TEACH", tag: "music-theory", description: "Basic music theory" },
          { type: "LEARN", tag: "react", description: "Want to learn web development" },
          { type: "LEARN", tag: "typescript", description: "TypeScript basics" },
        ],
      },
      availabilitySlots: {
        create: [
          { dayOfWeek: 2, startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: 4, startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
        ],
      },
    },
  });

  console.log("Seed complete:", {
    users: [user1.name, user2.name],
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
