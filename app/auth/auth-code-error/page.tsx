import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Mail, RefreshCw } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Erreur d'authentification
          </CardTitle>
          <CardDescription className="text-center">
            Il y a eu un problème avec votre lien de confirmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Le lien de confirmation que vous avez cliqué peut être invalide ou expiré.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Solutions possibles :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vérifiez que vous avez cliqué sur le bon lien dans l'email</li>
              <li>• Le lien peut avoir expiré (valide 24h)</li>
              <li>• Essayez de vous connecter directement</li>
              <li>• Si le problème persiste, créez un nouveau compte</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth">
                Créer un nouveau compte
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
