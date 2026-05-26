import { NextRequest, NextResponse } from "next/server";
import { isCompleteUkrainianPhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { message: "Ім'я та телефон є обов'язковими полями" },
        { status: 400 }
      );
    }

    if (!isCompleteUkrainianPhone(String(body.phone))) {
      return NextResponse.json(
        { message: "Введіть коректний номер телефону" },
        { status: 400 }
      );
    }

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const source =
      typeof body.source === "string" && body.source.trim().length > 0
        ? body.source.trim()
        : "consultation-form";

    const leadPayload = {
      name: body.name,
      phone: body.phone,
      source,
    };

    const token = process.env.STRAPI_API_TOKEN;
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }

    // Try both payload shapes:
    // 1) plain object (custom endpoints/controllers)
    // 2) { data: ... } (default Strapi content API create format)
    const payloadVariants = [leadPayload, { data: leadPayload }];
    let lastErrorText = "";
    let lastStatus = 500;
    let sent = false;

    for (const payload of payloadVariants) {
      const upstream = await fetch(`${strapiBaseUrl}/api/leads`, {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(payload),
      });

      if (upstream.ok) {
        sent = true;
        break;
      }

      lastStatus = upstream.status;
      lastErrorText = await upstream.text();
    }

    if (!sent) {
      return NextResponse.json(
        {
          message:
            lastErrorText ||
            "Помилка відправки заявки в CRM. Спробуйте ще раз.",
          upstreamStatus: lastStatus,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message: "Ваше повідомлення успішно відправлено",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing consultation form:", error);
    return NextResponse.json(
      { message: "Помилка обробки запиту. Спробуйте ще раз." },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json(
    { message: "Consultation API endpoint is working" },
    { status: 200 }
  );
}
