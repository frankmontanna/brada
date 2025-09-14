"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createUser,
  deleteUser,
  listUsers,
  updatePassword,
} from "@/lib/api/users";

import {
  ensureSessionOrLogout,
  getSessionUserRaw,
  logout,
} from "@/lib/auth/client";

type SessionUser = {
  id: string;
  username: string;
  role: "ADMIN" | "USER";
  name?: string | null;
};

type UserRow = {
  id: string;
  username: string;
  name?: string | null;
  role: "ADMIN" | "USER";
  active: boolean;
};

export default function Usuarios() {
  // sessão atual
  const [me, setMe] = useState<SessionUser | null>(null);

  // listagem
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // dialogs
  const [openChangePass, setOpenChangePass] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  // forms
  const [newPass, setNewPass] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [submittingPass, setSubmittingPass] = useState(false);

  const [createUserName, setCreateUserName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [showPass2, setShowPass2] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const isAdmin = useMemo(() => me?.role === "ADMIN", [me]);

  useEffect(() => {
    // se não tiver sessionStorage 'user', força logout (cura o “bug de ficar logado sem sessão”)
    ensureSessionOrLogout("/login");

    try {
      const raw = getSessionUserRaw();
      if (raw) setMe(JSON.parse(raw));
    } catch {
      // ignore
    }

    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await listUsers();
      setUsers(data as UserRow[]);
    } catch (e: any) {
      // se o backend respondeu 401/403, força um logout “limpo”
      const msg = String(e?.message ?? "");
      if (
        msg.includes("401") ||
        msg.includes("Não autenticado") ||
        msg.includes("Forbidden")
      ) {
        await logout("/login");
        return;
      }
      setErrorMsg("Falha ao carregar usuários");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    setSubmittingPass(true);
    try {
      await updatePassword(me.id, newPass);
      setNewPass("");
      setOpenChangePass(false);
      toast.success("Senha alterada com sucesso.");
    } catch (e: any) {
      toast.error("Não foi possível alterar a senha.");
      console.error(e);
    } finally {
      setSubmittingPass(false);
    }
  }

  async function onSubmitCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingCreate(true);
    try {
      await createUser({ username: createUserName, password: createPassword });
      setCreateUserName("");
      setCreatePassword("");
      setOpenCreate(false);
      toast.success("Usuário criado com sucesso.");
      await refresh();
    } catch (e: any) {
      const text = String(e?.message ?? "");
      if (text.includes("Username já está em uso") || text.includes("409")) {
        toast.error("Esse usuário já existe.");
      } else {
        toast.error("Não foi possível criar o usuário.");
      }
      console.error(e);
    } finally {
      setSubmittingCreate(false);
    }
  }

  async function onDeleteUser(id: string) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;
    try {
      await deleteUser(id);
      toast.success("Usuário excluído.");
      await refresh();
    } catch (e: any) {
      toast.error("Não foi possível excluir o usuário.");
      console.error(e);
    }
  }

  const roleLabel = (role: "ADMIN" | "USER") =>
    role === "ADMIN" ? "Administrador" : "Usuário";

  return (
    <div className="p-6">
      <div>
        <Label className="text-lg ">Seu usuário</Label>
        <div className="flex w-fit flex-col gap-3 ">
          <p className="mt-4">
            Usuário: <b>{me?.username ?? "—"}</b>
          </p>
          <p>
            Tipo: <b>{me?.role ?? "—"}</b>{" "}
          </p>

          {/* Trocar senha */}
          <Dialog open={openChangePass} onOpenChange={setOpenChangePass}>
            <DialogTrigger asChild>
              <Button disabled={!me}>Trocar senha</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={onSubmitChangePassword}>
                <DialogHeader>
                  <DialogTitle>Trocar senha</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="nova-senha">Nova senha</Label>
                    <div className="relative ">
                      <Input
                        id="nova-senha"
                        type={showPass1 ? "text" : "password"}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        minLength={8}
                        required
                      />
                      <IconEye
                        className="absolute cursor-pointer opacity-50 right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPass1((v) => !v)}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Voltar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={newPass.length < 8 || submittingPass}
                  >
                    {submittingPass ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <hr className="mt-4" />

        <Label className="text-lg mt-6 ">Usuários</Label>
        <div className="flex w-fit flex-col gap-3 ">
          {loading && <p className="mt-4 text-sm opacity-70">Carregando...</p>}
          {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Usuário</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Privilégio</TableHead>
                <TableHead>Ativo</TableHead>
                {isAdmin && <TableHead className="w-[160px]">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>{u.name ?? "—"}</TableCell>
                  <TableCell>{roleLabel(u.role)}</TableCell>
                  <TableCell>{u.active ? "Sim" : "Não"}</TableCell>
                  {isAdmin && (
                    <TableCell className="space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => onDeleteUser(u.id)}
                        disabled={me?.id === u.id}
                        title={
                          me?.id === u.id
                            ? "Você não pode excluir o próprio usuário"
                            : ""
                        }
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm opacity-70">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Criar novo usuário */}
      {isAdmin && (
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="blueVar mt-2">Criar novo usuário</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form className="mt-0" onSubmit={onSubmitCreateUser}>
              <DialogHeader>
                <DialogTitle>Criar usuário</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="novo-user">User</Label>
                  <Input
                    id="novo-user"
                    value={createUserName}
                    onChange={(e) => setCreateUserName(e.target.value)}
                    minLength={3}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="novo-pass">Senha</Label>
                  <div className="relative">
                    <Input
                      id="novo-pass"
                      type={showPass2 ? "text" : "password"}
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      minLength={8}
                      required
                    />
                    <IconEye
                      onClick={() => setShowPass2((v) => !v)}
                      className="absolute cursor-pointer opacity-50 right-2 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Voltar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    createUserName.length < 3 ||
                    createPassword.length < 8 ||
                    submittingCreate
                  }
                >
                  {submittingCreate ? "Criando..." : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
