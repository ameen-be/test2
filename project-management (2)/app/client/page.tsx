"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  LockIcon,
  MessageSquare,
  UnlockIcon,
  Upload,
  X
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Données de projet fictives
const projectData = {
  id: "proj-123",
  name: "Refonte du site web",
  client: "Acme Corp",
  startDate: "2024-04-01",
  currentStage: 3,
  stages: [
    { id: 1, name: "Premier rendez-vous", status: "terminé", date: "2024-04-01" },
    { id: 2, name: "Devis envoyé", status: "terminé", date: "2024-04-03" },
    { id: 3, name: "Signature", status: "en cours", date: "2024-04-05" },
    { id: 4, name: "Upload de fichiers", status: "verrouillé", date: null },
    {
      id: 5,
      name: "Logo/Branding",
      status: "verrouillé",
      date: null,
      feedbackRounds: 0,
      maxFeedbackRounds: 3,
      feedbackDeadline: "2024-04-20",
    },
    { id: 6, name: "Aperçu Figma", status: "verrouillé", date: null },
    { id: 7, name: "Validation finale", status: "verrouillé", date: null },
    { id: 8, name: "Développement", status: "verrouillé", date: null },
    { id: 9, name: "Signalement de bugs", status: "verrouillé", date: null },
    { id: 10, name: "Paiement final", status: "verrouillé", date: null },
    { id: 11, name: "Mise en ligne", status: "verrouillé", date: null },
  ],
}

