import { getSession } from "../../../../lib/session";

export async function GET() {
    const session = await getSession();
    if (!session) return Response.json({ message: "Login dulu woy" }, { status: 401 });
    return Response.json(session);
}