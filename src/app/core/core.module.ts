import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ]
})
export class CoreModule { }
