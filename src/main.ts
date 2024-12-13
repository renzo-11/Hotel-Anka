import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app/app.module'; // Importa el módulo principal

// Verifica si el entorno es de producción manualmente
const isProduction = false;  // Cambia esta variable a `true` si estás en producción

// Verifica si el entorno es de producción y habilita las optimizaciones
if (isProduction) {
  enableProdMode();
}

// Arranca la aplicación utilizando el módulo principal (AppModule)
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
