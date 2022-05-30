import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Blogcategory } from '../blogcategory.model';
import { BlogcategoryService } from '../blogcategory.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { BehaviorSubject, fromEvent, map, merge, Observable } from 'rxjs';
import { ApiService } from 'src/app/igap/service/api.service';

@Component({
  selector: 'app-crud',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  
  displayedColumns = [
    "select",
    "businessid",
    "title",
    "urltitle",
    "srno",
    
  ];
  exampleDatabase: BlogcategoryService | null;
  dataSource: BlogcategoryDataSource | null;
  selection = new SelectionModel<Blogcategory>(true, []);
  index: number;
  id: number;
  blogcategory: Blogcategory | null;
  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public blogcategoryService: BlogcategoryService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }

  addNew() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        blogcategory: this.blogcategory,
        action: "add",
      },
      direction: tempDirection,
    });    
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {      
        this.loadData();
    });
  }

  editCall(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        blogcategory: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        this.loadData();
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: "270px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {    
        this.loadData();
        this.showNotification(
          "snackbar-danger",
          "Delete Successful",
          "bottom",
          "center"
        );
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Blogcategory>(true, []);
    });
    this.showNotification(
      "snackbar-danger",
      totalSelect + " Record Delete Successfully...!!!",
      "bottom",
      "center"
    );
  }

  public loadData() {
    this.exampleDatabase = new BlogcategoryService(this.api);
    this.dataSource = new BlogcategoryDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: Blogcategory) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem("mouse");
    this.contextMenu.openMenu();
  }
}

export class BlogcategoryDataSource extends DataSource<Blogcategory> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Blogcategory[] = [];
  renderedData: Blogcategory[] = [];
  constructor(
    public blogcategoryService: BlogcategoryService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Blogcategory[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.blogcategoryService.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.blogcategoryService.list();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.blogcategoryService.data
          .slice()
          .filter((blogcategory: Blogcategory) => {
            const searchStr = (
              blogcategory.businessid +
              blogcategory.title +
              blogcategory.urltitle +
              blogcategory.srno
             ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {}
  /** Returns a sorted copy of the database data. */
  sortData(data: Blogcategory[]): Blogcategory[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case "businessid":
          [propertyA, propertyB] = [a.businessid, b.businessid];
          break;
          case "title":
            [propertyA, propertyB] = [a.title, b.title];
            break;
        case "urltitle":
          [propertyA, propertyB] = [a.urltitle, b.urltitle];
          break;
          case "srno":
          [propertyA, propertyB] = [a.srno, b.srno];
          break;
        
          
        
        
        
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}