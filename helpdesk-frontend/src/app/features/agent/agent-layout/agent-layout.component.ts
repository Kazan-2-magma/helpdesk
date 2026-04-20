import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppLayoutComponent } from "../../../shared/layout/app-layout/app-layout.component";

@Component({
  selector: "app-agent-layout",
  imports: [RouterModule, AppLayoutComponent],
  templateUrl: "./agent-layout.component.html",
  styleUrl: "./agent-layout.component.css",
})
export class AgentLayoutComponent implements OnInit {
  ngOnInit(): void {
    // Agent layout initialized
  }
}
