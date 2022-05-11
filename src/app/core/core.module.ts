import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule
  ]
})
export class CoreModule { }
