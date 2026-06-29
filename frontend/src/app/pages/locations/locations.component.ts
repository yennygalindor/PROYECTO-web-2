import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Location } from '../../core/models/location.model';
import { Favorite } from '../../core/models/user.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ExportButtonsSimpleComponent } from '../../shared/components/export-buttons-simple/export-buttons-simple.component';
import { SortDropdownComponent, SortOption } from '../../shared/components/sort-dropdown/sort-dropdown.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SpinnerComponent, PaginationComponent, ExportButtonsSimpleComponent, SortDropdownComponent],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: WritableSignal<Location[]> = signal([]);
  favorites: WritableSignal<Favorite[]> = signal([]);
  loading = signal(false);
  currentPage = 1;
  totalPages = 1;
  filters = { name: '', type: '', dimension: '' };
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Opciones de ordenamiento
  sortOptions: SortOption[] = [
    { value: 'id', label: 'ID', icon: '#️⃣' },
    { value: 'name', label: 'Nombre', icon: '🔤' },
    { value: 'type', label: 'Tipo', icon: '🏷️' },
    { value: 'dimension', label: 'Dimensión', icon: '🌌' }
  ];

  // Columnas para exportación
  exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'type', label: 'Tipo' },
    { key: 'dimension', label: 'Dimensión' }
  ];

  constructor(
    private locationService: LocationService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLocations();
    this.loadFavorites();
  }

  loadLocations() {
    this.loading.set(true);
    this.locationService.getLocations(this.currentPage, this.filters).subscribe({
      next: (res) => {
        let data = res.data.results;
        
        // Aplicar ordenamiento si está configurado
        if (this.sortField) {
          data = this.sortData(data, this.sortField, this.sortDirection);
        }
        
        this.locations.set(data);
        this.totalPages = res.data.info.pages;
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }

  onSortChange(sort: { field: string, direction: 'asc' | 'desc' }) {
    this.sortField = sort.field;
    this.sortDirection = sort.direction;
    this.loadLocations();
  }

  sortData(data: Location[], field: string, direction: 'asc' | 'desc'): Location[] {
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
    return this.favorites().some(f => f.type === 'LOCATION' && f.externalId === id);
  }

  toggleFavorite(location: Location) {
    const fav = this.favorites().find(f => f.type === 'LOCATION' && f.externalId === location.id);
    if (fav) {
      this.favoriteService.removeFavorite(fav.id).subscribe(() => this.loadFavorites());
    } else {
      this.favoriteService.addFavorite({
        type: 'LOCATION',
        externalId: location.id,
        name: location.name
      }).subscribe(() => this.loadFavorites());
    }
  }

  applyFilters() { this.currentPage = 1; this.loadLocations(); }
  onPageChange(page: number) { this.currentPage = page; this.loadLocations(); }
  goToDetail(id: number) { this.router.navigate(['/locations', id]); }
}