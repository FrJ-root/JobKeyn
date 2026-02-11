import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou l\'API est temporairement indisponible.';
                        break;
                    case 400:
                        errorMessage = 'Requête invalide. Veuillez vérifier les données saisies.';
                        break;
                    case 401:
                        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                        break;
                    case 403:
                        errorMessage = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée.';
                        break;
                    case 500:
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                        break;
                    default:
                        errorMessage = `Erreur ${error.status}: ${error.message}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        })
    );
};
