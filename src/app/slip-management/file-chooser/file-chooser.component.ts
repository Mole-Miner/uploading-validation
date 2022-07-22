import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: [ './file-chooser.component.scss' ]
})
export class FileChooserComponent {
  @Output()
  readonly file: EventEmitter<File> = new EventEmitter<File>();

  onFilesSelected(event: Event): void {
    const files: FileList | null = (<HTMLInputElement>event?.target)?.files;
    this.checkFiles(files);
  }

  onFilesDragged(event: DragEvent): void {
    const files: FileList | undefined = event?.dataTransfer?.files;
    this.checkFiles(files)
  }

  private checkFiles(files: FileList | null | undefined): void {
    if (files?.length) {
      this.file.emit(files[0]);
    }
  }
}
