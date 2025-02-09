import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distanceKm',
  standalone: true,
})
export class DistanceKmPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value === 'number') {
      // Si el valor es un número, lo tratamos directamente.
      const kilometers = value; // Asumimos que ya está en kilómetros.
      const roundedKm = parseFloat(kilometers.toFixed(2)); // Redondeamos a 2 decimales.
      return `${roundedKm} km`;
    } else if (typeof value === 'string') {
      // Si el valor es una cadena, intentamos convertirla a número.
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return 'Valor inválido'; // Manejo de error si no es un número válido
      }
      const kilometers = numValue; // Asumimos que ya está en kilómetros.
      const roundedKm = parseFloat(kilometers.toFixed(2)); // Redondeamos a 2 decimales.
      return `${roundedKm} km`;
    } else {
      return 'Valor inválido'; // Manejo para tipos de datos no soportados.
    }
  }
}
