import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { corsHeaders } from "@/utils/cors";
import { checkRateLimit } from "@/libs/rateLimit";
import { userLoginsTotal } from "@/libs/metrics";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mySec#####123456@@@@";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const rateLimitKey = `login:${
      req.headers.get("x-forwarded-for") || "127.0.0.1"
    }`;
    const { isAllowed } = await checkRateLimit(rateLimitKey);

    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ message: "Trop de tentatives. Réessayez plus tard." }),
        { status: 429, headers: corsHeaders },
      );
    }
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Phone and password are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // Validation du numéro tunisien
    const phoneNumber = parsePhoneNumberFromString(phone, "TN");
    if (!phoneNumber || !phoneNumber.isValid()) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Tunisian phone number" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const standardizedPhone = phoneNumber.format("E.164");
    const user = await prisma.customers.findFirst({
      where: {
        telephone: standardizedPhone,
      },
    });

    if (!user) {
      userLoginsTotal.inc({ result: "fail" });
      return new NextResponse(
        JSON.stringify({ message: "Invalid phone number or password" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password || "");

    if (!passwordMatch) {
      userLoginsTotal.inc({ result: "fail" });
      return new NextResponse(
        JSON.stringify({ message: "Invalid phone number or password" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // Si login réussi
    userLoginsTotal.inc({ result: "success" });

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.telephone,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephone: user.telephone,
      address: user.address,
      governorate: user.governorate,
      socialName: user.socialName,
      businessType: user.businessType,
      fiscalId: user.fiscalId,
      activity1: user.activity1,
      activity2: user.activity2,
      cinPhoto: user.cinPhoto,
      patentPhoto: user.patentPhoto,
      createdAt: user.created_at,
    };
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        token,
        user: userData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (err) {
    userLoginsTotal.inc({ result: "fail" });
    console.error("Login error:", err);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}
