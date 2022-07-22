import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import { SlipManagementComponent } from './slip-management.component';
import { SlipManagementService } from "../core/services/slip-management.service";
import { FileChooserComponent } from './file-chooser/file-chooser.component';
import { DragDropAreaDirective } from './file-chooser/drag-drop-area.directive';
import { ErrorIndicatorComponent } from './error-indicator/error-indicator.component';
import { ErrorIndicatorService } from "../core/services/error-indicator.service";

const routes: Routes = [
  {
    path: '',
    component: SlipManagementComponent
  }
];

@NgModule({
  declarations: [
    SlipManagementComponent,
    FileChooserComponent,
    DragDropAreaDirective,
    ErrorIndicatorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    SlipManagementService,
    ErrorIndicatorService
  ]
})
export class SlipManagementModule { }
