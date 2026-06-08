import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSystemSettings, initializeData } from "@/lib/appointments";

const adminSessions = new Map<string, { expiresAt: number }>();

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
  try {
    initializeData();

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Şifre gerekli" },
        { status: 400 }
      );
    }

    const settings = getSystemSettings();
    if (!settings) {
      return NextResponse.json(
        { error: "Sistem başlatılmamış" },
        { status: 500 }
      );
    }

    // Compare password with hash
    const isValid = await bcrypt.compare(password, settings.adminPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: "Yanlış şifre" },
        { status: 401 }
      );
    }

    // Generate session token (valid for 24 hours)
    const token = generateSessionToken();
    adminSessions.set(token, {
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Admin login hatası:", error);
    return NextResponse.json(
      { error: "Login başarısız" },
      { status: 500 }
    );
  }
}
