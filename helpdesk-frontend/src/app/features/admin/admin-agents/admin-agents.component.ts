import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { Dropdown } from 'flowbite';
import { DropDownContent, User } from '../../../shared/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ROLE, ROLE_LIST } from '../../../shared/enum/enumes';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { BasicTableThreeComponent } from '../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { DropdownComponent } from '../../../shared/components/ui/dropdown/dropdown.component';
import { TableDropdownComponent } from '../../../shared/components/common/table-dropdown/table-dropdown.component';

@Component({
  selector: 'app-admin-agents',
  imports: [
    CommonModule,
    InputComponent,
    DrawerComponent,
    ToastModule,
    ReactiveFormsModule,
    BasicTableThreeComponent,
    AvatarTextComponent,
    TableDropdownComponent,
  ],
  providers: [MessageService],
  templateUrl: './admin-agents.component.html',
  styleUrl: './admin-agents.component.css'
})
export class AdminAgentsComponent implements OnInit{

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);



  ngOnInit(): void {
    this.roleList = ROLE_LIST
    this.initializeFormGroup()
    this.getAgents();
  }

  searchText: string = "";
  visible = false;
  formGroup!: FormGroup;
  formMode = "add";
  agentToUpdate?: User;
  roleList: any;
  loadingMore = false;
  lastPage = false;

  private agentsSubject = new BehaviorSubject<User[]>([]);
  agents$ = this.agentsSubject.asObservable();

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (user : User) => this.drawerUpdate(user)
    },
    {
      id: 2,
      label: "Delete",
      action: (user: User) => this.deleteAgent(user)
    }
  ]

  initializeFormGroup() {
    this.formGroup = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      role: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirmation: ["", Validators.required]
    }, { validators: this.passowrdMatches });
  }

  passowrdMatches(formGroup: FormGroup) {
    
    const password = formGroup.get("password")?.value;
    
    const passwordConfirmation = formGroup.get("password_confirmation")?.value;

    console.log(`Password : ${password} , Confirmation : ${passwordConfirmation}`)

    return password === passwordConfirmation ? null : {passowrdMatches : true}
  }

  onDrawerClosed() {
    this.visible = false;
    this.formMode = "add";
  }


  getAgents() {
    this.userService.getUsers({ "role": ROLE.AGENT }).subscribe({
      next: (response) => {
        const agents = this.agentsSubject.value;
        this.agentsSubject.next([...agents, ...response.data])
        console.log(response.data)
      },
      error: (err) => {
        console.log(`Error : ${err}`);
      }
    })
  }


  onLoadMore() {
    console.log(this.loadingMore)
    if (!this.lastPage && !this.loadingMore) {
      this.getAgents();
    }
  }

  updateAgent(agentToUpdate:User) {

  }

  onValueChange(event : any) {
    console.log(event)
  }

  drawerUpdate(agent:User) {
    this.formMode = 'update'
    this.visible = true;
    this.agentToUpdate = agent;
    this.formGroup.patchValue(this.agentToUpdate);
  }

  deleteAgent(user: User) {

    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        console.log(response);
        const current = this.agentsSubject.value;
        this.agentsSubject.next(current.filter((agent) => agent.id !== user.id));
        this.visible = false;

        this.messageService.add({
          detail: "Agent Deleted successfully",
          summary: "Delete agent",
          severity: "success"
        })
      },
      error: (err) => {
        
      },
    })

  }

  addAgent() {

    if (!this.formGroup.value) return;

    this.userService.addUser(this.formGroup.value).subscribe({
      next: (response) => {
        const current = this.agentsSubject.value;
        this.agentsSubject.next([...current, response.data]);

        this.messageService.add({
          detail: "Agent added successfully",
          severity: "success",
          summary: "Add Agent"
        })
        
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.visible = false
      }
    })

  }





}
