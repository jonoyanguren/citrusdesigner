import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";

export async function GET() {
  try {
    const configs = await prisma.configuration.findMany();
    return NextResponse.json(configs);
  } catch (error) {
    console.error("Error in GET /api/configurations:", error);
    return NextResponse.json(
      { error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, description } = body;

    // Validate required fields
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Validate key format (only alphanumeric and underscores)
    if (!/^[A-Za-z0-9_]+$/.test(key)) {
      return NextResponse.json(
        {
          error: "Key can only contain alphanumeric characters and underscores",
        },
        { status: 400 }
      );
    }

    // Check if configuration already exists
    const existingConfig = await prisma.configuration.findUnique({
      where: { key },
    });

    if (existingConfig) {
      return NextResponse.json(
        { error: "Configuration with this key already exists" },
        { status: 409 }
      );
    }

    // Create new configuration
    const configuration = await prisma.configuration.create({
      data: {
        key,
        value,
        description,
      },
    });

    return NextResponse.json(configuration, { status: 201 });
  } catch (error) {
    console.error("Error creating configuration:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await verifyToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Validate key format (only alphanumeric and underscores)
    if (!/^[A-Za-z0-9_]+$/.test(key)) {
      return NextResponse.json(
        {
          error: "Key can only contain alphanumeric characters and underscores",
        },
        { status: 400 }
      );
    }

    const configuration = await prisma.configuration.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });

    return NextResponse.json(configuration);
  } catch (error) {
    console.error("Error updating configuration:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await verifyToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Configuration key is required" },
        { status: 400 }
      );
    }

    // Check if configuration exists
    const existingConfig = await prisma.configuration.findUnique({
      where: { key },
    });

    if (!existingConfig) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    // Delete configuration
    await prisma.configuration.delete({
      where: { key },
    });

    return NextResponse.json({ message: "Configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    return NextResponse.json(
      { error: "Failed to delete configuration" },
      { status: 500 }
    );
  }
}
