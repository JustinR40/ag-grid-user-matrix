import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams } from 'ag-grid-community';

const MEMBER_TYPE_OPTIONS = ['All', 'Application', 'User', 'Group'];

@Component({
  selector: 'app-member-type-filter',
  imports: [FormsModule],
  template: `
    <div class="filter-container">
      <label>Type:</label>
      <select
        [ngModel]="selectedType()"
        (change)="onTypeChange($event.target?.value)"
        class="filter-select"
      >
        @for (option of options; track option) {
          <option [value]="option">{{ option }}</option>
        }
      </select>
    </div>
  `,
  styles: `
    .filter-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      flex-wrap: wrap;
    }
    label {
      font-weight: 500;
      font-size: 12px;
    }
    .filter-select {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberTypeFilter implements IFilterAngularComp {
  protected readonly options = MEMBER_TYPE_OPTIONS;
  protected readonly selectedType = signal<string>('All');
  private params!: IFilterParams;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.selectedType() !== 'All';
  }

  doesFilterPass(params: { node: any }): boolean {
    const value = params.node.data[this.params.colDef.field!];
    const selectedType = this.selectedType();

    if (selectedType === 'All') {
      return true;
    }

    return value === selectedType;
  }

  getModel(): { type: string } | null {
    if (this.isFilterActive()) {
      return { type: this.selectedType() };
    }
    return null;
  }

  setModel(model: { type: string } | null): void {
    this.selectedType.set(model?.type || 'All');
  }

  onTypeChange(newType: string): void {
    this.selectedType.set(newType);
    this.params.filterChangedCallback();
  }
}
