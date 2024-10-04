import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, Input, input, output, Renderer2, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StateModalService } from '@services/state-modal.service';

@Component({
  selector: 'app-camara',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './camara.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamaraComponent implements AfterViewInit {

  @Input() set srcPhoto(value: string) {
    if (value) {
      //this.imageSrc = value;
      this.updateImageSrc(value);
    }
  }

  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;
  @ViewChild('imagen') imagenElement!: ElementRef;
  @ViewChild('fileUpload') fileUploadElement!: ElementRef;

  public photoFormated = output<string>();
  //public srcPhoto = input<string>();
  public stateModal = inject(StateModalService);

  public imageSrc: string = '../../../../assets/images/user-default.png';

  stream: MediaStream | null = null;

  constraints = {
    audio: false,
    video: {
      width: 140,
      height: 140,
    },
  };

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.imagenCanvas();
  }

  ngOnInit() {
    
  }

  private updateImageSrc(value: string): void {
    if (this.imagenElement) {
      this.renderer.setAttribute(this.imagenElement.nativeElement, 'src', value);
    }
  }

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(this.stream);
      this.videoElement.nativeElement.play();
    } catch (error) {
      console.error('Error accessing camera: ', error);
    }
  }

  handleSuccess(stream: MediaStream) {
    this.videoElement.nativeElement.srcObject = stream;
  }

  apagarCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.renderer.setAttribute(this.videoElement.nativeElement, 'poster', this.imageSrc);
    }
  }

  captureImage(): void{
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoElement.nativeElement, 0, 0, 140, 140);
    const imageData = canvas.toDataURL('image/jpeg', 1.0);
    this.renderer.setAttribute(this.imagenElement.nativeElement, 'src', imageData);
    this.photoFormated.emit(imageData);
  }

  imagenCanvas() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    const imagen = this.imagenElement.nativeElement;
    this.renderer.setAttribute(imagen, 'src', this.imageSrc);
    context.drawImage(imagen, 0, 0, 140, 140);
  }

  readFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result;
        this.renderer.setAttribute(this.imagenElement.nativeElement, 'src', imageData);
        this.imagenElement.nativeElement.onload = () => {
          const context = this.canvasElement.nativeElement.getContext('2d');
          context.drawImage(this.imagenElement.nativeElement, 0, 0, 140, 140);
          this.photoFormated.emit(imageData);
        };
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  public checkStateModal = effect(() => {
    if(!this.stateModal.stateModal()){
      this.apagarCamera();
      this.photoFormated.emit('');
      //this.imagenCanvas();
    }
  });

 }
