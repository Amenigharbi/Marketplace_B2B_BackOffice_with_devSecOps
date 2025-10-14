import fs from "fs";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

interface Supplier {
  manufacturer_id: string;
  code: string;
  company_name: string;
  contact_name?: string;
  phone_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  capital?: string;
  email?: string;
  tax_registration_number?: string;
  address?: string;
}

async function main() {
  const rawData = fs.readFileSync("public/data/suppliers.json", "utf-8");
  const { suppliers } = JSON.parse(rawData) as { suppliers: Supplier[] };

  for (const supplier of suppliers) {
    await prisma.manufacturer.upsert({
      where: { manufacturerId: parseInt(supplier.manufacturer_id) },

      update: {
        companyName: supplier.company_name,

        email: supplier.email?.replace(/,+$/, ""),
      },

      create: {
        manufacturerId: parseInt(supplier.manufacturer_id),
        code: supplier.code,
        companyName: supplier.company_name,
        contactName: supplier.contact_name,
        phoneNumber: supplier.phone_number,
        postalCode: supplier.postal_code?.trim(),
        city: supplier.city,
        country: supplier.country,
        capital: supplier.capital,
        email: supplier.email?.replace(/,+$/, ""),
        taxRegistrationNumber: supplier.tax_registration_number,
        address: supplier.address,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
