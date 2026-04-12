import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { Dropdown } from "flowbite";
import {
  DropDownContent,
  JsonApiResponse,
  User,
} from "../../../shared/interfaces";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from "@angular/forms";
import { ROLE, ROLE_LIST } from "../../../shared/enum/enumes";
import { UserService } from "../services/admin/users/user.service";
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  takeUntil,
} from "rxjs";
import { BasicTableThreeComponent } from "../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { AvatarTextComponent } from "../../../shared/components/ui/avatar/avatar-text.component";
import { DropdownComponent } from "../../../shared/components/ui/dropdown/dropdown.component";
import { TableDropdownComponent } from "../../../shared/components/common/table-dropdown/table-dropdown.component";

@Component({
  selector: "app-admin-agents",
  imports: [
    CommonModule,
    InputComponent,
    DrawerComponent,
    ToastModule,
    ReactiveFormsModule,
    FormsModule,
    BasicTableThreeComponent,
    AvatarTextComponent,
    TableDropdownComponent,
  ],
  providers: [MessageService],
  templateUrl: "./admin-agents.component.html",
  styleUrl: "./admin-agents.component.css",
})
export class AdminAgentsComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.roleList = ROLE_LIST;
    this.initializeFormGroup();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((text) => this.getAgents(1, false, text));

    this.getAgents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchText: string = "";
  visible = false;
  formGroup!: FormGroup;
  formMode = "add";
  agentToUpdate?: User;
  roleList: any;
  loadingMore = false;
  lastPage = false;
  currentPage = 1;
  loading = false;

  private searchSubject = new Subject<string | undefined>();
  private agentsSubject = new BehaviorSubject<User[]>([]);
  agents$ = this.agentsSubject.asObservable();

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (user: User) => this.drawerUpdate(user),
    },
    {
      id: 2,
      label: "Delete",
      action: (user: User) => this.deleteAgent(user),
    },
  ];

  initializeFormGroup() {
    this.formGroup = this.formBuilder.group(
      {
        name: ["", Validators.required],
        email: ["", Validators.required],
        role: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        password_confirmation: ["", Validators.required],
      },
      { validators: this.passowrdMatches },
    );
  }

  passowrdMatches(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;

    const passwordConfirmation = formGroup.get("password_confirmation")?.value;

    console.log(
      `Password : ${password} , Confirmation : ${passwordConfirmation}`,
    );

    return password === passwordConfirmation ? null : { passowrdMatches: true };
  }

  onDrawerClosed() {
    this.visible = false;
    this.formMode = "add";
    this.formGroup.reset();
  }

  onSearchChange(text: string) {
    const trimmed = text.trim();
    this.currentPage = 1;
    this.loading = true;
    this.searchSubject.next(trimmed || undefined);
  }

  async getAgents(page: number = 1, append = false, search?: string) {
    try {
      if (page === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      const params: any = {
        role: ROLE.AGENT,
        userFilter: search,
        page,
        per_page: 15,
      };

      if (search) {
        params.search = search;
      }

      const res = await firstValueFrom(this.userService.getUsers(params));

      if (!append || page === 1 || search) {
        this.agentsSubject.next(res.data as User[]);
      } else {
        const current = this.agentsSubject.value;
        this.agentsSubject.next([...current, ...res.data]);
      }

      this.lastPage = !res.links?.next;
      this.currentPage = page;
    } catch (err) {
      console.log(`Error : ${err}`);
    } finally {
      this.loadingMore = false;
      this.loading = false;
    }
  }

  onLoadMore() {
    if (!this.loadingMore && !this.lastPage) {
      this.getAgents(this.currentPage + 1, true);
    }
  }

  updateAgent(agentToUpdate: User) {
    const data = Object.fromEntries(
      Object.entries(this.formGroup.value).filter(
        ([_, v]) => v !== "" && v !== null,
      ),
    ) as Partial<User>;

    if (!data.password) {
      delete data.password;
      delete data.password_confirmation;
    }

    if (Object.keys(data).length === 0) {
      return;
    }

    this.userService.updateUser(agentToUpdate.id, data).subscribe({
      next: (response: JsonApiResponse) => {
        if (response.success) {
          const updateUser = response.data as User;
          const current = this.agentsSubject.value;
          const updatedList = current.map((u) =>
            u.id === agentToUpdate.id ? updateUser : u,
          );
          this.agentsSubject.next([...updatedList]);
          this.messageService.add({
            severity: "success",
            summary: "User Updated",
            detail: "User updated successfully",
          });
        }
      },
      error: (err) => {
        console.error("Error updating agent:", err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update agent",
        });
      },
      complete: () => {
        this.visible = false;
        this.onDrawerClosed();
      },
    });
  }

  drawerUpdate(agent: User) {
    this.formMode = "update";
    this.visible = true;
    this.agentToUpdate = agent;
    this.formGroup.patchValue(this.agentToUpdate);
  }

  deleteAgent(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        console.log(response);
        const current = this.agentsSubject.value;
        this.agentsSubject.next(
          current.filter((agent) => agent.id !== user.id),
        );
        this.visible = false;

        this.messageService.add({
          detail: "Agent Deleted successfully",
          summary: "Delete agent",
          severity: "success",
        });
      },
      error: (err) => {},
    });
  }

  addAgent() {
    if (!this.formGroup.value) return;

    this.userService.addUser(this.formGroup.value).subscribe({
      next: (response) => {
        const current = this.agentsSubject.value;
        this.agentsSubject.next([response.data, ...current]);

        this.messageService.add({
          detail: "Agent added successfully",
          severity: "success",
          summary: "Add Agent",
        });
        this.formGroup.reset();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.visible = false;
      },
    });
  }
}
