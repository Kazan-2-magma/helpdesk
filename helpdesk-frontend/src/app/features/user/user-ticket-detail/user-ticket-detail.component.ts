import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule, formatDate } from "@angular/common";
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserTicketService } from "../service/tickets/user-ticket.service";
import { Ticket } from "../../../shared/interfaces";
import { AuthService } from "../../../core/services/auth.service";
import { ROLE } from "../../../shared/enum/enumes";

interface CommentData {
  id: number;
  message: string;
  user_id: number;
  user_name: string;
  user?: {
    id: number;
    name: string;
    role: string;
  };
  created_at: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: number;
  filename: string;
  url: string;
  size: number;
}

@Component({
  selector: "app-user-ticket-detail",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./user-ticket-detail.component.html",
  styleUrl: "./user-ticket-detail.component.css",
})
export class UserTicketDetailComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild("editorDiv") editorDiv!: ElementRef<HTMLDivElement>;

  private ticketService = inject(UserTicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  ticket: Ticket | null = null;
  comments: CommentData[] = [];
  replyForm!: FormGroup;
  loading = true;
  submitting = false;
  error = "";
  isAgent = false;
  selectedStatus: "open" | "resolved" | "closed" = "open";
  updatingStatus = false;
  selectedFiles: File[] = [];
  editorContent = "";
  quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, false] }],
      ["link"],
      ["clean"],
    ],
  };

  ngOnInit(): void {
    this.isAgent = this.authService.getUserRole() === ROLE.AGENT;
    this.initializeForm();
    this.loadTicketDetail();
  }

  initializeForm(): void {
    this.replyForm = this.formBuilder.group({
      message: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  execCommand(command: string): void {
    document.execCommand(command, false);
  }

  onEditorInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.editorContent = target.innerHTML || "";
    if (this.replyForm) {
      this.replyForm.get("message")?.setValue(this.editorContent, {
        emitEvent: false,
      });
    }
  }

  loadTicketDetail(): void {
    const ticketId = this.route.snapshot.paramMap.get("id");
    if (!ticketId) {
      this.error = "Ticket ID not found";
      this.loading = false;
      return;
    }

    this.ticketService.getTicketDetail(+ticketId).subscribe({
      next: (response: any) => {
        this.ticket = response.data;
        this.comments = response.data.comments || [];
        this.selectedStatus = response.data?.status ?? "open";
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading ticket:", err);
        this.error = "Failed to load ticket details";
        this.loading = false;
      },
    });
  }

  updateStatus(): void {
    if (!this.ticket) return;

    this.updatingStatus = true;
    this.ticketService
      .updateTicket(this.ticket.id, { status: this.selectedStatus })
      .subscribe({
        next: (response: any) => {
          if (this.ticket) {
            this.ticket.status = response?.data?.status ?? this.selectedStatus;
          }
          this.updatingStatus = false;
        },
        error: (err) => {
          console.error("Error updating status:", err);
          this.error = "Failed to update ticket status";
          this.updatingStatus = false;
        },
      });
  }

  submitReply(): void {
    // if (!this.replyForm.valid || !this.ticket || !this.editorContent.trim()) {
    //   console.log("Click " , this.replyForm , this.ticket,this.editorContent);
    //   return;
    // }

    this.submitting = true;
    const ticketId = this.route.snapshot.paramMap.get("id");

    const message =
      this.editorContent.trim() ||
      this.editorDiv?.nativeElement?.innerText?.trim() ||
      "";

    if (!ticketId) {
      this.error = "Invalid ticket ID.";
      this.submitting = false;
      return;
    }

    if (!message) {
      this.error = "Please enter a message before sending.";
      this.submitting = false;
      return;
    }

    const formData = new FormData();
    formData.append("message", message);
    formData.append("ticket_id", ticketId);

    this.selectedFiles.forEach((file) => {
      formData.append("attachments[]", file);
    });

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    this.ticketService.addComment(+ticketId, formData).subscribe({
      next: (response: any) => {
        this.comments.push(response.data);
        this.editorContent = "";
        if (this.editorDiv?.nativeElement) {
          this.editorDiv.nativeElement.innerHTML = "";
        }
        this.selectedFiles = [];
        this.replyForm.reset();
        this.submitting = false;
      },
      error: (err) => {
        console.error("Error submitting reply:", err);
        this.error = "Failed to submit reply";
        this.submitting = false;
      },
    });
  }

  goBack(): void {
    const returnPath = this.router.url.startsWith("/agent/")
      ? "/agent/tickets"
      : "/user/tickets";
    this.router.navigate([returnPath]);
  }

  isAgentComment(comment: CommentData): boolean {
    return comment.user?.role === "agent";
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "closed":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
      case "open":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
    }
  }
}
