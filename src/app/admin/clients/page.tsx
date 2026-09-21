import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, tier, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {clients?.length ?? 0} compte{(clients?.length ?? 0) > 1 ? "s" : ""} enregistré
          {(clients?.length ?? 0) > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Palier</TableHead>
              <TableHead className="text-right">Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!clients || clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Aucun client pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">
                    <Link href={`/admin/clients/${client.id}`} className="block">
                      {client.full_name || "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Link href={`/admin/clients/${client.id}`} className="block">
                      {client.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.role === "admin" ? "default" : "secondary"}>
                      {client.role === "admin" ? "Admin" : "Élève"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.tier ?? "—"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(client.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
