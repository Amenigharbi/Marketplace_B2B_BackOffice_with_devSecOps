import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { corsHeaders } from "@/utils/cors";
import { supabase } from "@/libs/supabaseClient";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Validation des fichiers obligatoires
    const cinPhotoFile = formData.get("cinPhoto");
    const patentPhotoFile = formData.get("patentPhoto");

    if (!cinPhotoFile || typeof cinPhotoFile === "string") {
      return new NextResponse(
        JSON.stringify({ error: "Photo CIN est obligatoire" }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (!patentPhotoFile || typeof patentPhotoFile === "string") {
      return new NextResponse(
        JSON.stringify({ error: "Photo patente est obligatoire" }),
        { status: 400, headers: corsHeaders },
      );
    }

    const handleFileUpload = async (
      file: FormDataEntryValue,
      folder: string,
    ) => {
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      const filename = `${Date.now()}-${(file as File).name.replace(
        /\s+/g,
        "-",
      )}`;

      const { data, error } = await supabase.storage
        .from("customer-documents")
        .upload(`${folder}/${filename}`, buffer, {
          contentType: (file as File).type,
          upsert: false,
        });

      if (error) {
        throw new Error(`File upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("customer-documents")
        .getPublicUrl(`${folder}/${filename}`);

      return publicUrlData.publicUrl;
    };

    const cinPhotoUrl = await handleFileUpload(cinPhotoFile, "cin-photos");
    const patentPhotoUrl = await handleFileUpload(
      patentPhotoFile,
      "patent-photos",
    );

    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("telephone")?.toString();
    const password = formData.get("password")?.toString();
    const governorate = formData.get("governorate")?.toString();
    const address = formData.get("address")?.toString();
    const fiscalId = formData.get("fiscalId")?.toString();
    const businessType = formData.get("businessType")?.toString();
    const activity1 = formData.get("activity1")?.toString();
    const typePatente = formData.get("typePatente")?.toString();

    const requiredFields = {
      firstName,
      lastName,
      email,
      phone,
      password,
      governorate,
      address,
      fiscalId,
      businessType,
      activity1,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return new NextResponse(
          JSON.stringify({ error: `${field} est obligatoire` }),
          { status: 400, headers: corsHeaders },
        );
      }
    }

    // Validation du numéro de téléphone
    const phoneNumber = parsePhoneNumberFromString(phone!, "TN");
    if (!phoneNumber?.isValid()) {
      return new NextResponse(
        JSON.stringify({ error: "Numéro de téléphone tunisien invalide" }),
        { status: 400, headers: corsHeaders },
      );
    }
    const standardizedPhone = phone!;

    // Vérification de l'unicité de l'email et du téléphone
    const existingEmail = await prisma.customers.findFirst({
      where: { email },
    });
    if (existingEmail) {
      return new NextResponse(
        JSON.stringify({ error: "Cet email existe déjà" }),
        { status: 409, headers: corsHeaders },
      );
    }

    const existingPhone = await prisma.customers.findFirst({
      where: { telephone: standardizedPhone },
    });
    if (existingPhone) {
      return new NextResponse(
        JSON.stringify({ error: "Ce numéro de téléphone existe déjà" }),
        { status: 409, headers: corsHeaders },
      );
    }

    // Création du client
    const newCustomer = await prisma.customers.create({
      data: {
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        telephone: standardizedPhone,
        password: await hash(password!, 10),
        governorate: governorate!,
        address: address!,
        fiscalId: fiscalId!,
        businessType: businessType!,
        activity1: activity1!,
        activity2: formData.get("activity2")?.toString() || null,
        socialName: formData.get("socialName")?.toString() || null,
        cinPhoto: cinPhotoUrl,
        patentPhoto: patentPhotoUrl,
        typePatente: (typePatente as "FORFAITAIRE" | "REELLE") || null,
        isActive: true,
        mRoleId: formData.get("mRoleId")?.toString() || null,
      },
    });

    const { password: _, ...customerWithoutPassword } = newCustomer;

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Compte créé avec succès",
        customer: customerWithoutPassword,
      }),
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Erreur interne du serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      { status: 500, headers: corsHeaders },
    );
  }
}
