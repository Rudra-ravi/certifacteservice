import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from './environments/environment-ts';

export interface Certificate {
  id?: number;
  studentName: string | null;
  courseName: string | null;
  issueDate: Date | null;
  grade: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) {}

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  getCertificate(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  createCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(this.apiUrl, certificate);
  }

  updateCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/${certificate.id}`, certificate);
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCertificatesByName(name: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/name/${name}`).pipe(
      map((certificates: Certificate[]) => {
        if (certificates.length === 0) {
          return [];
        }
        return certificates;
      })
    );
  }
}
