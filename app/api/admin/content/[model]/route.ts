import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { MODELS } from "@/lib/adminContent";
import type { ModelConfig } from "@/lib/adminContent";

type Context = { params: Promise<{ model: string }> };
type Row = Record<string, unknown>;

type Delegate = {
  findMany(args: object): Promise<Row[]>;
  create(args: { data: object }): Promise<object>;
  update(args: { where: { id: number }; data: object }): Promise<object>;
  delete(args: { where: { id: number } }): Promise<object>;
};

const delegates: Record<string, Delegate> = {
  siteText: prisma.siteText as unknown as Delegate,
  siteSetting: prisma.siteSetting as unknown as Delegate,
  navLink: prisma.navLink as unknown as Delegate,
  socialLink: prisma.socialLink as unknown as Delegate,
  hero: prisma.hero as unknown as Delegate,
  section: prisma.section as unknown as Delegate,
  sectionParagraph: prisma.sectionParagraph as unknown as Delegate,
  sectionItem: prisma.sectionItem as unknown as Delegate,
  rendangType: prisma.rendangType as unknown as Delegate,
  media: prisma.media as unknown as Delegate,
};

async function checkAdmin() {
  const session = await getSession();
  if (!session) {
    return Response.json({ message: "Login dulu woiiii!" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return Response.json({ message: "Lu member apa gimana?" }, { status: 403 });
  }
  return null;
}

async function findModel(context: Context) {
  const key = (await context.params).model;
  return MODELS.find((m) => m.key === key);
}

function cleanData(model: ModelConfig, body: Row, isNew: boolean): { data: Row; error: string | null } {
  const data: Row = {};

  for (const f of model.fields) {
    if (!isNew && f.locked) continue;
    const raw = body[f.name];
    if (!isNew && raw === undefined) continue;

    if (f.type === "bool") {
      data[f.name] = Boolean(raw);
      continue;
    }

    const text = raw === undefined || raw === null ? "" : String(raw).trim();

    if (text === "") {
      if (f.type === "upload" && !isNew) continue;
      if (!f.optional) return { data, error: `"${f.label}" wajib diisi.` };
      data[f.name] = null;
      continue;
    }

    if (f.type === "number" || f.type === "relation" || f.type === "image") {
      const n = Number(text);
      if (!Number.isInteger(n) || n < 0 || n > 2_000_000_000) {
        return { data, error: `"${f.label}" harus berupa bilangan bulat.` };
      }
      data[f.name] = n;
      continue;
    }

    if (f.type === "select" && !f.options?.includes(text)) {
      return { data, error: `Pilihan "${f.label}" Invalid.` };
    }

    data[f.name] = text;
  }

  return { data, error: null };
}

export async function GET(_request: Request, context: Context) {
  const denied = await checkAdmin();
  if (denied) return denied;

  const model = await findModel(context);
  if (!model) return Response.json({ message: "Not Found." }, { status: 404 });

  try {
    const include: Record<string, boolean> = {};
    for (const f of model.fields) {
      if (f.rel) include[f.rel] = true;
    }

    const rows = await delegates[model.key].findMany({
      orderBy: model.order.map((name) => ({ [name]: "asc" })),
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    const options: Record<string, { value: number; label: string }[]> = {};
    for (const f of model.fields) {
      if (f.type !== "relation") continue;
      const list = await delegates[f.to!].findMany({ orderBy: [{ id: "asc" }] });
      options[f.name] = list.map((r) => ({ value: Number(r.id), label: String(r[f.show!]) }));
    }

    return Response.json({ rows, options });
  } catch (err) {
    const detail = err instanceof Error ? err.message.split("\n").pop() : "";
    return Response.json({ message: "Database error: " + detail }, { status: 500 });
  }
}

export async function POST(request: Request, context: Context) {
  const denied = await checkAdmin();
  if (denied) return denied;

  const model = await findModel(context);
  if (!model) return Response.json({ message: "Not Found." }, { status: 404 });
  if (!model.canAdd) return Response.json({ message: "Bagian ini tidak bisa ditambah." }, { status: 403 });

  const { data, error } = cleanData(model, await request.json(), true);
  if (error) return Response.json({ message: error }, { status: 400 });

  try {
    const row = await delegates[model.key].create({ data });
    revalidatePath("/", "layout");
    return Response.json(row, { status: 201 });
  } catch {
    return Response.json(
      { message: "Gagal menyimpan. Data NotFound atau Value sama." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, context: Context) {
  const denied = await checkAdmin();
  if (denied) return denied;

  const model = await findModel(context);
  if (!model) return Response.json({ message: "Not Found." }, { status: 404 });

  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isInteger(id)) return Response.json({ message: "ID Invalid." }, { status: 400 });

  const { data, error } = cleanData(model, body, false);
  if (error) return Response.json({ message: error }, { status: 400 });

  try {
    const row = await delegates[model.key].update({ where: { id }, data });
    revalidatePath("/", "layout");
    return Response.json(row);
  } catch {
    return Response.json(
      { message: "Gagal menyimpan. Data NotFound atau Value sama." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, context: Context) {
  const denied = await checkAdmin();
  if (denied) return denied;

  const model = await findModel(context);
  if (!model) return Response.json({ message: "Not Found." }, { status: 404 });
  if (!model.canDelete) return Response.json({ message: "Bagian ini tidak bisa dihapus." }, { status: 403 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ message: "ID ivalid." }, { status: 400 });

  try {
    await delegates[model.key].delete({ where: { id } });
    revalidatePath("/", "layout");
    return Response.json({ message: "Data deleted." });
  } catch {
    return Response.json(
      { message: "Tidak bisa dihapus. Msh dipake bagian lain." },
      { status: 400 }
    );
  }
}