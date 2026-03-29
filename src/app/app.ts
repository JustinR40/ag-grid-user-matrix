import { Component, signal, computed, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { MembershipStatusCell } from './membership-status-cell/membership-status-cell';
import { GroupFilter } from './group-filter/group-filter';
import { MemberTypeFilter } from './member-type-filter/member-type-filter';
import { GroupFilters } from './group-filters/group-filters';

ModuleRegistry.registerModules([AllCommunityModule]);

// Constants
const MEMBER_OPTIONS = ['Not Member', 'Member', 'Owner'];
const MEMBER_TYPES = ['Application', 'User', 'Group'];
const BASE_USERS = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  { name: 'Bob Smith', email: 'bob.smith@example.com' },
  { name: 'Carol White', email: 'carol.white@example.com' },
  { name: 'David Brown', email: 'david.brown@example.com' },
  { name: 'Eve Davis', email: 'eve.davis@example.com' },
  { name: 'Frank Miller', email: 'frank.miller@example.com' },
  { name: 'Grace Lee', email: 'grace.lee@example.com' },
  { name: 'Henry Wilson', email: 'henry.wilson@example.com' },
  { name: 'Ivy Martinez', email: 'ivy.martinez@example.com' },
  { name: 'Jack Anderson', email: 'jack.anderson@example.com' },
  { name: 'Karen Taylor', email: 'karen.taylor@example.com' },
  { name: 'Leo Thomas', email: 'leo.thomas@example.com' },
  { name: 'Mia Jackson', email: 'mia.jackson@example.com' },
  { name: 'Nathan Harris', email: 'nathan.harris@example.com' },
  { name: 'Olivia Martin', email: 'olivia.martin@example.com' },
  { name: 'Paul Thompson', email: 'paul.thompson@example.com' },
  { name: 'Quinn Garcia', email: 'quinn.garcia@example.com' },
  { name: 'Rachel Rodriguez', email: 'rachel.rodriguez@example.com' },
  { name: 'Samuel Clark', email: 'samuel.clark@example.com' },
  { name: 'Tina Lewis', email: 'tina.lewis@example.com' },
  { name: 'Uma Patel', email: 'uma.patel@example.com' },
  { name: 'Victor Young', email: 'victor.young@example.com' },
  { name: 'Wendy Hernandez', email: 'wendy.hernandez@example.com' },
  { name: 'Xavier King', email: 'xavier.king@example.com' },
  { name: 'Yara Lopez', email: 'yara.lopez@example.com' },
  { name: 'Zoe Wright', email: 'zoe.wright@example.com' },
  { name: 'Adrian Lopez', email: 'adrian.lopez@example.com' },
  { name: 'Bella Turner', email: 'bella.turner@example.com' },
  { name: 'Connor Phillips', email: 'connor.phillips@example.com' },
  { name: 'Diana Campbell', email: 'diana.campbell@example.com' },
  { name: 'Ethan Parker', email: 'ethan.parker@example.com' },
  { name: 'Fiona Evans', email: 'fiona.evans@example.com' },
  { name: 'George Edwards', email: 'george.edwards@example.com' },
  { name: 'Hannah Collins', email: 'hannah.collins@example.com' },
  { name: 'Isaac Reyes', email: 'isaac.reyes@example.com' },
  { name: 'Jasmine Morris', email: 'jasmine.morris@example.com' },
  { name: 'Kevin Murphy', email: 'kevin.murphy@example.com' },
  { name: 'Luna Rogers', email: 'luna.rogers@example.com' },
  { name: 'Marcus Morgan', email: 'marcus.morgan@example.com' },
  { name: 'Nora Peterson', email: 'nora.peterson@example.com' },
  { name: 'Oscar Gray', email: 'oscar.gray@example.com' },
  { name: 'Penelope Ramirez', email: 'penelope.ramirez@example.com' },
  { name: 'Quinn James', email: 'quinn.james@example.com' },
  { name: 'Ruby Watson', email: 'ruby.watson@example.com' },
  { name: 'Samuel Brooks', email: 'samuel.brooks@example.com' },
  { name: 'Tessa Chavez', email: 'tessa.chavez@example.com' },
  { name: 'Ulysses Kelly', email: 'ulysses.kelly@example.com' },
  { name: 'Victoria Sanders', email: 'victoria.sanders@example.com' },
  { name: 'Wesley Bennett', email: 'wesley.bennett@example.com' },
  { name: 'Ximena Dixon', email: 'ximena.dixon@example.com' },
];