export default function TableauDeBordClient() {
  const [project, setProject] = useState(projectData)
  const [selectedStage, setSelectedStage] = useState<any | null>(null)

  // Calcul de la progression globale
  const completedStages = project.stages.filter((stage) => stage.status === "terminé").length
  const totalStages = project.stages.length
  const progressPercentage = Math.round((completedStages / totalStages) * 100)

  // Étape actuelle
  const currentStage = project.stages.find((stage) => stage.id === project.currentStage)

  // Vérification des deadlines à venir
  const upcomingDeadlines = project.stages
    .filter((stage) => stage.feedbackDeadline && new Date(stage.feedbackDeadline) > new Date())
    .sort((a, b) => new Date(a.feedbackDeadline).getTime() - new Date(b.feedbackDeadline).getTime())

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* MODAL VUE DÉTAILS */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedStage(null)}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-brand-dark mb-2">{selectedStage.name}</h3>
            <p className="text-gray-600 mb-2">
              Statut : <span className="font-semibold">{selectedStage.status}</span>
            </p>
            {selectedStage.date && (
              <p className="text-gray-600 mb-2">Date : {new Date(selectedStage.date).toLocaleDateString("fr-FR")}</p>
            )}
            {selectedStage.feedbackDeadline && (
              <p className="text-gray-600 mb-2">
                Date limite de feedback : {new Date(selectedStage.feedbackDeadline).toLocaleDateString("fr-FR")}
              </p>
            )}
            {/* Rajoute ici plus d'infos si besoin */}
            <div className="mt-4">
              <Button onClick={() => setSelectedStage(null)} className="w-full">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* FIN MODAL */}

      <header className="sticky top-0 z-50 w-full bg-brand-dark text-white">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center text-white hover:text-brand-yellow">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:text-brand-yellow hover:bg-transparent">
              Aide
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-brand-yellow hover:bg-transparent">
              Paramètres
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-brand-dark">{project.name}</h1>
              <p className="text-gray-500">
                Projet pour {project.client} • Démarré le {new Date(project.startDate).toLocaleDateString("fr-FR")}
              </p>
            </div>

            {/* Progression globale */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-brand-dark">Progression globale</CardTitle>
                <CardDescription>
                  {completedStages} sur {totalStages} étapes terminées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-brand-yellow" />
                <div className="mt-2 text-sm text-gray-500">{progressPercentage}% complété</div>
              </CardContent>
            </Card>

            {/* Alertes pour deadlines à venir */}
            {upcomingDeadlines.length > 0 && (
              <Alert className="border-brand-pink bg-brand-pink/10">
                <AlertCircle className="h-4 w-4 text-brand-pink" />
                <AlertTitle className="text-brand-dark">Date limite à venir</AlertTitle>
                <AlertDescription className="text-gray-600">
                  Vous avez {upcomingDeadlines.length} échéance(s) à venir. La prochaine concerne{" "}
                  {upcomingDeadlines[0].name} le {new Date(upcomingDeadlines[0].feedbackDeadline).toLocaleDateString("fr-FR")}.
                </AlertDescription>
              </Alert>
            )}

            {/* Étapes du projet */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold tracking-tight text-brand-dark">Étapes du projet</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {project.stages.map((stage) => (
                  <Card
                    key={stage.id}
                    className={`border border-gray-200 shadow-sm transition-all duration-200 ${
                      stage.status === "verrouillé" ? "opacity-70" : ""
                    } ${stage.status === "en cours" ? "ring-2 ring-brand-yellow/50" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-brand-dark">{stage.name}</CardTitle>
                        {stage.status === "verrouillé" ? (
                          <LockIcon className="h-4 w-4 text-gray-400" />
                        ) : stage.status === "terminé" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <UnlockIcon className="h-4 w-4 text-brand-blue" />
                        )}
                      </div>
                      <CardDescription>
                        {stage.status === "terminé" ? (
                          <>Terminé le {new Date(stage.date).toLocaleDateString("fr-FR")}</>
                        ) : stage.status === "en cours" ? (
                          <>En cours depuis le {new Date(stage.date).toLocaleDateString("fr-FR")}</>
                        ) : (
                          <>Verrouillé</>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stage.id === 4 && stage.status === "en cours" && (
                        <div className="rounded-md border border-dashed border-gray-300 p-6 text-center">
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <p className="mt-2 text-sm font-medium text-brand-dark">Déposez vos fichiers ici ou cliquez pour ajouter</p>
                          <p className="mt-1 text-xs text-gray-500">PDF, DOC, JPG, PNG jusqu'à 10Mo</p>
                        </div>
                      )}

                      {stage.id === 5 && stage.status === "en cours" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-brand-dark">Tours de feedback</span>
                            <span className="text-sm font-medium text-brand-dark">
                              {stage.feedbackRounds} / {stage.maxFeedbackRounds}
                            </span>
                          </div>
                          <Progress
                            value={(stage.feedbackRounds / stage.maxFeedbackRounds) * 100}
                            className="h-2 bg-gray-100"
                            indicatorClassName="bg-brand-yellow"
                          />
                          <p className="text-xs text-gray-500">
                            <Calendar className="mr-1 inline h-3 w-3" />
                            Limite : {new Date(stage.feedbackDeadline).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      )}

                      {stage.id === 6 && stage.status === "en cours" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <FileText className="mr-1 inline h-4 w-4 text-brand-blue" />
                            Le lien Figma vous sera envoyé automatiquement par email
                          </p>
                        </div>
                      )}

                      {stage.id === 8 && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <Clock className="mr-1 inline h-4 w-4 text-brand-blue" />
                            Développement en cours (lecture seule)
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {stage.status === "en cours" && stage.id !== 8 && (
                        <Button
                          className="w-full bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                          disabled={stage.id === 8}
                        >
                          {stage.id === 3
                            ? "Signer le document"
                            : stage.id === 4
                              ? "Ajouter des fichiers"
                              : stage.id === 5
                                ? "Envoyer un feedback"
                                : stage.id === 6
                                  ? "Consulter l'aperçu"
                                  : stage.id === 7
                                    ? "Planifier un appel"
                                    : stage.id === 9
                                      ? "Signaler un bug"
                                      : stage.id === 10
                                        ? "Effectuer le paiement"
                                        : "Valider l'étape"}
                        </Button>
                      )}
                      {stage.status === "terminé" && (
                        <Button
                          variant="outline"
                          className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                          onClick={() => setSelectedStage(stage)}
                        >
                          Détails
                        </Button>
                      )}
                      {stage.status === "verrouillé" && (
                        <Button disabled className="w-full opacity-50">
                          Verrouillé
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-gray-50">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 ProjectFlow. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-brand-dark hover:text-brand-blue hover:bg-transparent">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contacter le support
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}