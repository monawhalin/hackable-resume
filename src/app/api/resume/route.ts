import { NextResponse } from "next/server";
import resume from "@/content/resume.json";

export function GET() {
  return NextResponse.json(resume);
}
