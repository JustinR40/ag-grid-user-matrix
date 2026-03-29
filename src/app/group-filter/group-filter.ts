import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams } from 'ag-grid-community';

const MEMBER_OPTIONS = ['All', 'Not Member', 'Member', 'Owner'];

@Component({
  selector: 'app-group-filter',
  imports: [FormsModule],
  template: `
    <div class="filter-container">
      <label>Status:</label>
      <select [ngModel]="selectedStatus()" (change)="onStatusChange($event.target?.value)" class="filter-select">
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
export class GroupFilter implements IFilterAngularComp {
  protected readonly options = MEMBER_OPTIONS;
  protected readonly selectedStatus = signal<string>('All');
  private params!: IFilterParams;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.selectedStatus() !== 'All';
  }

  doesFilterPass(params: { node: any }): boolean {
    const value = params.node.data[this.params.colDef.field!];
    const selectedStatus = this.selectedStatus();

    if (selectedStatus === 'All') {
      return true;
    }

    return value === selectedStatus;
  }

  getModel(): { status: string } | null {
    if (this.isFilterActive()) {
      return { status: this.selectedStatus() };
    }
    return null;
  }

  setModel(model: { status: string } | null): void {
    this.selectedStatus.set(model?.status || 'All');
  }

  onStatusChange(newStatus: string): void {
    this.selectedStatus.set(newStatus);
    this.params.filterChangedCallback();
  }
}
