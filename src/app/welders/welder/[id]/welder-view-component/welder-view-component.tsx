"use client";
import { Welder } from "@/app/types/welder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  BadgeCheck,
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  ListChecks,
  FileText,
  ArrowLeft,
  Pencil,
  Trash,
} from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import axios from "axios";

type Comment = {
  id: string;
  welder_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at?: string;
};

export function WelderViewComponent({ welder }: { welder: Partial<Welder> }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentTitle, setNewCommentTitle] = useState("");
  const [newCommentBody, setNewCommentBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingBody, setEditingBody] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!welder.id) return;
    setLoadingComments(true);
    axios
      .get(`/api/v1/comments?welder_id=${welder.id}`)
      .then((res) => setComments(res.data.data || []))
      .finally(() => setLoadingComments(false));
  }, [welder.id]);

  // Create comment
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentTitle.trim() || !newCommentBody.trim() || !welder.id) return;
    const res = await axios.post("/api/v1/comments", {
      welder_id: welder.id,
      title: newCommentTitle.trim(),
      body: newCommentBody.trim(),
    });
    setComments([res.data.data, ...comments]);
    setNewCommentTitle("");
    setNewCommentBody("");
  };

  // Edit comment
  const handleEditComment = (id: string, title: string, body: string) => {
    setEditingId(id);
    setEditingTitle(title);
    setEditingBody(body);
  };
  const handleSaveEdit = async (id: string) => {
    const res = await axios.put("/api/v1/comments", {
      id,
      title: editingTitle,
      body: editingBody,
    });
    setComments(
      comments.map((c) =>
        c.id === id
          ? {
              ...c,
              title: editingTitle,
              body: editingBody,
              updated_at: res.data.data.updated_at,
            }
          : c
      )
    );
    setEditingId(null);
    setEditingTitle("");
    setEditingBody("");
  };
  // Delete comment
  const handleDeleteComment = async (id: string) => {
    await axios.delete("/api/v1/comments", { data: { id } });
    setComments(comments.filter((c) => c.id !== id));
  };

  if (!welder) return null;

  const fullName = [
    welder.first_name,
    welder.middle_name,
    welder.paternal_last_name,
    welder.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  // Helper for date formatting
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`w-full min-h-[80vh] ${isMobile ? "px-1" : "px-0"}`}
    >
      <div
        className={`w-full flex items-center gap-2 mb-4 ${
          isMobile ? "px-1" : "px-0"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label="Volver"
        >
          <ArrowLeft className="size-5" />
        </Button>
        {welder.id && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => router.push(`/welders/edit/${welder.id}`)}
            aria-label="Editar"
          >
            <Pencil className="size-5" />
          </Button>
        )}
      </div>
      <div
        className={`grid ${
          isMobile ? "grid-cols-1" : "grid-cols-12 gap-6"
        } w-full max-w-6xl mx-auto`}
      >
        {/* Left: Personal, Address, Groups, Endorsements */}
        <div
          className={`${
            isMobile ? "col-span-1" : "col-span-4"
          } flex flex-col gap-6`}
        >
          {/* Personal Info */}
          <Card className="p-0">
            <CardHeader className="flex flex-col items-center gap-2 pt-6 pb-2">
              <Avatar className="size-20 mb-2 shadow-md">
                <AvatarFallback className="text-3xl bg-primary/20">
                  <User className="size-10 text-primary" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {fullName}
                {welder.is_active ? (
                  <Badge
                    variant="default"
                    className="flex items-center gap-1 bg-green-500/80 text-white"
                  >
                    <CheckCircle2 className="size-4" /> Activo
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <XCircle className="size-4" /> Inactivo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 items-start px-6 pb-6">
              <span className="flex items-center gap-2">
                <Mail className="size-4" /> {welder.email}
              </span>
              {welder.secondary_email && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" /> {welder.secondary_email}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Phone className="size-4" /> {welder.phone}
              </span>
              {welder.welder_id && (
                <span className="flex items-center gap-2">
                  <User className="size-4" /> AWS ID {welder.welder_id}
                </span>
              )}
            </CardContent>
          </Card>
          {/* Address */}
          {welder.address && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-1 pt-4">
                <MapPin className="size-5 text-primary" />
                <CardTitle className="text-lg">Dirección</CardTitle>
              </CardHeader>
              <CardContent className="ml-7 text-sm text-muted-foreground pb-4 pt-0">
                {welder.address.street} #{welder.address.number},{" "}
                {welder.address.city}, {welder.address.state},{" "}
                {welder.address.country} {welder.address.zip_code}
              </CardContent>
            </Card>
          )}
          {/* Groups - Redesigned */}
          {welder.groups && welder.groups.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-1 pt-4">
                <Users className="size-5 text-primary" />
                <CardTitle className="text-lg">Grupos</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 ml-2 mt-1 pb-4 pt-0">
                {welder.groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-4 rounded-lg p-4 shadow-sm border border-accent"
                  >
                    <div className="flex items-center justify-center bg-accent/30 rounded-full size-12">
                      <ListChecks className="size-7 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-lg text-foreground flex items-center gap-2">
                        {group.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(group.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {/* Endorsements - Redesigned */}
          {welder.endorsements && welder.endorsements.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-1 pt-4">
                <Award className="size-5 text-primary" />
                <CardTitle className="text-lg">Endorsements</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 ml-2 mt-1 pb-4 pt-0">
                {welder.endorsements.map((endorsement) => (
                  <div
                    key={endorsement.id}
                    className="flex items-center gap-4 rounded-lg p-4 shadow-sm border border-accent"
                  >
                    <div className="flex items-center justify-center bg-accent/30 rounded-full size-12">
                      <ShieldCheck className="size-7 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-lg text-foreground flex items-center gap-2">
                        {endorsement.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Actualizado: {formatDate(endorsement.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        {/* Right: Certifications (most important) - Redesigned */}
        <div
          className={`${
            isMobile ? "col-span-1 mt-6" : "col-span-8"
          } flex flex-col gap-6`}
        >
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center gap-2 pt-6 pb-2">
              <BadgeCheck className="size-6 text-primary" />
              <CardTitle className="text-2xl">Certificaciones</CardTitle>
            </CardHeader>
            <Separator className="mb-2" />
            <CardContent className="flex flex-col gap-6 pb-6">
              {welder.certifications && welder.certifications.length > 0 ? (
                welder.certifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <Card className="border shadow-md p-6 flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        {/* Left: Main Info */}
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            {cert.certification_primitive && (
                              <span className="flex items-center gap-2 font-bold text-lg">
                                <BadgeCheck className="size-5 text-blue-500" />
                                {cert.certification_primitive.name}
                                <span className="text-xs text-muted-foreground">
                                  ({cert.certification_primitive.type})
                                </span>
                              </span>
                            )}
                          </div>
                          <span className="flex items-center gap-2 text-base">
                            <Star className="size-5 text-yellow-500" />{" "}
                            <span className="font-semibold">Nivel:</span>{" "}
                            {cert.level}
                          </span>
                          <span className="flex items-center gap-2 text-base">
                            <FileText className="size-5 text-muted-foreground" />{" "}
                            #{cert.certification_id}
                          </span>
                        </div>
                      </div>
                      {cert.endorsements && cert.endorsements.length > 0 && (
                        <div className="mt-2">
                          <div className="font-semibold flex items-center gap-2 mb-1 text-base">
                            Endorsements
                          </div>
                          <div className="flex flex-col gap-3 mt-2">
                            {cert.endorsements.map((endorsement) => (
                              <div
                                key={endorsement.id}
                                className="flex flex-col gap-3 rounded-lg px-4 py-2 shadow-sm border border-muted-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Award className="size-4 text-foreground" />
                                  <span className="font-medium text-foreground">
                                    {endorsement.name}
                                  </span>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                  {formatDate(endorsement.created_at)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Right: Dates and Endorsements */}
                      <div
                        className={`flex flex-col gap-2 flex-1 mt-2 ${
                          isMobile ? "" : "justify-center"
                        }`}
                      >
                        {isMobile ? (
                          <>
                            <div className="flex items-center gap-2 text-base">
                              <Clock className="size-5 text-muted-foreground" />
                              <span className="font-semibold">Vigencia</span>
                            </div>
                            <div className="pl-7 text-base text-muted-foreground">
                              {formatDate(cert.start_date)} -{" "}
                              {formatDate(cert.end_date)}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-base">
                            <Clock className="size-5 text-muted-foreground" />
                            <span className="font-semibold">Vigencia:</span>
                            <span>
                              {formatDate(cert.start_date)} -{" "}
                              {formatDate(cert.end_date)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8 text-lg">
                  No hay certificaciones registradas.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Comments Section */}
      <div className="w-full max-w-6xl mx-auto mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-1 pt-4">
            <FileText className="size-5 text-primary" />
            <CardTitle className="text-lg">Comentarios</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form
              onSubmit={handleCreateComment}
              className="flex flex-col gap-2 items-start"
            >
              <input
                className="border rounded-md p-2 w-full text-sm"
                placeholder="Título"
                value={newCommentTitle}
                onChange={(e) => setNewCommentTitle(e.target.value)}
                required
                maxLength={100}
              />
              <textarea
                className="border rounded-md p-2 w-full min-h-[40px] text-sm"
                placeholder="Agregar un comentario..."
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                required
                maxLength={500}
              />
              <Button type="submit" variant="default" className="shrink-0">
                Agregar
              </Button>
            </form>
            {loadingComments ? (
              <div className="text-muted-foreground text-center py-4">
                Cargando comentarios...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-muted-foreground text-center py-4">
                No hay comentarios.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="relative border rounded-lg p-3 shadow-sm bg-background flex flex-col"
                  >
                    {/* Icon buttons top right */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {editingId === comment.id ? (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="default"
                                  onClick={() => handleSaveEdit(comment.id)}
                                  className="size-7"
                                >
                                  <CheckCircle2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Guardar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditingTitle("");
                                    setEditingBody("");
                                  }}
                                  className="size-7"
                                >
                                  <XCircle className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Cancelar</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  handleEditComment(
                                    comment.id,
                                    comment.title,
                                    comment.body
                                  )
                                }
                                className="size-7"
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="size-7"
                              >
                                <Trash className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex-1">
                      {editingId === comment.id ? (
                        <>
                          <input
                            className="border rounded-md p-2 w-full text-sm mb-1"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            maxLength={100}
                          />
                          <textarea
                            className="border rounded-md p-2 w-full min-h-[40px] text-sm"
                            value={editingBody}
                            onChange={(e) => setEditingBody(e.target.value)}
                            maxLength={500}
                          />
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-base text-foreground mb-1">
                            {comment.title}
                          </div>
                          <div className="text-sm text-foreground whitespace-pre-line">
                            {comment.body}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {comment.updated_at
                          ? `Actualizado: ${formatDate(comment.updated_at)}`
                          : `Creado: ${formatDate(comment.created_at)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
