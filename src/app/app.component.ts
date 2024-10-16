import { Component, OnInit } from '@angular/core';
import { CertificateService, Certificate } from './certificate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  certificates: Certificate[] = [];
  currentCertificate: Certificate = { studentName: '', courseName: '', issueDate: null, grade: '' };
  editMode = false;
  searchName = '';
  message = '';

  constructor(private certificateService: CertificateService) {}

  ngOnInit() {
    this.loadCertificates();
  }

  loadCertificates() {
    this.certificateService.getCertificates().subscribe(
      (data: Certificate[]) => this.certificates = data,
      (error: any) => {
        console.error('Error fetching certificates:', error);
        this.showMessage('Error fetching certificates. Please try again.', 'error');
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.certificateService.updateCertificate(this.currentCertificate).subscribe(
        () => {
          this.loadCertificates();
          this.resetForm();
          this.showMessage('Certificate updated successfully!', 'success');
        },
        (error: any) => {
          console.error('Error updating certificate:', error);
          this.showMessage('Error updating certificate. Please try again.', 'error');
        }
      );
    } else {
      this.certificateService.createCertificate(this.currentCertificate).subscribe(
        () => {
          this.loadCertificates();
          this.resetForm();
          this.showMessage('Certificate added successfully!', 'success');
        },
        (error: any) => {
          console.error('Error creating certificate:', error);
          this.showMessage('Error creating certificate. Please try again.', 'error');
        }
      );
    }
  }

  editCertificate(certificate: Certificate) {
    this.currentCertificate = { ...certificate };
    this.editMode = true;
  }

  deleteCertificate(id: number | undefined) {
    if (id !== undefined) {
      this.certificateService.deleteCertificate(id).subscribe(
        () => {
          this.loadCertificates();
          this.showMessage('Certificate deleted successfully!', 'success');
        },
        (error: any) => {
          console.error('Error deleting certificate:', error);
          this.showMessage('Error deleting certificate. Please try again.', 'error');
        }
      );
    }
  }

  resetForm() {
    this.currentCertificate = { studentName: '', courseName: '', issueDate: null, grade: '' };
    this.editMode = false;
  }

  searchCertificates() {
    if (this.searchName.trim() !== '') {
      this.certificateService.getCertificatesByName(this.searchName).subscribe(
        (data: Certificate[]) => {
          this.certificates = data;
          if (data.length === 0) {
            this.showMessage('No certificates found for the given name.', 'error');
          }
        },
        (error: any) => {
          console.error('Error searching certificates:', error);
          this.showMessage('Error searching certificates. Please try again.', 'error');
        }
      );
    } else {
      this.loadCertificates();
    }
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }
}
