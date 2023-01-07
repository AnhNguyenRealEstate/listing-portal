import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Input, OnInit, Optional, SecurityContext } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { Project } from '../projects.data';
import { ProjectUploadService } from './project-upload.service';

@Component({
    selector: 'project-uload',
    templateUrl: './project-upload.component.html',
    styleUrls: ['./project-upload.component.scss']
})

export class ProjectUploadComponent implements OnInit {
    @Input() project: Project = {} as Project;
    @Input() isEditMode = false;

    coverImageFile: File | undefined = undefined;
    coverImageSrc: string | undefined = undefined;
    coverImageModified: boolean = false;

    imageFiles: File[] = [];
    imageSrcs: string[] = [];
    imageFilesModified: boolean = false;
    compressionInProgress: boolean = false;

    constructor(
        private imageCompress: NgxImageCompressService,
        private sanitizer: DomSanitizer,
        public projectUpload: ProjectUploadService,
        private snackbar: MatSnackBar,
        private translate: TranslateService,
        @Optional() private dialogRef: MatDialogRef<ProjectUploadComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any
    ) { 
        if (this.data?.project) {
            this.project = this.data.project as Project;
        }

        if (this.data?.isEditMode) {
            this.isEditMode = true;
        }
    }

    ngOnInit() { }

    async onCoverImageUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        const file = files.item(0)!;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Img = reader.result as string;
            const compressedImgAsBase64Url =
                await this.imageCompress.compressFile(
                    base64Img as string, DOC_ORIENTATION.Default,
                    100, 75, 1920, 1080);

            const response = await fetch(compressedImgAsBase64Url);
            const data = await response.blob();
            const compressedFile = new File(
                [data],
                `${file.name}`,
                { type: file.type }
            );

            this.coverImageFile = compressedFile;
            this.coverImageSrc =
                this.sanitizer.sanitize(
                    SecurityContext.RESOURCE_URL,
                    this.sanitizer.bypassSecurityTrustResourceUrl(compressedImgAsBase64Url))!;
        }

        this.coverImageModified = true;
    }

    removeCoverImage() {
        this.coverImageFile = undefined;
        this.coverImageSrc = undefined;
    }

    async onMediaUpload(event: any) {
        const files = (event.target.files as FileList);
        if (files.length === 0) {
            return;
        }

        this.compressionInProgress = true;

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Img = reader.result as string;
                const compressedImgAsBase64Url =
                    await this.imageCompress.compressFile(
                        base64Img, DOC_ORIENTATION.Default,
                        100, 75, 1920, 1080);

                const response = await fetch(compressedImgAsBase64Url);
                const data = await response.blob();
                const compressedFile = new File(
                    [data],
                    `${file.name}`,
                    { type: file.type }
                );

                this.imageFiles.push(compressedFile);
                this.imageSrcs.push(
                    this.sanitizer.sanitize(
                        SecurityContext.RESOURCE_URL,
                        this.sanitizer.bypassSecurityTrustResourceUrl(compressedImgAsBase64Url))!
                );

                if (i == files.length - 1) {
                    this.compressionInProgress = false;
                }
            }
        }

        this.imageFilesModified = true;
    }

    removeUploadedMedia(imgSrc: string) {
        this.imageSrcs.forEach((src, index) => {
            if (src === imgSrc) {
                this.imageSrcs.splice(index, 1);
                this.imageFiles.splice(index, 1);
            }
        });

        this.imageFilesModified = true;
    }

    uploadedMediaDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.imageSrcs, event.previousIndex, event.currentIndex);
        moveItemInArray(this.imageFiles, event.previousIndex, event.currentIndex);
        this.imageFilesModified = true;
    }

    async publishProject() {
        await this.projectUpload.publishProject(this.project, this.imageFiles, this.coverImageFile!);

        this.project = {} as Project;
        this.imageFiles = [];
        this.imageSrcs = [];
        this.coverImageFile = undefined;
        this.coverImageSrc = undefined;

        this.snackbar.open(
            this.translate.instant('project_upload.published_msg'),
            this.translate.instant('project_upload.dismiss_msg'),
            {
                duration: 3000
            }
        );

        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    async saveEdit() {
        await this.projectUpload.saveEdit(
            this.project,
            this.project.id!,
            this.coverImageFile!, this.coverImageModified
        );

        this.imageFilesModified = false;
        this.snackbar.open(
            this.translate.instant('project_upload.changes_saved_msg'),
            this.translate.instant('project_upload.dismiss_msg'),
            {
                duration: 3000
            }
        );
    }

    closeDialog() {
        this.dialogRef.close();
    }
}