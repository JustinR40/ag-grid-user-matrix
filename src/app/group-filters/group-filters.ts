import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-group-filters',
  template: `
    <div class="filter-toolbar" style="padding: 12px; background-color: #f5f5f5; border-bottom: 1px solid #e0e0e0; display: flex; flex-wrap: wrap; gap: 12px;">
      <!-- Type filters -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <label style="font-weight: 500; font-size: 14px;">Type:</label>
        <button 
          (click)="onTypeFilterChange('all')" 
          [style.background-color]="selectedType() === 'all' ? '#3b82f6' : '#ffffff'"
          [style.color]="selectedType() === 'all' ? '#ffffff' : '#424242'"
          style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500;">
          All
        </button>
        <button 
          (click)="onTypeFilterChange('service')" 
          [style.background-color]="selectedType() === 'service' ? '#3b82f6' : '#ffffff'"
          [style.color]="selectedType() === 'service' ? '#ffffff' : '#424242'"
          style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500;">
          Service
        </button>
        <button 
          (click)="onTypeFilterChange('data')" 
          [style.background-color]="selectedType() === 'data' ? '#3b82f6' : '#ffffff'"
          [style.color]="selectedType() === 'data' ? '#ffffff' : '#424242'"
          style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500;">
          Data
        </button>
        <button 
          (click)="onTypeFilterChange('users')" 
          [style.background-color]="selectedType() === 'users' ? '#3b82f6' : '#ffffff'"
          [style.color]="selectedType() === 'users' ? '#ffffff' : '#424242'"
          style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500;">
          Users
        </button>
      </div>

      <!-- Country filters -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <label style="font-weight: 500; font-size: 14px;">Country:</label>
        <button 
          (click)="onCountryFilterChange('all')" 
          [style.background-color]="selectedCountry() === 'all' ? '#3b82f6' : '#ffffff'"
          [style.color]="selectedCountry() === 'all' ? '#ffffff' : '#424242'"
          style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500;">
          All
        </button>
        @for (country of uniqueCountries(); track country) {
          <button 
            (click)="onCountryFilterChange(country)" 
            [style.background-color]="selectedCountry() === country ? '#3b82f6' : '#ffffff'"
            [style.color]="selectedCountry() === country ? '#ffffff' : '#424242'"
            style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-weight: 500; text-transform: uppercase;">
            {{ country }}
          </button>
        }
      </div>

      <span style="margin-left: auto; font-size: 12px; color: #666; align-self: center;">{{ groupCount() }} groups</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFilters {
  readonly groups = input.required<string[]>();
  readonly selectedType = input<'all' | 'service' | 'data' | 'users'>('all');
  readonly selectedCountry = input<string>('all');
  readonly groupCount = input.required<number>();

  readonly typeFilterChange = output<'all' | 'service' | 'data' | 'users'>();
  readonly countryFilterChange = output<string>();

  protected readonly uniqueCountries = computed(() => {
    const countries = new Set<string>();
    this.groups().forEach((group) => {
      const parts = group.split('-');
      if (parts.length >= 2) {
        countries.add(parts[1]);
      }
    });
    return Array.from(countries).sort();
  });

  onTypeFilterChange(type: 'all' | 'service' | 'data' | 'users'): void {
    this.typeFilterChange.emit(type);
  }

  onCountryFilterChange(country: string): void {
    this.countryFilterChange.emit(country);
  }
}
