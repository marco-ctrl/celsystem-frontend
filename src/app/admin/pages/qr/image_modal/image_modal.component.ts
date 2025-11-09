import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material/material.module';
import { ImageProfilePipe } from '../../../../pipes/image-profile.pipe';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { QrImageService } from '../../../services/qrImage.service';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [
    MaterialModule,
    ImageProfilePipe,
  ],
  templateUrl: './image_modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageModalComponent { 

  readonly imageUrl: string = environment.baseUrl + '/api/';
  qrImageService = inject(QrImageService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageModalComponent>,
  ) {}

  downloadImage() {
    this.qrImageService.downloadImage(this.data);
  }

  close() {
    this.dialogRef.close();
  }

}
