﻿import { Component, OnInit } from '@angular/core';
import { HttpCRUDService } from '../../services/http-crud.service';
import { EnvConstants } from '../../constants/environments.constant';
import { ResponsiveTableComponent, IColumnConfig, ITableData } from '../../components.shared/responsive-table/responsive-table.component';
import {Router} from '@angular/router-deprecated';


@Component({
    selector: 'built-with',
    template: require('./built-with.component.html'),
    directives: [ResponsiveTableComponent]
})
export class BuiltWithComponent implements OnInit {

    tableData: ITableData = { columnConfigList: [], crud: false, dataList: [], refresh: false };

    constructor(
        private httpCRUDService: HttpCRUDService<IBuiltWith>,
        private router: Router,
        private envConstants: EnvConstants
    ) {
        this.getDataList();
    }

    

    ngOnInit() {
    }

    getDataList() {
        this.httpCRUDService.getAll(this.envConstants.apiEndPoint + 'crud')
            .subscribe(result => {
                this.tableData.dataList = result;
                this.tableData.crud = true;
                this.tableData.refresh = true;
                this.tableData.columnConfigList = [
                    { name: 'name', filter: true, header: 'Name', order: true, type: 'text' },
                    { name: 'pending', filter: false, header: 'Pending', order: true, type: 'switch' }
                ];
            });
    }

    gotoDetail(builtWith: IBuiltWith) {
        this.router.navigate(['BuiltWithForm',
            {
                formMode: 'edit',
                id: builtWith.id
            }]);
    }

    update(builtWith: IBuiltWith) {
        builtWith.pending = !builtWith.pending;
        this.httpCRUDService.update(this.envConstants.apiEndPoint + 'crud', builtWith).subscribe();
    }

    new() {
        this.router.navigate(['BuiltWithForm',
            {
                formMode: 'new',
                id:0
            }]);
    }

    delete(builtWith: IBuiltWith) {
        this.httpCRUDService.delete(this.envConstants.apiEndPoint + 'crud', builtWith.id)
            .subscribe(r =>
            {
                for (var i = 0; i < this.tableData.dataList.length; i++) {
                    if (this.tableData.dataList[i].id == builtWith.id) {
                        this.tableData.dataList.splice(i, 1);
                        break;
                    }
                }
            });
    }
}