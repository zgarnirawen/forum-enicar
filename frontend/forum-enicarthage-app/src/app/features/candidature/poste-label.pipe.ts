import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({ name: 'posteLabel' })
export class PosteLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    COORDINATRICE: 'Coordinatrice Générale',
    CHEF_COMITE:   'Chef de Comité',
    MEMBRE:        'Membre de Comité',
  };
  transform(value: string): string {
    return this.map[value] ?? value;
  }
}