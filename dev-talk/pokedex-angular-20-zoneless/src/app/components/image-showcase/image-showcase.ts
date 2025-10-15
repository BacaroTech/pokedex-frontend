import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-image-showcase',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <h2>Galleria Ottimizzata</h2>

    <img 
      ngSrc="assets/images/hero-image.webp" 
      width="800" 
      height="400"
      priority
      alt="Paesaggio montano al tramonto">

    <h3>Altre Immagini</h3>
    <img ngSrc="assets/images/thumbnail1.webp" width="200" height="150" alt="Thumbnail 1">
    <img ngSrc="assets/images/thumbnail2.webp" width="200" height="150" alt="Thumbnail 2">
  `,
  styles: [`img { 
    display: block; 
    margin-bottom: 20px; 
    max-width: 100%; 
    height: auto; }`
  ]
})
export class ImageShowcaseComponent {}