import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

const MEMBER_OPTIONS = ['Not Member', 'Member', 'Owner'];
const STATUS_COLORS = {
  'Not Member': { bg: '#e0e0e0', text: '#424242' },
  Member: { bg: '#3b82f6', text: '#ffffff' },
  Owner: { bg: '#f59e0b', text: '#ffffff' },
};

@Component({
  selector: 'app-membership-status-cell',
  template: `
    <button
      (click)="onCycle()"
      class="status-button"
      [style.background-color]="getCurrentColor().bg"
      [style.color]="getCurrentColor().text"
    >
      {{ selectedValue() }}
    </button>
  `,
  styles: `
    .status-button {
      width: 100%;
      height: 100%;
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      padding: 4px 8px;
      transition: all 0.2s ease;
      border-radius: 3px;

      &:hover {
        opacity: 0.85;
        transform: scale(0.98);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembershipStatusCell implements ICellRendererAngularComp {
  protected readonly selectedValue = signal<string>('Not Member');
  private columnId: string = '';
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.columnId = params.column?.getId() || '';
    this.selectedValue.set(params.value || 'Not Member');
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    this.selectedValue.set(params.value || 'Not Member');
    return true;
  }

  getCurrentColor(): { bg: string; text: string } {
    return STATUS_COLORS[this.selectedValue() as keyof typeof STATUS_COLORS];
  }

  onCycle(): void {
    const currentIndex = MEMBER_OPTIONS.indexOf(this.selectedValue());
    const nextIndex = (currentIndex + 1) % MEMBER_OPTIONS.length;
    const newValue = MEMBER_OPTIONS[nextIndex];

    this.selectedValue.set(newValue);

    if (this.params.api) {
      this.params.api.applyTransaction({
        update: [{ ...this.params.data, [this.columnId]: newValue }],
      });
    }
  }
}
