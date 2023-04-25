import { Component, Input, OnInit } from "@angular/core";
import { IndexComponent } from "../index.component";

@Component({
  selector: "app-modal-details",
  templateUrl: "./modal-details.component.html",
  styleUrls: ["./modal-details.component.css"],
})
export class ModalDetailsComponent implements OnInit {
  @Input() product: Product;
  constructor(public indexComponent: IndexComponent) {}

  ngOnInit(): void {}

  ngOnChanges(changes) {}
}
