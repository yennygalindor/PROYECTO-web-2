import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../../core/services/character.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Character } from '../../core/models/character.model';
import { Favorite } from '../../core/models/user.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ExportButtonsSimpleComponent } from '../../shared/components/export-buttons-simple/export-buttons-simple.component';
import { SortDropdownComponent, SortOption } from '../../shared/components/sort-dropdown/sort-dropdown.component';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, PaginationComponent, SpinnerComponent, ExportButtonsSimpleComponent, SortDropdownComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters:WritableSignal<Character[]> = signal([]);
  favorites: WritableSignal<Favorite[]>  = signal([]);
  loading:WritableSignal<boolean> = signal(false);
  currentPage = 1;
  totalPages = 1;
  filters = { name: '', status: '', species: '' };
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Opciones de ordenamiento
  sortOptions: SortOption[] = [
    { value: 'id', label: 'ID', icon: '#️⃣' },
    { value: 'name', label: 'Nombre', icon: '🔤' },
    { value: 'status', label: 'Estado', icon: '💚' },
    { value: 'species', label: 'Especie', icon: '🧬' },
    { value: 'gender', label: 'Género', icon: '⚧' }
  ];

  // Columnas para exportación
  exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'status', label: 'Estado' },
    { key: 'species', label: 'Especie' },
    { key: 'type', label: 'Tipo' },
    { key: 'gender', label: 'Género' },
    { key: 'origin.name', label: 'Origen' },
    { key: 'location.name', label: 'Ubicación' }
  ];

  constructor(
    private characterService: CharacterService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCharacters();
    this.loadFavorites();
  }

  loadCharacters() {
    this.loading.set(true);
    this.characterService.getCharacters(this.currentPage, this.filters).subscribe({
      next: (res) => {
        let data = res.data.results;
        
        // Aplicar ordenamiento si está configurado
        if (this.sortField) {
          data = this.sortData(data, this.sortField, this.sortDirection);
        }
        
        this.characters.set(data);
        this.totalPages = res.data.info.pages;
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }

  onSortChange(sort: { field: string, direction: 'asc' | 'desc' }) {
    this.sortField = sort.field;
    this.sortDirection = sort.direction;
    this.loadCharacters();
  }

  sortData(data: Character[], field: string, direction: 'asc' | 'desc'): Character[] {
    return [...data].sort((a, b) => {
      let aValue = this.getNestedValue(a, field);
      let bValue = this.getNestedValue(b, field);

      // Convertir a minúsculas si es string
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      // Comparar
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe(res => {
      this.favorites.set(res.data);
    });
  }

  isFavorite(id: number): boolean {
    return this.favorites().some(f => f.type === 'CHARACTER' && f.externalId === id);
  }

  toggleFavorite(character: Character) {
    const fav = this.favorites().find(f => f.type === 'CHARACTER' && f.externalId === character.id);
    if (fav) {
      this.favoriteService.removeFavorite(fav.id).subscribe(() => this.loadFavorites());
    } else {
      this.favoriteService.addFavorite({
        type: 'CHARACTER', externalId: character.id,
        name: character.name, image: character.image
      }).subscribe(() => this.loadFavorites());
    }
  }

  applyFilters() { this.currentPage = 1; this.loadCharacters(); }
  onPageChange(page: number) { this.currentPage = page; this.loadCharacters(); }
  goToDetail(id: number) { this.router.navigate(['/characters', id]); }

  getStatusBadge(status: string): string {
    return status === 'Alive' ? 'bg-success' : status === 'Dead' ? 'bg-danger' : 'bg-secondary';
  }
}