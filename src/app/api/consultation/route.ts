import { NextRequest, NextResponse } from "next/server";

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

    // Log the form data (in production, you would save this to a database)
    console.log("Consultation form submission:", {
      name: body.name,
      phone: body.phone,
      email: body.email || "Not provided",
      message: body.message || "Not provided",
      timestamp: new Date().toISOString(),
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM system
    // etc.

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
