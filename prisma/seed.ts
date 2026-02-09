// seed.ts
import fs from "fs";
import { PrismaClient } from "../generated/prisma";
import path from "path";

const prisma = new PrismaClient();

// async function seed() {
//   // Read the JSON file
//   const rootDir = process.cwd()
//   const filePath = path.join(rootDir, 'stickers_one.json');
//   const data = fs.readFileSync(filePath, 'utf-8');
//   const stickers = JSON.parse(data);

//   for (const sticker of stickers) {
//     try {
//       // Prepare sticker data
//       const stickerData = {
//         name: sticker.name,
//         description: sticker.description,
//         theme: sticker.theme,
//         isFree: sticker.is_free,
//         price: sticker.price,
//         artistName: sticker.artist_name,
//         stickers: {
//           create: sticker.stickers.map((item: any) => ({
//             name: item.name,
//             url: item.url,
//           })),
//         },
//         thumbnail: sticker.thumbnail,
//         // downloads: sticker.downloads,
//         createdDate: new Date(),
//         updatedDate: new Date(),
//         isSample: sticker.is_sample,
//       };

//       // Upsert sticker
//       await prisma.sticker.upsert({
//         where: { id: sticker.id },
//         update: stickerData,
//         create: stickerData,
//       });

//       console.log(`Seeded sticker ${sticker.name}`);
//     } catch (error) {
//       console.error(`Error seeding sticker ${sticker.name}:`, error);
//     }
//   }

//   console.log('Seeding completed');
// }

const rootDir = process.cwd();
const filePath = path.join(rootDir, "themepack.json");
const data = fs.readFileSync(filePath, "utf-8");
const ThemePacks = JSON.parse(data);

const USER_ID = "FSU243BHIHaGTy7w9ZlsnUB1X8KZZXac";
// async function seed() {
//   for (const [key, pack] of Object.entries(ThemePacks)) {
//     try {
//       // Upsert ThemePack and its stickers
//       await prisma.themePacks.upsert({
//         where: { key },
//         update: {
//           name: pack.name,
//           theme: pack.theme,
//           icon: pack.icon,
//           description: pack.description,
//           createdBy: USER_ID,
//           stickers: {
//             deleteMany: {}, // Clear old stickers
//             create: pack.stickers.map((sticker) => ({
//               name: sticker.name,
//               prompt: sticker.prompt,
//             })),
//           },
//         },
//         create: {
//           key,
//           name: pack.name,
//           theme: pack.theme,
//           icon: pack.icon,
//           description: pack.description,
//           createdBy: USER_ID,
//           stickers: {
//             create: pack.stickers.map((sticker) => ({
//               name: sticker.name,
//               prompt: sticker.prompt,
//             })),
//           },
//         },
//       });
//       console.log(`Seeded ThemePack: ${pack.name}`);
//     } catch (error) {
//       console.error(`Error seeding ThemePack ${pack.name}:`, error);
//     }
//   }
// }

// seed()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
