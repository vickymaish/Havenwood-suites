import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Enquiries from "./view";

export default async function EnquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const mpesaTill = process.env.MPESA_TILL?.trim() ?? "";
  return <><h1 className="font-heading mb-5 text-4xl">Enquiries</h1><Enquiries mpesaTill={mpesaTill} /></>;
}
