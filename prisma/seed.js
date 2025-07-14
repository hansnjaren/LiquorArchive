// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.bottle.createMany({
    data: [
      // --- WHISKY ---
      {
        name: "Ballantines Finest",
        category: "WHISKY",
        country: "Scotland",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Johnnie Walker Black Label",
        category: "WHISKY",
        country: "Scotland",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Royal Salute 21 Year Old",
        category: "WHISKY",
        country: "Scotland",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Glenfiddich 12 Year",
        category: "WHISKY",
        country: "Scotland",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },

      // --- WINE ---
      {
        name: "Jacobs Creek Shiraz Cabernet",
        category: "WINE",
        country: "Australia",
        volumeMl: 750,
        abv: 13.5,
        imageUrl: null,
      },
      {
        name: "Kendall Jackson Chardonnay",
        category: "WINE",
        country: "USA",
        volumeMl: 750,
        abv: 14.0,
        imageUrl: null,
      },
      {
        name: "Chateau Margaux 2015",
        category: "WINE",
        country: "France",
        volumeMl: 750,
        abv: 13.5,
        imageUrl: null,
      },
      {
        name: "Montes Alpha Cabernet",
        category: "WINE",
        country: "Chile",
        volumeMl: 750,
        abv: 14.5,
        imageUrl: null,
      },

      // --- BRANDY ---
      {
        name: "Hennessy VS",
        category: "BRANDY",
        country: "France",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Remy Martin VSOP",
        category: "BRANDY",
        country: "France",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Martell Cordon Bleu",
        category: "BRANDY",
        country: "France",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Courvoisier VS",
        category: "BRANDY",
        country: "France",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },

      // --- RUM ---
      {
        name: "Bacardi Carta Blanca",
        category: "RUM",
        country: "Puerto Rico",
        volumeMl: 700,
        abv: 37.5,
        imageUrl: null,
      },
      {
        name: "Captain Morgan Spiced",
        category: "RUM",
        country: "Jamaica",
        volumeMl: 700,
        abv: 35.0,
        imageUrl: null,
      },
      {
        name: "Havana Club 7 Years",
        category: "RUM",
        country: "Cuba",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },

      // --- TEQUILA ---
      {
        name: "Jose Cuervo Gold",
        category: "TEQUILA",
        country: "Mexico",
        volumeMl: 700,
        abv: 38.0,
        imageUrl: null,
      },
      {
        name: "Patron Silver",
        category: "TEQUILA",
        country: "Mexico",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Don Julio 1942",
        category: "TEQUILA",
        country: "Mexico",
        volumeMl: 700,
        abv: 38.0,
        imageUrl: null,
      },

      // --- SAKE ---
      {
        name: "Dassai 45",
        category: "SAKE",
        country: "Japan",
        volumeMl: 720,
        abv: 16.0,
        imageUrl: null,
      },
      {
        name: "Hakutsuru Junmai",
        category: "SAKE",
        country: "Japan",
        volumeMl: 720,
        abv: 15.0,
        imageUrl: null,
      },

      // --- TRADITIONAL (한국 고급 전통주) ---
      {
        name: "Andong Soju",
        category: "TRADITIONAL",
        country: "Korea",
        volumeMl: 360,
        abv: 45.0,
        imageUrl: null,
      },
      {
        name: "Gyodong Boksul",
        category: "TRADITIONAL",
        country: "Korea",
        volumeMl: 500,
        abv: 12.0,
        imageUrl: null,
      },
      {
        name: "Hansan Sogokju",
        category: "TRADITIONAL",
        country: "Korea",
        volumeMl: 500,
        abv: 17.0,
        imageUrl: null,
      },
      {
        name: "Igangju",
        category: "TRADITIONAL",
        country: "Korea",
        volumeMl: 375,
        abv: 19.0,
        imageUrl: null,
      },

      // --- CHINESE ---
      {
        name: "Kweichow Moutai",
        category: "CHINESE",
        country: "China",
        volumeMl: 500,
        abv: 53.0,
        imageUrl: null,
      },
      {
        name: "Wuliangye",
        category: "CHINESE",
        country: "China",
        volumeMl: 500,
        abv: 52.0,
        imageUrl: null,
      },

      // --- OTHER ---
      {
        name: "Absolut Vodka",
        category: "OTHER",
        country: "Sweden",
        volumeMl: 700,
        abv: 40.0,
        imageUrl: null,
      },
      {
        name: "Tanqueray Gin",
        category: "OTHER",
        country: "UK",
        volumeMl: 700,
        abv: 47.3,
        imageUrl: null,
      },
      {
        name: "Baileys Irish Cream",
        category: "OTHER",
        country: "Ireland",
        volumeMl: 700,
        abv: 17.0,
        imageUrl: null,
      },
    ],
    skipDuplicates: true,
  });
}

main().then(() => prisma.$disconnect());
