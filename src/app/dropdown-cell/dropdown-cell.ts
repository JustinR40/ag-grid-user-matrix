import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

const MEMBER_OPTIONS = ['Not Member', 'Member', 'Owner'];

@Component({
  selector: 'app-dropdown-cell',
  imports: [FormsModule],
  templateUrl: './dropdown-cell.html',
  styleUrl: './dropdown-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownCell implements ICellRendererAngularComp {
  protected readonly options = MEMBER_OPTIONS;
  protected readonly selectedValue = signal<string>('');
  private columnId: string = '';
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.columnId = params.column?.getId() || '';

    this.selectedValue.set(params.value || '');
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    this.selectedValue.set(params.value || '');
    return true;
  }

  onSelectionChange(newValue: string): void {
    this.selectedValue.set(newValue);
    if (this.params.api) {
      this.params.api.applyTransaction({
        update: [{
          ...this.params.data, [this.columnId]: newValue
        }],
      });
    }
  }
}