// Row Data Interface
interface IRow {
  name: string;
  email: string;
  memberType: string;
  [key: string]: any; // Allow additional properties for dynamic groups
}

@Component({
  selector: 'app-root',
  imports: [AgGridAngular, GroupFilters],
  template: `
    <div class="content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <app-group-filters
        [groups]="allGroups"
        [selectedType]="selectedType()"
        [selectedCountry]="selectedCountry()"
        [groupCount]="filteredGroups().length"
        (typeFilterChange)="setTypeFilter($event)"
        (countryFilterChange)="setCountryFilter($event)"
        (clearFilters)="onClearFilters()"
      />
      <!-- The AG Grid component, with Dimensions, CSS Theme, Row Data, and Column Definition -->
      <ag-grid-angular
        #gridApi
        style="flex: 1; width: 100%;"
        [rowData]="rowData()"
        [columnDefs]="colDefs()"
        [defaultColDef]="defaultColDef"
        pagination="true"
      />
    </div>
  `,
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('gridApi', { static: false }) gridApi!: AgGridAngular;
  protected readonly title = signal('ag-grid');
  protected readonly selectedType = signal<'all' | 'service' | 'data' | 'users'>('all');
  protected readonly selectedCountry = signal<'all' | string>('all');

  readonly allGroups = [
    // OSDU Service groups
    'service-search-viewer',
    'service-search-editor',
    'service-search-admin',
    'service-storage-viewer',
    'service-storage-editor',
    'service-storage-admin',
    'service-delivery-viewer',
    'service-delivery-editor',
    'service-delivery-admin',
    'service-entitlements-viewer',
    'service-entitlements-editor',
    'service-entitlements-admin',
    'service-schema-viewer',
    'service-schema-editor',
    'service-schema-admin',
    'service-workflow-viewer',
    'service-workflow-editor',
    'service-workflow-admin',
    'service-indexing-viewer',
    'service-indexing-editor',
    'service-indexing-admin',
    'service-legal-viewer',
    'service-legal-editor',
    'service-legal-admin',
    'service-compliance-viewer',
    'service-compliance-editor',
    'service-compliance-admin',
    'service-notification-viewer',
    'service-notification-editor',
    'service-notification-admin',
    'service-reference-viewer',
    'service-reference-editor',
    'service-reference-admin',
    'service-partition-viewer',
    'service-partition-editor',
    'service-partition-admin',
    // Data groups
    'data-us-data-manager',
    'data-us-ext-partner',
    'data-us-geoscience',
    'data-us-geophysicist',
    'data-gb-data-manager',
    'data-gb-ext-partner',
    'data-gb-geoscience',
    'data-gb-geophysicist',
    'data-de-data-manager',
    'data-de-ext-partner',
    'data-de-geoscience',
    'data-de-geophysicist',
    'data-fr-data-manager',
    'data-fr-ext-partner',
    'data-fr-geoscience',
    'data-fr-geophysicist',
    'data-jp-data-manager',
    'data-jp-ext-partner',
    'data-jp-geoscience',
    'data-jp-geophysicist',
    'data-ca-data-manager',
    'data-ca-ext-partner',
    'data-ca-geoscience',
    'data-ca-geophysicist',
    // Users groups
    'users-us-data-manager',
    'users-us-ext-partner',
    'users-us-geoscience',
    'users-us-geophysicist',
    'users-gb-data-manager',
    'users-gb-ext-partner',
    'users-gb-geoscience',
    'users-gb-geophysicist',
    'users-de-data-manager',
    'users-de-ext-partner',
    'users-de-geoscience',
    'users-de-geophysicist',
    'users-fr-data-manager',
    'users-fr-ext-partner',
    'users-fr-geoscience',
    'users-fr-geophysicist',
  ];

  protected readonly filteredGroups = computed(() => {
    let groups = this.allGroups;
    const type = this.selectedType();
    const country = this.selectedCountry();

    // Filter by type
    if (type !== 'all') {
      groups = groups.filter((group) => group.startsWith(type));
    }

    // Filter by country
    if (country !== 'all') {
      groups = groups.filter((group) => {
        const parts = group.split('-');
        return parts[1] === country;
      });
    }

    return groups;
  });

  protected readonly rowData = computed(() =>
    this.generateRowData(BASE_USERS, this.filteredGroups()),
  );
  protected readonly colDefs = computed(() => this.generateColumnDefs(this.filteredGroups()));

  defaultColDef: ColDef = {};

  setTypeFilter(type: 'all' | 'service' | 'data' | 'users'): void {
    this.selectedType.set(type);
  }

  setCountryFilter(country: string): void {
    this.selectedCountry.set(country);
  }

  onClearFilters(): void {
    // Reset type and country filters
    this.selectedType.set('all');
    this.selectedCountry.set('all');

    // Clear grid filters
    if (this.gridApi?.api) {
      this.gridApi.api.setFilterModel(null);
    }
  }

  /**
   * Generates a random member status from the available options
   */
  private getRandomMemberStatus(): string {
    return MEMBER_OPTIONS[Math.floor(Math.random() * MEMBER_OPTIONS.length)];
  }

  /**
   * Generates a random member type
   */
  private getRandomMemberType(): string {
    return MEMBER_TYPES[Math.floor(Math.random() * MEMBER_TYPES.length)];
  }

  /**
   * Generates row data with user info and random group memberships
   */
  private generateRowData(baseUsers: typeof BASE_USERS, groups: string[]): IRow[] {
    return baseUsers.map((user) => {
      const row: IRow = { ...user, memberType: this.getRandomMemberType() };
      groups.forEach((group) => {
        row[group] = this.getRandomMemberStatus();
      });
      return row;
    });
  }

  /**
   * Generates column definitions from the provided groups
   */
  private generateColumnDefs(groups: string[]): ColDef<any>[] {
    const baseColumns: ColDef<any>[] = [
      {
        field: 'name',
        headerName: 'Name',
        pinned: 'left',
        autoHeight: false,
        lockPosition: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'email',
        headerName: 'Email',
        pinned: 'left',
        autoHeight: false,
        lockPosition: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'memberType',
        headerName: 'Member Type',
        pinned: 'left',
        autoHeight: false,
        lockPosition: true,
        editable: false,
        filter: MemberTypeFilter,
      },
    ];

    // Group columns by prefix
    const groupMap = new Map<string, string[]>();
    groups.forEach((group) => {
      const prefix = group.split('-')[0].toUpperCase();
      if (!groupMap.has(prefix)) {
        groupMap.set(prefix, []);
      }
      groupMap.get(prefix)?.push(group);
    });

    // Create grouped column definitions
    const groupedColumns = Array.from(groupMap.entries()).map(([prefix, groupsList]) => ({
      groupId: prefix,
      headerName: prefix,
      children: groupsList.map(
        (group) =>
          ({
            field: group,
            headerName: group,
            cellRenderer: MembershipStatusCell,
            filter: GroupFilter,
            autoHeight: false,
            columnGroupShow: 'open',
          }) as ColDef<any>,
      ),
    }));

    return [...baseColumns, ...groupedColumns] as ColDef<any>[];
  }
}
