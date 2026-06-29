import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EpisodeService } from '../../core/services/episode.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { Episode } from '../../core/models/episode.model';
import { Favorite } from '../../core/models/user.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ExportButtonsSimpleComponent } from '../../shared/components/export-buttons-simple/export-buttons-simple.component';
import { SortDropdownComponent, SortOption } from '../../shared/components/sort-dropdown/sort-dropdown.component';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SpinnerComponent, PaginationComponent, ExportButtonsSimpleComponent, SortDropdownComponent],
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: WritableSignal<Episode[]> = signal([]);
  favorites: WritableSignal<Favorite[]> = signal([]);
  loading = signal(false);
  currentPage = 1;
  totalPages = 1;
  filters = { name: '', episode: '' };
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Opciones de ordenamiento
  sortOptions: SortOption[] = [
    { value: 'id', label: 'ID', icon: '#️⃣' },
    { value: 'name', label: 'Nombre', icon: '🔤' },
    { value: 'air_date', label: 'Fecha de Emisión', icon: '📅' },
    { value: 'episode', label: 'Código', icon: '📺' }
  ];

  // Columnas para exportación
  exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'air_date', label: 'Fecha de Emisión' },
    { key: 'episode', label: 'Código' }
  ];

  constructor(
    private episodeService: EpisodeService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEpisodes();
    this.loadFavorites();
  }

  loadEpisodes() {
    this.loading.set(true);
    this.episodeService.getEpisodes(this.currentPage, this.filters).subscribe({
      next: (res) => {
        let data = res.data.results;
        
        // Aplicar ordenamiento si está configurado
        if (this.sortField) {
          data = this.sortData(data, this.sortField, this.sortDirection);
        }
        
        this.episodes.set(data);
        this.totalPages = res.data.info.pages;
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }

  onSortChange(sort: { field: string, direction: 'asc' | 'desc' }) {
    this.sortField = sort.field;
    this.sortDirection = sort.direction;
    this.loadEpisodes();
  }

  sortData(data: Episode[], field: string, direction: 'asc' | 'desc'): Episode[] {
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
    return this.favorites().some(f => f.type === 'EPISODE' && f.externalId === id);
  }

  toggleFavorite(episode: Episode) {
    const fav = this.favorites().find(f => f.type === 'EPISODE' && f.externalId === episode.id);
    if (fav) {
      this.favoriteService.removeFavorite(fav.id).subscribe(() => this.loadFavorites());
    } else {
      this.favoriteService.addFavorite({
        type: 'EPISODE',
        externalId: episode.id,
        name: episode.name
      }).subscribe(() => this.loadFavorites());
    }
  }

  applyFilters() { this.currentPage = 1; this.loadEpisodes(); }
  onPageChange(page: number) { this.currentPage = page; this.loadEpisodes(); }
  goToDetail(id: number) { this.router.navigate(['/episodes', id]); }

  getSeasonNumber(episodeCode: string): string {
    return episodeCode ? episodeCode.substring(0, 3) : '';
  }
}