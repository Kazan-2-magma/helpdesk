import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
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

  private ticketService = inject(UserTicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  ticket: Ticket | null = null;
  comments: CommentData[] = [];
  replyForm!: FormGroup;
  loading = true;
  submitting = false;
  error = "";
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
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading ticket:", err);
        this.error = "Failed to load ticket details";
        this.loading = false;
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

    const formData = new FormData();
    formData.append("message", this.editorContent);

    this.selectedFiles.forEach((file) => {
      formData.append("attachments[]", file);
    });

    
    this.ticketService.addComment(+ticketId!, formData).subscribe({
      next: (response: any) => {
        this.comments.push(response.data);
        this.editorContent = "";
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
    this.router.navigate(["/user/tickets"]);
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
