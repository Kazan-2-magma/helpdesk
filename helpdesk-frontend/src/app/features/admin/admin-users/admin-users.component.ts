import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { BasicTableTwoComponent } from "../../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component";
import { BasicTableThreeComponent } from "../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DrawerComponent } from "../../../shared/components/drawer/drawer.component";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ROLE, ROLE_LIST } from "../../../shared/enum/enumes";
import { UserService } from "../services/admin/users/user.service";
import { BehaviorSubject } from "rxjs";
import {
  DropDownContent,
  JsonApiResponse,
  PaginatedResponse,
  User,
} from "../../../shared/interfaces";
import { AvatarTextComponent } from "../../../shared/components/ui/avatar/avatar-text.component";
import { TableDropdownComponent } from "../../../shared/components/common/table-dropdown/table-dropdown.component";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-admin-users",
  imports: [
    CommonModule,
    BasicTableThreeComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    InputComponent,
    DrawerComponent,
    AvatarTextComponent,
    TableDropdownComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./admin-users.component.html",
  styleUrl: "./admin-users.component.css",
})
export class AdminUsersComponent implements OnInit {
  ngOnInit(): void {
    this.initializeFormGroup();
    this.roleList = ROLE_LIST;
    this.getUsers();
    console.log(this.formGroup);
  }

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  dropDownContents: DropDownContent[] = [
    {
      id: 1,
      label: "Edit",
      action: (user: User) => this.drawerUpdate(user),
    },
    {
      id: 2,
      label: "Delete",
      action: (user: User) => this.deleteUser(user),
    },
  ];

  roleList!: any;
  formGroup!: FormGroup;
  searchText: string = "";
  formMode: string = "add";
  visible: boolean = false;
  loadingMore = false;
  lastPage = false;
  userToUpdate?: User;
  loading = false;

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  initializeFormGroup() {
    this.formGroup = this.formBuilder.group(
      {
        name: ["", Validators.required],
        email: ["", Validators.required],
        role: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        password_confirmation: ["", Validators.required],
      },
      { validators: this.passwordMatches },
    );
  }

  onDrawerClosed() {
    this.formMode = "add";
    // this.faqToUpdate = undefined;
    this.formGroup.reset();
  }

  passwordMatches(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const passwordConfirmation = formGroup.get("password_confirmation")?.value;

    return password === passwordConfirmation
      ? null
      : { passwordMismatch: true };
  }

  onValueChange(e: string) {
    console.log("Event", this.searchText);
  }

  getUsers() {
    this.loading = true;
    this.userService.getUsers({ role: ROLE.USER }).subscribe({
      next: (response: PaginatedResponse<User>) => {
        const current = this.usersSubject.value;
        this.usersSubject.next([...current, ...response.data]);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  onLoadMore() {
    console.log(this.loadingMore);
    if (!this.lastPage && !this.loadingMore) {
      this.getUsers();
    }
  }

  addUser() {
    this.visible = true;

    console.log(this.formGroup.value);

    if (!this.formGroup.valid) return;

    this.userService.addUser(this.formGroup.value).subscribe({
      next: (response) => {
        const current = this.usersSubject.value;
        this.usersSubject.next([...current, response.data]);
        this.messageService.add({
          severity: "success",
          detail: "User Added Successfully",
          summary: "Add User",
        });
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.visible = false;
      },
    });
  }

  drawerUpdate(user: User) {
    this.formMode = "update";

    this.visible = true;

    this.userToUpdate = user;

    this.formGroup.patchValue(user);
  }

  updateUser(user: User) {
    console.log(this.formGroup.value);
    this.userService.updateUser(user.id, this.formGroup.value).subscribe({
      next: (response) => {
        const updatedUser = response.data as User;
        const currentUsersList = this.usersSubject.value;
        const updatedList = currentUsersList.map((u) =>
          u.id === user.id ? updatedUser : u,
        );
        this.usersSubject.next([...updatedList]);
        this.visible = false;
        this.messageService.add({
          severity: "success",
          summary: "User Updated",
          detail: "User Udpated Successfully",
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: (response) => {
        const currentUserList = this.usersSubject.value;
        this.usersSubject.next(currentUserList.filter((u) => u.id !== user.id));
        this.visible = false;
        this.messageService.add({
          severity: "success",
          summary: "User Deleted",
          detail: "User Deleted Successfully",
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
