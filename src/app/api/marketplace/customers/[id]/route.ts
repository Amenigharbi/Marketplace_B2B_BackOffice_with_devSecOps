import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

import { corsHeaders } from "@/utils/cors";
import { supabase } from "@/libs/supabaseClient";

const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const customers = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!customers) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { message: "Customer retrieved successfully", customers },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const { id } = params;
    const formData = await req.formData();

    const existingCustomer = await prisma.customers.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return new NextResponse(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Handle file uploads
    const cinPhotoFile = formData.get("cinPhoto");
    const patentPhotoFile = formData.get("patentPhoto");

    let cinPhotoUrl = existingCustomer.cinPhoto;
    let patentPhotoUrl = existingCustomer.patentPhoto;

    const uploadFileToSupabase = async (file: any, prefix: string) => {
      if (!file || typeof file === "string") return null;

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type");
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${prefix}-${Date.now()}-${file.name.replace(
        /\s+/g,
        "-",
      )}`;
      const filePath = `customers/${id}/${filename}`;

      const { data, error } = await supabase.storage
        .from("customer-documents")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("customer-documents").getPublicUrl(filePath);

      return publicUrl;
    };

    const deleteFileFromSupabase = async (url: string) => {
      if (!url) return;

      try {
        // Extract file path from URL
        const pathStart = url.indexOf("customer-documents/");
        if (pathStart === -1) return;

        const filePath = url.substring(
          pathStart + "customer-documents/".length,
        );

        const { error } = await supabase.storage
          .from("customer-documents")
          .remove([filePath]);

        if (error) {
          console.error("Error deleting file from Supabase:", error);
        }
      } catch (err) {
        console.error("Error in deleteFileFromSupabase:", err);
      }
    };

    try {
      if (cinPhotoFile && cinPhotoFile instanceof File) {
        if (existingCustomer.cinPhoto) {
          try {
            await deleteFileFromSupabase(existingCustomer.cinPhoto);
          } catch (deleteError) {
            console.error("Failed to delete old CIN photo:", deleteError);
          }
        }

        const uploadedCinPhotoUrl = await uploadFileToSupabase(
          cinPhotoFile,
          "cin",
        );
        if (uploadedCinPhotoUrl) {
          cinPhotoUrl = uploadedCinPhotoUrl;
        } else {
          console.warn("CIN photo upload returned null URL");
        }
      }

      if (patentPhotoFile && patentPhotoFile instanceof File) {
        if (existingCustomer.patentPhoto) {
          try {
            await deleteFileFromSupabase(existingCustomer.patentPhoto);
          } catch (deleteError) {
            console.error("Failed to delete old patent photo:", deleteError);
          }
        }

        const uploadedPatentPhotoUrl = await uploadFileToSupabase(
          patentPhotoFile,
          "patent",
        );
        if (uploadedPatentPhotoUrl) {
          patentPhotoUrl = uploadedPatentPhotoUrl;
        } else {
          console.warn("Patent photo upload returned null URL");
        }
      }
    } catch (fileError) {
      console.error("File upload error:", fileError);
      return NextResponse.json(
        {
          error: "File upload failed",
          details:
            fileError instanceof Error ? fileError.message : "Unknown error",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const updateData: any = {
      firstName: (formData.get("firstName") as string) || undefined,
      lastName: (formData.get("lastName") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      telephone: (formData.get("telephone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      governorate: (formData.get("governorate") as string) || undefined,
      socialName: (formData.get("socialName") as string) || undefined,
      fiscalId: (formData.get("fiscalId") as string) || undefined,
      businessType: (formData.get("businessType") as string) || undefined,
      activity1: (formData.get("activity1") as string) || undefined,
      activity2: (formData.get("activity2") as string) || undefined,
      mRoleId: (formData.get("mRoleId") as string) || undefined,
      typePatente:
        (formData.get("typePatente") as "FORFAITAIRE" | "REELLE") || undefined,
      cinPhoto: cinPhotoUrl || undefined,
      patentPhoto: patentPhotoUrl || undefined,
    };

    // Only add password if it's provided
    const password = formData.get("password") as string;
    if (password) {
      updateData.password = await hash(password, 10);
    }

    // Handle isActive
    const isActive = formData.get("isActive");
    if (isActive !== null) {
      updateData.isActive = isActive === "true";
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await prisma.customers.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: existingCustomer.id },
        },
      });
      if (emailExists) {
        return new NextResponse(
          JSON.stringify({ error: "Email already exists" }),
          { status: 409, headers: corsHeaders },
        );
      }
    }

    const updatedCustomer = await prisma.customers.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Customer updated successfully", customer: updatedCustomer },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // First get customer to delete their files
    const customer = await prisma.customers.findUnique({
      where: { id },
    });

    if (customer) {
      // Delete files from Supabase
      const deleteFileFromSupabase = async (url: string) => {
        if (!url) return;

        try {
          // Extract file path from URL
          const pathStart = url.indexOf("customer-documents/");
          if (pathStart === -1) return;

          const filePath = url.substring(
            pathStart + "customer-documents/".length,
          );

          const { error } = await supabase.storage
            .from("customer-documents")
            .remove([filePath]);

          if (error) {
            console.error("Error deleting file from Supabase:", error);
          }
        } catch (err) {
          console.error("Error in deleteFileFromSupabase:", err);
        }
      };

      if (customer.cinPhoto) {
        await deleteFileFromSupabase(customer.cinPhoto);
      }

      if (customer.patentPhoto) {
        await deleteFileFromSupabase(customer.patentPhoto);
      }
    }

    // Then delete the customer record
    await prisma.customers.delete({ where: { id } });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}
