import { Component, OnInit } from '@angular/core';
export interface DataTable {
  headerRow: string[];
  footerRow?: string[];
  dataRows: string[][];
}
declare var $: any;
/** SERVICE */
import { MessageService } from 'app/services/message/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {
  public dataTable: DataTable;
  public arrayMessages: Array<Message> = [];
  public tablaDatos;
  constructor(private messageService:MessageService ) { }

  ngOnInit(): void {
    this.dataTable = {
      headerRow: [
        "#",
        "FECHA",
        "HORA",
        "EMAIL",
        "NOMBRE",
        "DESCRIPCIÓN",
        "TELÉFONO"
      ],
      dataRows: [],
    };
    this.getMessage();
  }

  public getMessage() {
    this.messageService.getMessages().subscribe(m => {
      this.arrayMessages = m;
    this.initDataTable()

    })
  }

  public initDataTable() {
    let aaa = this.tablaDatos;
    $("#datatablesMessage").DataTable().destroy();
    setTimeout(function () {
      aaa = $("#datatablesMessage").DataTable({
        retrieve: true,
        paging: true,
        ordering: true,
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        // responsive: true,
        language: {
          search: "Buscar:",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }

}
